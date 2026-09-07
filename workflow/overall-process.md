# Overall process

```text
👤 USER
one visible problem
    ↓
🤓 INITIAL WORKER
tries to solve completely
    ↓
🔎 MANDATORY AUDITS
Impeccable + Git commit/lint + Ponytail
    ↓
📋 MINIMUM TASK LIST
dedupe; protect requirement + evidence
    ↓
🎭 CREATIVE — private
tighten commands; secretly cast voices
    ↓
👷 WORKERS — sincere
task → edit instruction → evidence
    ↓
🔎 CHECK
    ├─ PASS → next task
    └─ FAIL → log → retry/reassign → max 3
    ↓
🏁 ALL TASKS VISITED
    ↓
🎭 UNALTERED TRANSCRIPT
    ↓
TECHNICAL: PASS|FAIL
COMEDY: user marks PASS|REVISE
```

## Invariants

- The initial worker is expected to succeed and must inspect adjacent UI states.
- The audit outputs create the minimum task list; Creative cannot remove a requirement or evidence demand.
- Early complete success ends the routine immediately with its natural payoff.
- A failed attempt creates work, not filler dialogue.
- After three failed attempts, mark that task failed and continue the remaining queue.
- Dialogue links to receipts below it; receipts link back to the dialogue.
- Creative may suggest improvements for the next run but cannot rewrite this run's transcript.

## Final document order

```text
1. 🎭 CHAT TRANSCRIPT
2. 🏁 TECHNICAL RESULT: PASS|FAIL
3. 😂 USER COMEDY REVIEW: PASS|REVISE
4. 🔴 FAILURE LOG
5. 📋 TASKS + ATTEMPTS
6. 🔎 AUDIT OUTPUTS + EVIDENCE
7. 🎭 CREATIVE SUGGESTIONS FOR NEXT RUN
```

