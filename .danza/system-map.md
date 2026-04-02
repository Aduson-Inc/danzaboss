# System Map

Last updated: 2026-04-02 (Run 001, Turn 1)

## Architecture

```
[Mobile Browser] → [React PWA (Vite)] → [Express API] → [PostgreSQL]
                        :3000                :3001
```

## File Structure

```
client/                          # React + Vite PWA
├── src/
│   ├── App.jsx                  # Router (react-router-dom v6)
│   ├── main.jsx                 # Entry point (React 18 createRoot)
│   ├── index.css                # Tailwind + global styles
│   ├── api/client.js            # Axios + JWT interceptor
│   ├── context/
│   │   ├── AuthContext.jsx      # User state, login/register/logout
│   │   └── TeamContext.jsx      # Teams state, CRUD, roster management
│   ├── hooks/
│   │   ├── useAuth.js           # AuthContext consumer
│   │   └── useTeam.js           # TeamContext consumer
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
│   │   └── layout/
│   │       ├── AppShell.jsx        # Header + content wrapper
│   │       └── BottomNav.jsx       # Mobile bottom navigation
│   └── pages/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── DashboardPage.jsx       # Team list + create/join actions
│       ├── CreateTeamPage.jsx
│       ├── JoinTeamPage.jsx
│       └── TeamPage.jsx            # Team details + roster + invites

server/                          # Node.js + Express
├── src/
│   ├── index.js                 # Express app + middleware + routes
│   ├── config/
│   │   ├── db.js                # pg Pool (DATABASE_URL)
│   │   ├── auth.js              # JWT_SECRET + JWT_EXPIRY
│   │   └── migrate.js           # SQL migration runner
│   ├── middleware/
│   │   ├── auth.js              # JWT verification → req.user
│   │   └── errorHandler.js      # Centralized error handler
│   ├── routes/
│   │   ├── auth.js              # /api/auth/* (register, login, me)
│   │   └── teams.js             # /api/teams/* (CRUD, invite, roles)
│   ├── models/
│   │   ├── User.js              # users table queries
│   │   ├── Team.js              # teams table queries (transactional create)
│   │   ├── TeamMember.js        # team_members join table queries
│   │   └── Invite.js            # invites table queries
│   └── utils/
│       └── generateInviteCode.js
└── migrations/
    ├── 001_create_users.sql
    ├── 002_create_teams.sql
    ├── 003_create_team_members.sql
    └── 004_create_invites.sql
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
PostgreSQL (tables: users, teams, team_members, invites)
```

## Database Schema

- **users**: id, email, password_hash, display_name, avatar_data (JSONB), roast_paragraphs (TEXT[])
- **teams**: id, name, commissioner_id (FK→users), jersey_data (JSONB)
- **team_members**: team_id + user_id (unique), role (commissioner|captain|goalie|player), position (LW|C|RW|LD|RD|G)
- **invites**: team_id, code (8-char unique), created_by, used_by, expires_at (48hr)

## Dependencies

### Client
- react 18, react-dom, react-router-dom 6
- axios (HTTP client)
- vite 5, @vitejs/plugin-react
- tailwindcss 3, postcss, autoprefixer

### Server
- express 4, cors
- pg (PostgreSQL client)
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- dotenv
- nodemon (dev)

## Known Gaps (for future turns)
- No Socket.io yet (needed for Turn 2: game sessions)
- No WebRTC/simple-peer yet (needed for Turn 3: voice chat)
- No Web Speech API integration yet (needed for Turn 5: roasts)
- No Canvas/SVG components yet (needed for Turn 5: avatar builder)
