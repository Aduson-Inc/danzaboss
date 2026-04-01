# Decision Log

Tracks all key decisions made by agents.

---

## Decision #1
- Date: 2026-04-01
- Agent: Tony D
- AI Environment: Claude (unknown model)
- Turn: 0 (onboarding)
- Feature: System onboarding
- Decision: Operated onboarding as a solo questionnaire instead of delegating to other agents
- Alternatives: Could have spawned Carmella for research, Hank for design, Mona for build patterns
- Confidence: low
- Status: flagged
- Angela Note: This is the root decision that led to the user's "too passive" feedback. The entire agent roster was available and none were used.

## Decision #2
- Date: 2026-04-01
- Agent: Tony D
- AI Environment: Claude (unknown model)
- Turn: 0 (onboarding)
- Feature: Tech stack selection
- Decision: Chose Next.js 14 (App Router), Supabase, Tailwind CSS, Vercel when user said "no preference"
- Alternatives: Could have triggered Carmella research to evaluate stacks for real-time sports apps. Could have presented 2-3 options with tradeoffs.
- Confidence: low
- Status: flagged
- Angela Note: Stack was assumed, not researched. Supabase Realtime suitability for high-frequency stat logging was not validated.

## Decision #3
- Date: 2026-04-01
- Agent: Tony D
- AI Environment: Claude (unknown model)
- Turn: 0 (onboarding)
- Feature: Feature list creation
- Decision: Created 14-feature, 7-turn build plan without consulting Mona for standard build order patterns
- Alternatives: Could have consulted Mona's build-orders.md for template patterns for mobile-first sports apps
- Confidence: medium
- Status: flagged
- Angela Note: The feature list itself is well-structured, but the process of creating it was not collaborative. Build-orders.md was empty and Mona was never asked to populate it.

## Decision #4
- Date: 2026-04-01
- Agent: Tony D
- AI Environment: Claude (unknown model)
- Turn: 0 (onboarding)
- Feature: Post-game confirmation model
- Decision: Recorded "majority vote" model without exploring edge cases
- Alternatives: Should have explored: vote timeout, absent player handling, dispute resolution flow, minimum voter threshold
- Confidence: medium
- Status: flagged
- Angela Note: The confirmation model is the most novel feature of Goal Post. It deserved deeper exploration.

## Decision #5
- Date: 2026-04-01
- Agent: Tony D
- AI Environment: Claude (unknown model)
- Turn: 0 (onboarding)
- Feature: Design system
- Decision: Recorded "electric blue on black" preference without spawning Hank or populating design-tokens.json
- Alternatives: Should have spawned Hank to produce a full design token set (colors, fonts, spacing, layout)
- Confidence: low
- Status: flagged
- Angela Note: design-tokens.json remains empty. The user's design preference was acknowledged but not acted on.

## Decision #6
- Date: 2026-04-01
- Agent: Tony D
- AI Environment: Claude (unknown model)
- Turn: 0 (onboarding)
- Feature: System response to user feedback
- Decision: Went silent after receiving user feedback instead of expected "go ahead"
- Alternatives: (1) Acknowledge feedback and adapt, (2) Use free pass to ask for clarity, (3) Re-engage with adjusted approach
- Confidence: N/A -- no decision was made, which IS the problem
- Status: flagged
- Angela Note: CRITICAL FAILURE. This non-decision caused a 12-minute stall and user abandonment. Constitution Rule 11 (Free Pass) exists for exactly this situation. It was not used.

## Decision #7 (Angela -- retroactive)
- Date: 2026-04-01
- Agent: Angela
- AI Environment: Claude (Opus 4.6)
- Turn: Post-mortem
- Feature: System accountability
- Decision: Full post-mortem investigation with 5 alerts, 7 prevention rules, and agent definition changes
- Alternatives: Could have done a surface scan only, but the severity of failure justified deep investigation
- Confidence: high
- Status: validated
- Angela Note: First investigation. All findings sourced from state files, constitution, and user memory. Nothing assumed.
