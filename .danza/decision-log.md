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
