# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is DANZA?

A multi-AI relay development system. Two AIs take turns building an app — 2 features per turn, then hand off. The trigger phrase is **"Who's the Boss?"** and the system responds **"TONY DANZA!"** (named after the 80s TV show). All state persists in `.danza/` at the project root.

## Trigger

Say "Who's the Boss?" to activate. This invokes the `/danza` skill which spawns Tony D, the orchestrator agent. Tony D delegates all work to specialized sub-agents.

## Agent Roster

All agents live in `.claude/agents/`:

| Agent | File | Role |
|-------|------|------|
| **Tony D** | `tony-d.md` | The Boss — orchestrates, delegates, manages state, writes handoffs |
| **Jonathan** | `jonathan.md` | Code execution — ONLY agent that writes code |
| **Samantha** | `samantha.md` | System mapper — 6-pass codebase scan, living blueprint |
| **Angela** | `angela.md` | Auditor — decision tracking, loop detection, alerts |
| **Bonnie** | `bonnie.md` | QA — testing, verification, last gate before done |
| **Carmella** | `carmella.md` | Research — YouTube + NotebookLM pipeline |
| **Mona** | `mona.md` | Historian — build patterns, order of operations, learning DB |
| **Hank** | `hank.md` | Frontend designer — colors, fonts, templates, design system |
| **Billy** | `billy.md` | Security — OWASP, auth review, dependency audit (near end of build) |

## Key Architecture

- **Constitution:** `.claude/rules/constitution.md` — 22 unbreakable rules, always loaded
- **Trigger Skill:** `.claude/skills/danza/SKILL.md` — activates Tony D on "Who's the Boss?"
- **Research Pipeline:** `tools/research-pipeline/` — YouTube search + NotebookLM for ~1500 token research
- **State Directory:** `.danza/` — shared brain across AI environments (created per-project)

## Research Pipeline

Token-efficient research tool. Carmella uses this.

```bash
# Search YouTube (5-tier, 7-20 results)
python tools/research-pipeline/yt_search.py "<topic>"

# NotebookLM commands (always prefix with PYTHONIOENCODING=utf-8 on Windows)
notebooklm list --json
notebooklm use <notebook_id>
PYTHONIOENCODING=utf-8 notebooklm source add "<url>" --json
PYTHONIOENCODING=utf-8 notebooklm ask "<question>" --json
```

Dependencies: `yt_dlp` (Python), `notebooklm` CLI

## The 2-Feature Cycle

1. **Understand** — Read state files, consult Samantha's map
2. **Execute** — Samantha scans → Jonathan builds → Samantha updates → Angela reviews (per feature)
3. **Verify** — Bonnie tests both features; Carmella researches if external APIs involved
4. **Self-Assess** — Honest checklist before handoff
5. **Handoff** — Write `.danza/handoff.md`, update all state files, pass to next AI

## Hard Stops (Constitution Rules 13-18)

These always require stopping and notifying the user:
- Touching auth/security logic
- Touching payment/billing logic
- Touching database schema
- Deleting files or features
- Conflicting with system map
- Loop detected

## State Files (`.danza/`)

| File | Owner | Purpose |
|------|-------|---------|
| `system-map.md` | Samantha | Living codebase blueprint |
| `decision-log.md` | Angela | All significant decisions |
| `feature-list.md` | Tony D | Feature list with status |
| `handoff.md` | Tony D | Instructions for next AI |
| `turn-log.md` | Tony D | Who did what, when |
| `rankings.json` | Angela | AI performance tracking |
| `build-history.md` | Mona | Build records |
| `patterns.md` | Mona | Reusable patterns |
| `design-tokens.json` | Hank | Colors, fonts, spacing |

## Repository Structure

```
danzaboss/
├── .claude/
│   ├── agents/          # 9 sub-agent definitions
│   ├── skills/danza/    # Trigger skill ("Who's the Boss?")
│   └── rules/           # Constitution (always loaded)
├── tools/
│   └── research-pipeline/
│       ├── SKILL.md     # Research pipeline instructions
│       └── yt_search.py # YouTube URL collector (Python)
└── archive/v0/          # Original v0 skill files
```
