# Onboarding Misses

Tracks missing questions and process gaps discovered during development.
This improves future onboarding automatically.

---

## Miss #1: No Competitive Research
- Discovered: 2026-04-01 (post-mortem)
- What happened: User described a basketball stat tracker. No research was done on existing apps in this space.
- What should happen: When the app concept is described, Carmella researches competing/similar products and brings findings back to Tony D before finalizing features.
- Added to onboarding: YES -- Prevention Rule P3

## Miss #2: "No Preference" Not Treated as Research Trigger
- Discovered: 2026-04-01 (post-mortem)
- What happened: User said "no preference" on tech stack. Tony D picked a stack without research.
- What should happen: "No preference" or "I don't know" on any technical decision triggers Carmella research. Tony D presents options with reasoning, not a unilateral pick.
- Added to onboarding: YES -- Prevention Rule P4

## Miss #3: Design Preferences Recorded But Not Acted On
- Discovered: 2026-04-01 (post-mortem)
- What happened: User said "electric blue on black." This was written in onboarding-answers.md but design-tokens.json was never populated. Hank was never spawned.
- What should happen: When visual preferences are stated, Hank is spawned to produce a real design token set immediately.
- Added to onboarding: YES -- Prevention Rule P3

## Miss #4: Build Order Not Consulted
- Discovered: 2026-04-01 (post-mortem)
- What happened: Feature list was created without consulting Mona for standard build order patterns.
- What should happen: Before creating a feature list, Tony D checks with Mona for existing build order templates for the app type.
- Added to onboarding: YES -- Prevention Rule P3

## Miss #5: Edge Cases Not Explored for Novel Features
- Discovered: 2026-04-01 (post-mortem)
- What happened: The majority vote confirmation system is the most unique feature. No edge cases were explored (vote timeout, absent players, dispute resolution, minimum voter threshold).
- What should happen: For any feature identified as novel or non-standard, Tony D must explore at least 3 edge cases with the user.
- Added to onboarding: PENDING -- needs new template question

## Miss #6: User Memory Not Incorporated
- Discovered: 2026-04-01 (post-mortem)
- What happened: User memory files existed documenting preferences (skip formal processes, use research pipeline, direct communication). These were available but not honored during onboarding.
- What should happen: Tony D reads all user memory files before starting onboarding and adjusts approach accordingly.
- Added to onboarding: YES -- Prevention Rule P7

## Miss #7: Supabase Account Setup Not Addressed
- Discovered: 2026-04-01 (post-mortem, from user feedback)
- What happened: User explicitly mentioned that onboarding "didn't help with Supabase signup." Tony D chose Supabase but did not help the user set up an account or project.
- What should happen: When an external service is selected as part of the stack, Tony D must either (a) confirm the user already has it set up, or (b) provide setup guidance or spawn Carmella for setup documentation.
- Added to onboarding: PENDING -- needs new onboarding step
