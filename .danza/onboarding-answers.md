# Onboarding Answers

Status: COMPLETED (2026-04-02, Run 001)

---

## 1. Project Overview
- **App Name:** Goal Posts
- **Concept:** Mobile companion app for NHL 26 video game crew
- **Type:** Social/community — small group (2-6 players) who play NHL 26 together online
- **Core Activity:** Voice chat during games + live stat tracking + post-game highlights with savage roasts

## 2. Core Goals

### Must-Haves (V1)
1. Voice chat during games (WebRTC, 2-6 players)
2. Live stat tracking (tap to record goals/assists/penalties)
3. Team management (commissioner creates team, invites, manages roster)
4. Stat leaderboard (cumulative stats across games)
5. Game session flow (create → connect → play → end → highlights)
6. Post-game highlight screen (hockey rink formation view)
7. Live soundboard (goal horn, boos, cheers — heard by all in voice chat)
8. Player roast system (player-written roasts → AI selects → TTS hockey announcer voice)
9. Custom Hockey Night in Canada mock theme music
10. Cartoon avatar builder (eyes, nose, hair, facial hair, helmet)
11. Team jersey designer (commissioner designs master jersey)

### Nice-to-Haves (V2+)
- Advanced jersey designer
- Custom player videos (6-10 seconds)
- AI video mashup + roast narration
- Discord integration

### Edge Cases Explored
- **Stat disputes:** Goes to secret vote. Most votes wins. Tie → commissioner decides (or delegates tiebreaker). Voting is secret.
- **Roast calibration by role:** Commissioner = full roast. Captain = mild break. Goalie = ALWAYS protected, never roasted. Players = full savage mode.

## 3. User Flow
1. Register with email + password
2. Create a team (commissioner) OR join via invite code (player)
3. Commissioner assigns positions (LW, C, RW, LD, RD, G) and roles
4. Create game session → everyone connects to voice chat during NHL 26 matchmaking
5. During game: tap to log stats, press soundboard buttons (goal horn, boos, cheers)
6. End game → post-game highlight screen (formation view on hockey rink with avatar circles)
7. AI announcer reads player-written roasts in hockey broadcaster voice
8. Option to start new game or log out
9. Stats accumulate into leaderboard over time

## 4. Authentication
- **Type:** Email + password
- **Method:** bcrypt for hashing, JWT for sessions
- **Roles:** Commissioner (full control), Captain (assigned, mild roast protection), Goalie (always protected from roasts), Player (no protection)

## 5. Data & Storage
- **Database:** PostgreSQL
- **Budget:** Whatever works (not concerned about cost)
- **Data stored:** User accounts, team data, game sessions, stats, player profiles, roast paragraphs, jersey designs, avatar data

## 6. API / External Services
- **Voice Chat:** Built-in WebRTC (no external service, browser-native)
- **Real-time:** Socket.io for game sessions, live updates, goal light sync
- **Text-to-Speech:** Web Speech API (browser built-in, free)
- **No paid external services required for V1**

## 7. Frontend / UI
- **Platform:** Mobile web app (PWA) — no app store
- **Design:** 1970s-80s Hockey Night in Canada retro aesthetic
- **Logo:** Homage/knockoff of classic Hockey Night in Canada branding
- **Formation screen:** Bottom half of hockey rink (white ice, boards), player avatar circles floating on ice in formation (LW, C, RW, LD, RD, G)
- **Goal light:** Red goal light button that animates like real arena siren when pressed
- **Avatars:** Cartoon face builder + team master jersey
- **Colors:** Derived from classic HNIC logos (red, navy blue, gold, white ice, dark boards)

## 8. Tech Stack
- **Chosen by:** Tony D (user said "you pick for me")
- **Frontend:** React + Vite (PWA)
- **Styling:** Tailwind CSS with custom design tokens
- **Voice:** WebRTC + simple-peer
- **Real-time:** Socket.io
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** bcrypt + JWT
- **TTS:** Web Speech API
- **Avatar/Rink:** Canvas/SVG

## 9. Constraints
- **Timeline:** No rush
- **Machine:** Older — keep tools lightweight (Vite, no Docker)
- **Hosting:** Deal with it later

## 10. Final Check
- Live soundboard buttons (goal horn, boos, cheers) — confirmed must work during live gameplay
- Mock Hockey Night in Canada theme music — confirmed
- Nothing else missed
