# Pre-Handoff Self-Assessment

You MUST complete this checklist honestly before handing off to the next AI.
This is not optional. Skipping or lying is a permanent loss of boss status.

---

## Answer every question. YES or NO. Explain any NO.

### Feature Quality
- [ ] Am I confident both features work correctly?
- [ ] Did the Test Agent verify both features and report PASS?
- [ ] Do both features integrate properly with the existing codebase?
- [ ] Did I verify against Spaghetti's reality layer (system map) before claiming done?

### Decision Integrity
- [ ] Did I make any risky decisions I'm not fully sure about? (If YES — flag them in the handoff)
- [ ] Did I choose a workaround when I should have stopped and asked?
- [ ] Did I try to hide a problem and continue working?
- [ ] Could I have used my free pass (alert the owner) but chose not to when I should have?
- [ ] Did I introduce any new patterns, libraries, or conventions without explicit approval?

### State Updates
- [ ] Did Spaghetti update the system map for ALL changes made this turn?
- [ ] Did Snitch log ALL significant decisions made this turn?
- [ ] Are all checkpoints current and verified?
- [ ] Is the feature list updated (completed features marked, next 2 confirmed)?
- [ ] Is the turn log updated with this turn's summary?

### Handoff Quality
- [ ] Are my instructions for the next 2 features clear and complete?
- [ ] Could the next AI execute those features WITHOUT asking the user for clarification?
- [ ] Did I include all context the next AI needs?
- [ ] Does the handoff document follow the template exactly?
- [ ] Is the delta small enough (~500 tokens of new context) that the next AI can absorb it quickly?

### Code Quality
- [ ] Did I follow the existing code style throughout?
- [ ] Is the codebase clean? (No debug code, no commented-out blocks, no TODO hacks)
- [ ] Are there any files I changed that I forgot to mention in the handoff?

### System Evolution
- [ ] Did I encounter any questions that should be added to the onboarding questionnaire?
- [ ] Did I discover any rules that should be added to the constitution?
- [ ] Are there improvements to suggest for this self-assessment?
- [ ] Did Snitch find anything that needs a new prevention rule?

---

## If ANY answer reveals a problem:

1. Identify the specific issue
2. Fix it (use Snitch's decision log to locate quickly)
3. Re-verify the fix
4. Update the relevant answer
5. Only proceed to handoff when ALL answers are clean

## Log this assessment

Append to `.danza/self-assessment-log.md`:
```markdown
## Self-Assessment — Turn [number]
- AI: [environment name]
- Date: [timestamp]
- All checks passed: YES/NO
- Issues found and fixed: [list or "None"]
- Evolution suggestions: [list or "None"]
```
