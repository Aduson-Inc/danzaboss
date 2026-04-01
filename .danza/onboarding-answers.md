# Onboarding Answers

Status: COMPLETE
Date: 2026-04-01

---

## What does the app do?
Goal Post is a recreational basketball stat-tracking app. Teams log live game stats during pickup/league games, confirm results post-game via majority vote, and track season performance over time.

## Core features?
- Email auth + invite links (join a team via link)
- Team profiles (team name, logo, roster)
- Player profiles (individual stats, bio)
- Live game mode (tap-to-log stats during a game)
- Post-game point confirmation (majority vote from players to confirm stats)
- Team chat (messaging within a team)
- Game history (past games with box scores)
- Season stats (aggregated stats over a season/time period)
- Awards/badges (achievements based on performance)
- Mobile-first responsive design

## Must-haves vs nice-to-haves?
Must-haves: Auth, team/player profiles, live game mode, post-game confirmation, game history, season stats
Nice-to-haves: Team chat, awards/badges

## Auth required?
Yes. Email-based authentication. Invite links for joining teams.

## Payments required?
No. No payments or billing.

## Tech stack preferences?
- Next.js 14 (App Router)
- Supabase (auth, database, realtime)
- Tailwind CSS
- Vercel (deployment)

## UI expectations?
- Mobile-first design
- Dark mode primary
- Electric blue on black color scheme
- Sporty aesthetic

## Data storage?
Supabase (PostgreSQL). Handles auth, database, and realtime subscriptions.

## Constraints?
- Timeline: ASAP
- No payments
- Mobile-first priority

## Post-game confirmation model?
Majority vote. Not unanimous. A majority of players in the game must confirm for stats to be locked in.

## Anything else?
User confirmed: "That covers it." Onboarding complete.
