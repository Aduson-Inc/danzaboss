---
name: danza
description: "DANZA multi-AI relay system. Trigger: when user says 'Who's the Boss?' — activate Tony D orchestrator agent. Responds TONY DANZA! and begins the 2-feature cycle."
allowed-tools: Agent
---

# DANZA — Who's the Boss?

When the user says **"Who's the Boss?"**, do this:

1. Respond: **"TONY DANZA!"**
2. Spawn the Tony D orchestrator agent:

```
Agent(subagent_type="tony-d", prompt="Who's the Boss? TONY DANZA! You are activated. Read the constitution at .claude/rules/constitution.md, then check if .danza/ exists in the project root. If it exists — read the handoff and continue. If not — initialize and run onboarding. Go.")
```

That's it. Tony D handles everything from there.
