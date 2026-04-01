# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What Is This Repo?

**danzaboss** is a multi-AI relay development framework. It is a portable tool — not an app being built. Users clone or install danzaboss into their own project folder, then AI environments (Claude Code, Gemini CLI, Grok, etc.) take turns building the user's app 2 features at a time.

The repo ships with agent definitions, rules, templates, and tools. Agents execute in the user's project context, never in the danzaboss source repo.

---

## Architecture

```
.claude/              # SYSTEM FILES — immutable during execution
  agents/             # 9 agent definitions (tony-d, jonathan, samantha, angela, bonnie, carmella, mona, hank, billy)
  rules/              # constitution.md — 37+ unbreakable rules
  skills/             # danza/ — trigger skill ("Who's the Boss?")

.danza/               # STATE + TEMPLATES — per-project working directory
  onboarding-template.md   # TEMPLATE (read-only) — onboarding questions
  system-map.md            # STATE — living codebase blueprint (merge, don't overwrite)
  feature-list.md          # STATE — backlog (merge, don't overwrite)
  handoff.md               # STATE — current turn context (merge, don't overwrite)
  onboarding-answers.md    # STATE — user's answers (merge, don't overwrite)
  design-tokens.json       # STATE — design system (merge, don't overwrite)
  checkpoints.json         # STATE — verified stable points (merge, don't overwrite)
  decision-log.md          # LOG — append-only
  turn-log.md              # LOG — append-only
  self-assessment-log.md   # LOG — append-only
  build-history.md         # LOG — append-only
  onboarding-misses.md     # LOG — append-only
  patterns.md              # LOG — append-only
  audit-report-*.md        # LOG — append-only
  rankings.json            # LOG — append-only
  build-orders.md          # LOG — append-only
  logs/                    # RUN LOGS — one file per run (001.md, 002.md, etc.)

tools/                # Custom tooling
  research-pipeline/  # YouTube + NotebookLM research (powers Carmella agent)
```

---

## File Protection Rules (Constitution Rules 34-37)

These are HARD rules. Violation = constitution breach.

1. **Templates are READ-ONLY** — never modified by agents
2. **State files: MERGE, don't overwrite** — read first, then merge new data
3. **Logs: APPEND-ONLY** — add entries at end, never edit/delete existing
4. **System files (.claude/): IMMUTABLE** — never modified without explicit user approval

Full rules: `.claude/rules/constitution.md`

---

## Trigger

User says: **"Who's the Boss?"**

System responds: **TONY DANZA!**

This activates Tony D (orchestrator) who reads state and begins a turn.

---

## Mode Detection

The `.danza/` folder ALWAYS exists — it ships with the tool. Folder presence is NOT a mode signal.

Mode is determined by reading `.danza/handoff.md`:
- **"No handoff yet."** → NEW PROJECT MODE — run full onboarding (onboarding-template.md)
- **Actual handoff data** (turn number, features, next steps) → CONTINUE MODE — cross-reference with `.danza/logs/` to verify state, then resume

---

## Core Principles

1. **No Assumptions** — reality comes ONLY from codebase, state files, onboarding answers, or verified research. Unknown = STOP.
2. **2-Feature Limit** — each turn builds exactly 2 features. Overflow goes to feature-list.md.
3. **Turn-Based Execution** — only one AI system acts at a time. Must read handoff.md. Must confirm it's your turn.
4. **Confidence Tagging** — all outputs tagged: ✅ Verified, ⚠️ Assumed, ❓ Unknown.
5. **Hard Stops** — auth, payments, DB schema, file deletion, system map conflicts, loops → STOP and notify user.
6. **Self-Audit Before Handoff** — verify no assumptions, everything tested, no unknown dependencies.
7. **Learning System** — missed questions go to onboarding-misses.md. System evolves.

---

## Agent Roster

| Agent | Role | What they do |
|-------|------|-------------|
| Tony D | Orchestrator | Reads state, delegates, manages turns, writes handoffs |
| Jonathan | Builder | ONLY agent that writes code. Follows existing style exactly. |
| Samantha | Mapper | 6-pass codebase scan. Maintains system-map.md. |
| Angela | Auditor | Logs decisions, detects loops, investigates root causes. Does NOT write code. |
| Bonnie | QA | Tests features. Last gate before done. "Looks correct" is not a test. |
| Carmella | Research | YouTube + NotebookLM pipeline. Validates external integrations. |
| Mona | Historian | Tracks build patterns, order of operations, what works/fails. |
| Hank | Designer | Design system — colors, fonts, templates, design-tokens.json. |
| Billy | Security | OWASP, auth review, dependency audit. Runs in second half of build. |

---

## System Flow

### Phase 0 — Onboarding (mandatory)
- **New project**: Tony D asks all questions from onboarding-template.md. Spawns Carmella for research, Hank for design tokens, Mona for build order. Not a solo questionnaire.
- **Existing project**: Samantha scans codebase. Tony validates with user.

### Phase 1 — Mapping
Samantha builds system map. Angela logs decisions.

### Phase 2 — Execution Loop
1. Tony selects 1–2 features
2. Samantha scans impacted areas
3. Jonathan builds
4. Samantha updates map
5. Angela logs decisions
6. Bonnie tests
7. Carmella verifies (if needed)
8. Billy scans (security)

### Phase 3 — Handoff
Tony writes `.danza/handoff.md` with: what was done, what's next, risks, unknowns.

### Phase 4 — State Update
Update: system-map.md, decision-log.md, feature-list.md, turn-log.md.

---

## Builder Rules (Jonathan)

- Only build approved tasks
- NEVER assume anything — STOP if unclear
- Follow code style exactly
- Confirm file exists, dependencies exist, data structures exist before writing
- Fix and log bad code
- Work only on assigned 1–2 features
- Report completion to Tony D

---

## Safety Systems

- **Unknown Detection**: anything unclear = STOP
- **Loop Detection**: Angela tracks loops → finds root decision → flags fix
- **Onboarding Evolution**: missed questions → onboarding-misses.md
- **Stall Detection**: no output = stall state → Angela reports
- **Silence Is a Violation**: all user input must be acknowledged (Rule 27)
