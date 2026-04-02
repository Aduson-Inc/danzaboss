# System Map

Last updated: 2026-04-02 (Run 004, Turn 2)

## Architecture

```
[Mobile Browser] → [React PWA (Vite)] → [Express API] → [PostgreSQL]
                        :5173               :3001
                           ↕ (WebSocket)
                      [Socket.io Client] → [Socket.io Server]
```

## File Structure

```
client/                          # React + Vite PWA
├── src/
│   ├── App.jsx                  # Router (react-router-dom v6) + providers
│   ├── main.jsx                 # Entry point (React 18 createRoot)
│   ├── index.css                # Tailwind + global styles
│   ├── api/
│   │   ├── client.js            # Axios + JWT interceptor
│   │   └── socket.js            # Socket.io client instance (Turn 2)
│   ├── context/
│   │   ├── AuthContext.jsx      # User state, login/register/logout
│   │   ├── TeamContext.jsx      # Teams state, CRUD, roster management
│   │   └── GameContext.jsx      # Game session + stats + disputes + socket events (Turn 2)
│   ├── hooks/
│   │   ├── useAuth.js           # AuthContext consumer
│   │   ├── useTeam.js           # TeamContext consumer
│   │   └── useGame.js           # GameContext consumer (Turn 2)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx  # Outlet-based route guard
│   │   ├── team/
│   │   │   ├── CreateTeam.jsx
│   │   │   ├── TeamRoster.jsx      # Roster display + commissioner controls
│   │   │   ├── InvitePlayer.jsx    # Generate invite codes
│   │   │   └── JoinTeam.jsx        # Join via invite code
│   │   ├── game/                   # (Turn 2)
│   │   │   ├── SessionLobby.jsx    # Create/join/start session, player list
│   │   │   ├── StatTracker.jsx     # Player select + tap goal/assist/penalty + live scoreboard
│   │   │   ├── StatFeed.jsx        # Live stat feed with dispute button
│   │   │   ├── DisputePanel.jsx    # Voting UI + commissioner tiebreaker
│   │   │   └── SessionSummary.jsx  # Post-game stat summary table
│   │   └── layout/
│   │       ├── AppShell.jsx        # Header + content wrapper
│   │       └── BottomNav.jsx       # Mobile bottom navigation
│   └── pages/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── DashboardPage.jsx       # Team list + create/join actions
│       ├── CreateTeamPage.jsx
│       ├── JoinTeamPage.jsx
│       ├── TeamPage.jsx            # Team details + roster + invites + game session link
│       └── GameSessionPage.jsx     # Full game session flow (Turn 2)

server/                          # Node.js + Express + Socket.io
├── src/
│   ├── index.js                 # Express + HTTP server + Socket.io + routes
│   ├── config/
│   │   ├── db.js                # pg Pool (DATABASE_URL)
│   │   ├── auth.js              # JWT_SECRET + JWT_EXPIRY
│   │   └── migrate.js           # SQL migration runner
│   ├── middleware/
│   │   ├── auth.js              # JWT verification → req.user
│   │   └── errorHandler.js      # Centralized error handler
│   ├── routes/
│   │   ├── auth.js              # /api/auth/* (register, login, me)
│   │   ├── teams.js             # /api/teams/* (CRUD, invite, roles)
│   │   ├── sessions.js          # /api/sessions/* (create, join, start, end) (Turn 2)
│   │   └── stats.js             # /api/stats/* (record, dispute, vote, resolve) (Turn 2)
│   ├── models/
│   │   ├── User.js              # users table queries
│   │   ├── Team.js              # teams table queries (transactional create)
│   │   ├── TeamMember.js        # team_members join table queries
│   │   ├── Invite.js            # invites table queries
│   │   ├── GameSession.js       # game_sessions + game_session_players queries
│   │   ├── GameStat.js          # game_stats queries + session summary
│   │   └── StatDispute.js       # stat_disputes + dispute_votes queries (transactional resolve)
│   └── utils/
│       └── generateInviteCode.js
└── migrations/
    ├── 001_create_users.sql
    ├── 002_create_teams.sql
    ├── 003_create_team_members.sql
    ├── 004_create_invites.sql
    ├── 005_create_game_sessions.sql
    ├── 006_create_game_session_players.sql
    ├── 007_create_game_stats.sql
    ├── 008_create_stat_disputes.sql
    └── 009_create_dispute_votes.sql
```

## API Endpoints

