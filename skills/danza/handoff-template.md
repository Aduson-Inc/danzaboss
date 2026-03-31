# Handoff Document Template

Write this to `.danza/handoff.md` after completing your 2 features and passing self-assessment.
Follow this format EXACTLY. No shortcuts. No abbreviated versions.

---

```markdown
# Handoff — Turn [number]

## Meta
- From: [AI environment — e.g., "Claude Code", "Gemini CLI"]
- Date: [timestamp]
- Turn number: [N]
- Features completed this turn: [Feature name 1], [Feature name 2]

## What I Built

### Feature 1: [Name]
[2-3 sentences: what was built, what files were created/modified, how it connects to the rest of the system]

### Feature 2: [Name]
[2-3 sentences: what was built, what files were created/modified, how it connects to the rest of the system]

## Files Changed
Created:
- `[path]` — [one-line purpose]

Modified:
- `[path]` — [what changed]

## Key Decisions
[Reference Snitch's decision log for full details. Summarize the important ones here.]
- Decision #[N]: [one-line summary]
- Decision #[N]: [one-line summary]

## Known Issues
[Any concerns, uncertainties, things to watch. If none: "None — both features verified clean."]

## Next 2 Features

### Feature 1: [Name]
[Clear description: what to build, where it fits in the system, what it connects to, any prerequisites or dependencies. The next AI should be able to start building immediately from this description.]

### Feature 2: [Name]
[Clear description: what to build, where it fits in the system, what it connects to, any prerequisites or dependencies.]

## Context for Next AI
[Anything the next AI needs to know that isn't already in the system map or decision log. Keep this UNDER 500 tokens. If you need more, your state files aren't detailed enough — update them instead of writing a novel here.]

## State File Status
- system-map.md: Updated ✓
- decision-log.md: Updated ✓
- feature-list.md: Updated ✓
- checkpoints.json: Updated ✓
- turn-log.md: Updated ✓
- rankings.json: Updated ✓
- self-assessment-log.md: Updated ✓

## Self-Assessment
- All checks passed: YES
- Concerns flagged: [YES — describe / NO]
```

---

## Rules for this document:

1. **The next AI reads this FIRST.** It must contain everything they need to start.
2. **Keep the delta small.** The "Context for Next AI" section should be ~500 tokens max. The system files carry the heavy context.
3. **Be honest about known issues.** If something is shaky, say so. Don't let the next AI discover it the hard way.
4. **Feature descriptions must be actionable.** Not "build the auth system." Instead: "Build the signup API endpoint at POST /api/auth/signup that accepts {email, password, name}, hashes the password with bcrypt, creates a user record in the users table, and returns a JWT token. Follow the pattern in the existing login endpoint."
5. **All state files must be marked Updated.** If one isn't, fix it before writing this document.
