# Decision Log

Tracks all key decisions made by agents.

Format:
- Decision:
- Options:
- Chosen:
- Reason:
- Impact:

---

## Run 001 — 2026-04-02

### Decision 1: Database Selection
- Decision: Which database to use
- Options: SQLite (stack-philosophy default), PostgreSQL
- Chosen: PostgreSQL
- Reason: User specified "whatever works" for budget. App requires real-time multi-user concurrency (voice chat, live stat tracking, simultaneous players) which warrants Postgres. Stack-philosophy Rule 5: "Power users will tell you what they want."
- Impact: Requires PostgreSQL installed on dev machine. More robust for production.

### Decision 2: Authentication Approach
- Decision: How users authenticate
- Options: Email+password, Magic link, Google OAuth
- Chosen: Email + password (bcrypt + JWT)
- Reason: User explicitly chose email + password. Simple, no third-party dependencies.
- Impact: bcrypt for hashing, JWT for sessions (7-day expiry), stored in localStorage.

### Decision 3: First 2 Features (Turn 1)
- Decision: Which features to build first
- Options: Any combination of 11 must-have features
- Chosen: Authentication System + Team Management
- Reason: Every other feature depends on user identity and team context. Voice chat needs to know who's in the session. Stats need player identity. Leaderboards need player records. These are foundational.
- Impact: All subsequent features can build on auth + teams.

### Decision 4: Tech Stack
- Decision: Full technology stack
- Options: Multiple framework combinations
- Chosen: React+Vite (PWA), Tailwind CSS, Node.js+Express, PostgreSQL, Socket.io, WebRTC+simple-peer, bcrypt+JWT, Web Speech API, Canvas/SVG
- Reason: User said "you pick for me." Stack follows lightweight-first principle (older machine), free-first principle, and supports all app requirements (real-time voice, PWA, live updates).
- Impact: Entire project architecture defined.

### Decision 5: Design Direction
- Decision: Visual aesthetic
- Options: Various styles
- Chosen: 1970s-80s Hockey Night in Canada retro aesthetic. App name: "Goal Posts." Logo is a homage to Hockey Night in Canada branding.
- Reason: User explicitly described this vision.
- Impact: Design tokens derived from classic HNIC color scheme. Dark & sporty feel.

### Decision 6: Build Order (Full 6-Turn Plan)
- Decision: Order of feature implementation across turns
- Chosen: Turn 1: Auth+Teams → Turn 2: Sessions+Stats → Turn 3: Leaderboard+Voice → Turn 4: Soundboard+Highlights → Turn 5: Avatar+Roasts → Turn 6: Jersey+Music
- Reason: Dependency chain. Each turn builds on what the previous established. Data flows downhill.
- Impact: 6 turns to complete all must-have features.

---

## Run 004 — 2026-04-02

### Decision 7: Socket.io Integration for Real-Time
- Decision: How to implement real-time game session updates
- Options: Polling, Server-Sent Events, Socket.io
- Chosen: Socket.io (as specified in onboarding)
- Reason: User's tech stack explicitly includes Socket.io. Real-time is critical for game sessions — players joining/leaving, stats being recorded, disputes being voted on must update instantly for all participants.
- Impact: socket.io v4 added to server+client. Server uses HTTP server wrapping Express. Socket rooms per session (`session:{id}`). Vite proxy configured for WebSocket.

### Decision 8: Socket.io Access Pattern in Routes
- Decision: How routes emit Socket.io events
- Options: Import io directly, attach to app via app.set(), pass as middleware
- Chosen: `app.set('io', io)` + `req.app.get('io')` in route handlers
- Reason: Follows Express conventions. Avoids circular imports. Models stay pure (no socket dependency). Routes emit events after successful DB operations.
- Impact: Clean separation — models handle data, routes handle HTTP + emit events.

### Decision 9: Dispute Resolution Flow
- Decision: How stat disputes are resolved
- Options: Simple majority, unanimous, commissioner-only, hybrid
- Chosen: Hybrid — all players vote. Majority wins. If tied, commissioner breaks tie.
- Reason: Matches user's onboarding answer exactly: "Goes to secret vote. Most votes wins. Tie → commissioner decides."
- Impact: Auto-resolves when all session players have voted AND there's a clear majority. Tied disputes emit 'dispute-tied' event and wait for commissioner. Overturned stats are deleted from DB. Upheld stats have disputed flag cleared.

### Decision 10: Session State Machine
- Decision: Game session lifecycle states
- Options: Various state machines
- Chosen: waiting → active → completed (3 states, forward-only)
- Reason: Matches existing migration schema exactly (CHECK constraint on status column). Simple and sufficient — no pausing needed per user requirements.
- Impact: Only one active/waiting session per team at a time. Creator or commissioner can start/end.