### Auth (no auth required)
- POST /api/auth/register → Create account, return JWT
- POST /api/auth/login → Authenticate, return JWT

### Auth (JWT required)
- GET /api/auth/me → Current user profile
- PUT /api/auth/me → Update profile

### Teams (JWT required)
- POST /api/teams → Create team (creator = commissioner)
- GET /api/teams/my → User's teams
- GET /api/teams/:id → Team + roster (members only)
- POST /api/teams/:id/invite → Generate invite (commissioner only)
- POST /api/teams/join → Join via invite code
- PUT /api/teams/:id/members/:userId/role → Change role (commissioner only)
- PUT /api/teams/:id/members/:userId/position → Assign position (commissioner only)
- DELETE /api/teams/:id/members/:userId → Remove member (commissioner only)

### Sessions (JWT required) — Turn 2
- POST /api/sessions → Create session (team members only, one active per team)
- GET /api/sessions/team/:teamId → List sessions for team
- GET /api/sessions/team/:teamId/active → Get active session
- GET /api/sessions/:id → Session details + players
- POST /api/sessions/:id/join → Join session
- POST /api/sessions/:id/leave → Leave session
- POST /api/sessions/:id/start → Start game (creator/commissioner)
- POST /api/sessions/:id/end → End game (creator/commissioner)

### Stats (JWT required) — Turn 2
- POST /api/stats → Record stat (goal/assist/penalty, session must be active)
- GET /api/stats/session/:sessionId → Get all stats for session
- GET /api/stats/session/:sessionId/summary → Get session stat summary (G/A/PIM per player)
- POST /api/stats/:id/dispute → Dispute a stat
- GET /api/stats/disputes/session/:sessionId → Get session disputes
- POST /api/stats/disputes/:id/vote → Cast vote (uphold/overturn)
- POST /api/stats/disputes/:id/commissioner-resolve → Commissioner tiebreaker

### Socket.io Events — Turn 2
- Client → Server: join-session, leave-session
- Server → Client: player-joined, player-left, session-started, session-ended, stat-recorded, stat-disputed, dispute-vote-cast, dispute-tied, dispute-resolved

## Data Flow

```
Register/Login → JWT stored in localStorage
                    ↓
Axios interceptor attaches Bearer token
                    ↓
Express auth middleware verifies JWT → req.user.userId
                    ↓
Models execute parameterized SQL via pg Pool
                    ↓
PostgreSQL (tables: users, teams, team_members, invites,
            game_sessions, game_session_players, game_stats,
            stat_disputes, dispute_votes)
                    ↓
Socket.io broadcasts real-time updates to session rooms
```

## Database Schema

- **users**: id, email, password_hash, display_name, avatar_data (JSONB), roast_paragraphs (TEXT[])
- **teams**: id, name, commissioner_id (FK→users), jersey_data (JSONB)
- **team_members**: team_id + user_id (unique), role (commissioner|captain|goalie|player), position (LW|C|RW|LD|RD|G)
- **invites**: team_id, code (8-char unique), created_by, used_by, expires_at (48hr)
- **game_sessions**: id, team_id (FK→teams), created_by (FK→users), status (waiting|active|completed), started_at, ended_at
- **game_session_players**: id, session_id (FK→game_sessions) + user_id (unique), joined_at
- **game_stats**: id, session_id (FK→game_sessions), user_id (FK→users), stat_type (goal|assist|penalty), recorded_by (FK→users), disputed (BOOLEAN)
- **stat_disputes**: id, stat_id (FK→game_stats), session_id (FK→game_sessions), disputed_by (FK→users), reason (TEXT), status (open|upheld|overturned), resolved_by (vote|commissioner|null), resolved_at
- **dispute_votes**: id, dispute_id (FK→stat_disputes) + user_id (unique), vote (uphold|overturn)

## Dependencies

### Client
- react 18, react-dom, react-router-dom 6
- axios (HTTP client)
- socket.io-client 4 (real-time)
- vite 5, @vitejs/plugin-react
- tailwindcss 3, postcss, autoprefixer

### Server
- express 4, cors
- pg (PostgreSQL client)
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- socket.io 4 (real-time WebSocket)
- dotenv
- nodemon (dev)

## Known Gaps (for future turns)
- No WebRTC/simple-peer yet (needed for Turn 3: voice chat)
- No Web Speech API integration yet (needed for Turn 5: roasts)
- No Canvas/SVG components yet (needed for Turn 5: avatar builder)
