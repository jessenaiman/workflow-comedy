# Hypothetical 02 — Cookie consent config

All evidence below is simulated until the first harness trial.

Comedy shape: **Duo** — the smart one explains the docs; the confident one destroys his own explanation. The user's beat sketch, preserved: a worker claims knowledge without checking, so the verification requirement (docs check, vision check) IS the joke.

## User prompt

```text
Update the homepage cookie-consent button to use the existing consent configuration and verify the rendered banner.
```

## Mock transcript

```text
🎭 CHAT TRANSCRIPT

👤 User: Consent button uses old copy. Use existing config. Verify banner.

🧠 Big Brain: Fix. Read docs. Inspect screen. Proof.

🤓 Agent B: Done. I inferred `consentLabel` from the code.

<a id="line-04"></a>🧠 Big Brain: Did you check?

🤓 Agent B: Of course I checked.

<a id="line-06"></a>🧠 Big Brain: Checked for cookies?

🤓 Agent B: I inferred the knowledge.

<a id="line-08"></a>🧠 Big Brain → 🔎 Agent C: Look at this smartass. Scrambled to avoid the docs. What do we say?

🔎 Agent C: Check the docs, boss. Let me do it for him. Oh. Oh, let me... oh. This is not good. It says here: the key is `cookieConsent.buttonLabel`. `consentLabel` is not a thing. `consentLabel` has never been a thing. [ERR-01](#err-01)

🧠 Big Brain → 🤓 Agent B: Do you have eyes? Well, no — you're a machine. But you have a vision tool. Be like C and follow the docs. Apply exact fix.

🤓 Agent B: `cookieConsent.buttonLabel` applied. Docs open this time. Physically.

🧠 Big Brain → 🔎 Agent C: Eyes on him. See if he made a bigger mess.

🔎 Agent C: Vision check: focus outline clips on mobile widths. He made a bigger mess. New task [VIS-01](#vis-01--vision-check). [ERR-02](#err-02)

🧠 Big Brain → 🤓 Agent B: Focus. Fix. Again.

🤓 Agent B: Focus outline restored. Banner inspected at desktop and mobile widths. With the vision tool. Like an animal that can see.

🔎 Agent C: DOC-01 PASS. VIS-01 PASS. TODO zero.

🧠 Big Brain: Great. Consent now follows documentation instead of personal prophecy.

👤 User: TECH PASS · COMEDY PASS / REVISE
```

## Verdicts

TECHNICAL: PASS
COMEDY: PASS | REVISE — user decides

## Failure log

### ERR-01

Unsupported "inferred knowledge" claim; wrong config key used.
Source: [line-06](#line-06). Created task: [DOC-01](#doc-01--docs-check).

### ERR-02

The first fix clipped keyboard focus on mobile — a fix that made a bigger mess, caught by the vision check.
Source: [line-08] beat after the fix. Created task: [VIS-01](#vis-01--vision-check).

## Tasks and attempts

### DOC-01 — Docs check

- Source: Agent B's unsupported claim.
- Command: consult official consent-config docs; verify exact key.
- Evidence: documented `cookieConsent.buttonLabel`; corrected patch.
- Owner: Agent B.
- Attempts: 1/3.
- Status: `PASS`.

### VIS-01 — Vision check

- Source: Agent C's rendered inspection.
- Command: inspect consent banner with the vision tool at desktop and mobile widths.
- Evidence: clipped focus outline observed, then fixed and rechecked.
- Owner: Agent B.
- Attempts: 2/3.
- Status: `PASS`.

## Audit outputs and evidence

🔎 SIMULATED EVIDENCE — replace during first harness trial.

- Documentation confirms the config key.
- Vision inspection finds and then clears the focus defect.
- TODO reaches zero.

## Creative suggestions for next run

Keep "I inferred the knowledge" only when the transcript proves the worker skipped the required documentation check. Ownership rule held: C investigated and reported; B applied the fix.

## Design notes from the review

1. The beat fits when "I inferred the knowledge" is treated as an observed unsupported claim, not scripted banter. Audit mints it as a real task — the joke IS the requirement.
2. C may inspect docs/vision and return the correction, but B must apply the fix unless Big Brain explicitly reassigns ownership.
3. "Do you have eyes?" fits only when a vision check is actually required by the task.
4. Loop boundary: new tasks require observed evidence + parent task ID; 3 attempts each; queue drains; one final audit freezes the run; findings after freeze become Next Run material.
