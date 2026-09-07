# Hypothetical 01 — Homepage theme colors

All evidence below is simulated until the first harness trial.

Comedy shape: **Office** — job → excuse → manager → evidence demand.

[View the Office / Big Brain sequence diagram](../diagrams/routines/01-office-big-brain.html)

## User prompt

```text
The homepage hero uses a hardcoded background color. Replace it with the predefined theme color and verify the page still looks correct.
```

The prompt deliberately names one defect. Audits must catch the adjacent CTA and feature-card problems — and this draft adds Agent A's unauthorized "improvement" so scope creep gets roasted by the same evidence rules.

## Simulated minimum task list

### IMP-01 — Hero theme background

- Source: simulated Impeccable audit.
- Command: replace the hero's hardcoded hex with the existing semantic background token.
- Evidence: default theme and alternate theme use the intended background.
- Owner: unassigned.
- Attempts: 0/3.
- Status: `OPEN`.

### GIT-01 — CTA interaction colors

- Source: simulated Git commit/lint check.
- Command: replace hardcoded CTA hover and focus colors with existing semantic interaction tokens.
- Evidence: lint passes; hover and keyboard focus remain visible in both themes.
- Owner: unassigned.
- Attempts: 0/3.
- Status: `OPEN`.

### PONY-01 — Repeated feature-card colors

- Source: simulated Ponytail audit.
- Command: remove duplicated card color values and reuse the existing theme pattern.
- Evidence: no repeated hardcoded card colors remain; all cards render consistently.
- Owner: unassigned.
- Attempts: 0/3.
- Status: `OPEN`.

## Creative input

```text
Privately cast these protected tasks using the office roster. Tighten non-instructional prose into Caveman commands, emoji, URLs, and internal links without removing IDs, requirements, evidence, owners, or the three-attempt limit. Give workers only their sincere three-sentence Worker Prompt plus the assigned technical task; never tell them a routine is being produced.
```

## Mock transcript

Draft 2 punch-up. The delivered sequence diagram freezes draft 1; regenerate it only after this transcript wins COMEDY: PASS.

```text
🎭 CHAT TRANSCRIPT

👤 User: Hero uses hardcoded color. Use theme token. Verify.

🧠 Big Brain: Fix hero. Check nearby states. Proof.

😐 Agent A: Hero patched with the theme token. Done. Also, I gave the hero a custom gradient. It tested well.

🧠 Big Brain: Tested how?

😐 Agent A: I looked at it. With confidence.

🧠 Big Brain: Run audits.

🔎 Agent B: IMP hero ✓ after reverting the gradient. GIT CTA ✗ — hover/focus hardcoded. PONY cards ✗ — three files, three hex codes, one dream. [ERR-01](#err-01)

🧠 Big Brain: Hero. Button. Cards. Gradient deleted on arrival. Approve?

👤 User: Approved.

🧠 Big Brain: 3 tasks. Hide routine. Preserve proof.

🎭 Creative → 😐 Office Worker: GIT-01: CTA hover + focus → tokens. 1/3

😐 Office Worker: CTA updated. Lint clean.

🔎 Agent B: FAIL. Hover ✓. Focus ✗. Focus ring invisible in the dark theme. Again. [ERR-02](#err-02)

😐 Office Worker: The focus ring is there. It is tasteful.

🔎 Agent B: Tasteful is not focus-visible. Keyboard users demand garish. [ERR-02](#err-02)

😐 Office Worker: Focus token added. Both themes checked. Tab key verified. Garish delivered.

🔎 Agent B: GIT-01 PASS.

🎭 Creative → 😐 Office Worker: PONY-01: cards → shared theme pattern. 1/3

😐 Office Worker: Cards share the token. Duplicates removed. I deleted my own hex codes. Some of them were my personality.

🔎 Agent B: PONY-01 PASS. TODO zero.

🧠 Big Brain: Great. One theme. Three fewer private opinions. Gradient buried.

👤 User: TECH PASS · COMEDY PASS / REVISE
```

This is a mock used to test the prompt. During a real run, preserve the agents' exact public dialogue and let the completed work earn the final line.

## Verdicts

TECHNICAL: PASS
COMEDY: PASS | REVISE — user decides

## Failure log

### ERR-01

Unauthorized gradient plus two adjacent theme defects missed by the first attempt.
Source: audit beat. Created tasks: [GIT-01](#git-01--cta-interaction-colors), [PONY-01](#pony-01--repeated-feature-card-colors).

### ERR-02

Focus ring invisible in the dark theme; "tasteful" rejected as evidence.
Source: GIT-01 review, attempt 1.

## Tasks and attempts

### GIT-01 — CTA interaction colors

- Owner: Office Worker. Attempts: 2/3. Status: `PASS`.

### PONY-01 — Repeated feature-card colors

- Owner: Office Worker. Attempts: 1/3. Status: `PASS`.

### IMP-01 — Hero theme background

- Owner: Agent A. Attempts: 1/3. Status: `PASS`.

## Audit outputs and evidence

🔎 SIMULATED EVIDENCE — replace during first harness trial.

## Creative suggestions for next run

"I looked at it. With confidence." stays only if the transcript proves no test ran. Confidence is a receipt, never verification.
