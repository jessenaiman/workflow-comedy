# Hypothetical 05 — Load-bearing dead code

All evidence below is simulated until the first harness trial.

Comedy shape: **Trio** — boss commands removal, the auditor warns against it, the confident worker exposes the assumption nobody checked.

## User prompt

```text
There's a function in utils.js nobody imports. Looks dead. Remove it.
```

## Mock transcript

```text
🎭 CHAT TRANSCRIPT

👤 User: Function in utils.js, zero imports. Looks dead. Remove it.

🧠 Big Brain: Dead code. Delete. Check who mourns.

😐 Agent A: Removed. No imports anywhere. Confirmed dead. Clean kill. No witnesses.

🧠 Big Brain: Run audits.

🔎 Agent B: BUILD ✗ — site down. A loader builds the function's name from a config string and evals it. The function was not dead. The function was load-bearing. [ERR-01](#err-01)

😐 Agent A: The function was haunted.

🧠 Big Brain: Dead code alive. Approve: restore, trace, fix honest.

👤 User: Approved. The function committed no crime.

🧠 Big Brain: 3 tasks. Hide routine. Preserve proof.

🎭 Creative → 😐 Office Worker: REST-01: restore function. Evidence: build green. 1/3

😐 Office Worker: Restored. Build green. Nobody speak to it.

🔎 Agent B: REST-01 PASS.

🎭 Creative → 😐 Office Worker: TRACE-01: find every real caller. Evidence: usage list. 1/3

😐 Office Worker: legacyLoader builds "handle" + "Cart" from a config string and evals it. That's the caller. It's a wizard. A cursed wizard.

🔎 Agent B: TRACE-01 PASS. Haunting explained. Science, not spirits.

🎭 Creative → 😐 Office Worker: FIX-01: replace string-eval with an explicit import. Then remove what is actually dead. Evidence: build green, cart page loads. 1/3

😐 Office Worker: Explicit import added. String-eval retired. Cart page loads. The function lives on — documented this time. The config string that summoned it: deleted. That part was actually dead.

🔎 Agent B: FIX-01 PASS. TODO zero.

🧠 Big Brain: Great. Dead code had a pulse. Now it has a paper trail.

👤 User: TECH PASS · COMEDY PASS / REVISE
```

## Verdicts

TECHNICAL: PASS
COMEDY: PASS | REVISE — user decides

## Failure log

### ERR-01

"Zero imports" was an assumption, not a trace: a string-built eval call was the hidden caller. Deleting the function took the site down.
Source: audit beat. Created tasks: [REST-01](#rest-01--restore), [TRACE-01](#trace-01--trace-callers), [FIX-01](#fix-01--explicit-import).

## Tasks and attempts

### REST-01 — Restore

- Source: [ERR-01](#err-01).
- Command: restore the function; verify the build.
- Evidence: build green.
- Owner: Office Worker.
- Attempts: 1/3.
- Status: `PASS`.

### TRACE-01 — Trace callers

- Source: [ERR-01](#err-01).
- Command: find every real caller of the function.
- Evidence: usage list — legacyLoader via config string + eval.
- Owner: Office Worker.
- Attempts: 1/3.
- Status: `PASS`.

### FIX-01 — Explicit import

- Source: [ERR-01](#err-01).
- Command: replace the string-eval with an explicit import; remove only what is provably dead.
- Evidence: build green, cart page loads, config string deleted.
- Owner: Office Worker.
- Attempts: 1/3.
- Status: `PASS`.

## Audit outputs and evidence

🔎 SIMULATED EVIDENCE — replace during first harness trial.

- Build reproduces the failure with the function removed.
- Caller trace shows exactly one usage path.
- Cart page verified after the explicit import.

## Creative suggestions for next run

"Clean kill. No witnesses." earns the haunting only because the very next check finds a witness. Keep the beat order: confidence → refutation → archaeology → paperwork. The user's original request ("remove it") is finally honored honestly — by removing the part that was actually dead.
