# Feature List — Goal Post

Status: AWAITING USER APPROVAL
Last Updated: 2026-04-01

---

## How to read this list

Features are built 2 at a time in the DANZA relay cycle. Each "Turn" is a pair that gets built, tested by Bonnie, and handed off before the next pair begins. Features are ordered so dependencies are satisfied before the features that need them.

Status key: [ ] Not started | [~] In progress | [x] Completed

---

## Section 1: Foundation (Database + Auth)

### Turn 1
- [ ] **F1: Supabase Project Setup + Database Schema**
  Design and create all core database tables: users, teams, team_members, games, game_players, stat_entries, chat_messages, badges. Set up Row Level Security policies. This is the foundation everything else depends on.

- [ ] **F2: Email Authentication + Protected Routes**
  Implement Supabase email auth (sign up, sign in, sign out). Create auth context/provider. Build login and register pages. Set up middleware for protected routes. All subsequent features require a logged-in user.

### Turn 2
- [ ] **F3: Player Profiles (Create + View)**
  After auth, users create their player profile (display name, position, avatar/photo, bio). Profile view page showing player info. This is needed before teams can have rosters.

- [ ] **F4: Team Creation + Invite Links**
  Logged-in users can create a team (name, logo/color). Generate unique invite links. Other users can join a team via invite link. Team-member relationship stored in DB. Teams are required before games can happen.

---

## Section 2: Team Experience

### Turn 3
- [ ] **F5: Team Profile Page + Roster View**
  Public-facing team profile showing team name, logo/color, full roster with player cards. Team settings page for the team creator (edit name, regenerate invite link).

- [ ] **F6: Team Dashboard (Home Screen)**
  The main landing page after login. Shows the user's team(s), upcoming/recent games, quick-action buttons (start game, view stats). This is the hub that connects all other features.

---

## Section 3: Core Gameplay

### Turn 4
- [ ] **F7: Game Creation + Pre-Game Setup**
  Create a new game: select two teams (or pick-up mode), set date/location, select active players from roster. Game gets a unique ID and status (pending/live/completed). This is the entry point for live game mode.

- [ ] **F8: Live Game Mode (Stat Logging)**
  Real-time stat entry screen. Tap-to-log interface: points, rebounds, assists, steals, blocks, turnovers per player. Running score displayed. Uses Supabase realtime so all connected players see updates live. Mobile-optimized tap targets.

### Turn 5
- [ ] **F9: Post-Game Summary + Majority Vote Confirmation**
  When game ends, display full box score to all participants. Each player can vote to confirm or dispute the stats. Majority vote (>50% of participants) locks the stats as official. Disputed stats get flagged for review. Game status moves to "confirmed" or "disputed."

- [ ] **F10: Game History + Box Scores**
  List of all past games for a team/player. Each game links to a detailed box score view showing all player stats from that game. Filter by date range, opponent, or player.

---

## Section 4: Stats + Recognition

### Turn 6
- [ ] **F11: Season Stats + Leaderboards**
  Aggregated stats per player across all confirmed games: points per game, rebounds per game, etc. Team-level leaderboards (who leads in each category). Time-period filters (last 7 days, last 30, season, all-time).

- [ ] **F12: Awards + Badges**
  Achievement system: badges earned for milestones (first game, 100 points, triple-double, etc.). Display on player profile. Post-game awards (game MVP, most assists that game). Badge notification when earned.

---

## Section 5: Communication

### Turn 7
- [ ] **F13: Team Chat**
  Real-time messaging within a team using Supabase realtime subscriptions. Message list, input field, timestamps, player avatars. Basic functionality: text messages, auto-scroll, unread indicators.

- [ ] **F14: Polish + Final Mobile Optimization**
  Full responsive audit across all screens. Touch target sizing, loading states, empty states, error states. PWA setup (manifest, icons) so it can be added to home screen. Performance optimization pass.

---

## Summary

| Turn | Features | Dependencies |
|------|----------|-------------|
| 1 | F1 (DB Schema) + F2 (Auth) | None — foundation |
| 2 | F3 (Player Profiles) + F4 (Team Creation + Invites) | Requires F1, F2 |
| 3 | F5 (Team Profile Page) + F6 (Team Dashboard) | Requires F3, F4 |
| 4 | F7 (Game Creation) + F8 (Live Game Mode) | Requires F4, F5 |
| 5 | F9 (Post-Game Vote) + F10 (Game History) | Requires F8 |
| 6 | F11 (Season Stats) + F12 (Awards/Badges) | Requires F9, F10 |
| 7 | F13 (Team Chat) + F14 (Polish + PWA) | Requires F4; F14 touches all |

Total: 14 features across 7 turns
