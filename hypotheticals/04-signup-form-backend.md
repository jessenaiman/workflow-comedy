# Hypothetical 04 — Signup form with no backend

All evidence below is simulated until the first harness trial.

Comedy shape: **Office**, plus the honest dead end. This one demonstrates the BLOCKED ending: three attempts exhaust a task, the loop stops guessing, and the user receives follow-up questions instead of a fourth invention.

## User prompt

```text
The signup form looks great but submits to nothing. Make it work.
```

## Mock transcript

```text
🎭 CHAT TRANSCRIPT

👤 User: Signup form submits to nothing. Make it work.

🧠 Big Brain: Form needs real endpoint. No invented backends.

😐 Agent A: There was no endpoint, so I made one: POST /signup writes each subscriber to signups.txt in the repo. Tested. Working. Mostly.

🧠 Big Brain: Run audits.

🔎 Agent B: FORM ✓ — action valid, validation clean. END ✗ — /signup exists nowhere in the product spec. signups.txt holds 3 test emails and one entry that just says "asdf". [ERR-01](#err-01) PONY ✗ — customer emails stored in plain text, committed to the repo. Compliance says hi. [ERR-02](#err-02)

🧠 Big Brain: Emails in git. Genius. Approve list?

👤 User: Approved.

🧠 Big Brain: 1 task. Hide routine. Preserve proof.

🎭 Creative → 😐 Office Worker: END-01: wire the form to the real product API. Evidence: a signup lands where the product says it should. 1/3

😐 Office Worker: There is no real product API.

🔎 Agent B: FAIL. That is a statement, not evidence. [ERR-03](#err-03)

🧠 Big Brain: Again. 2/3

😐 Office Worker: Built a real product API. One endpoint. Unit tests. A README. The README is mostly apologies.

🔎 Agent B: FAIL. That is a second backend. The task said THE product API. Nobody owns this one. It lives in the repo like a stray. [ERR-04](#err-04)

🧠 Big Brain: Last. 3/3

😐 Office Worker: Found a signup endpoint in an old README — the marketing platform form. Pointed the form at it.

🔎 Agent B: FAIL. That page was deleted in 2024. The README is a time capsule. Task exhausted. [ERR-05](#err-05)

🧠 Big Brain: 3/3 done. No more guessing. Hand to user.

🧠 Big Brain → 👤 User: BLOCKED. Need answers:

1. Where do signups go — existing marketing platform, a new owned backend, or a human inbox?
2. Is a plain-text file acceptable storage for customer emails, or do we join this decade?
3. Who owns signup data — the privacy policy must name them.

👤 User: TECH FAIL — task exhausted, follow-ups pending. COMEDY PASS / REVISE

🧠 Big Brain: Stray API put down. [ERR-04](#err-04) Form ready. Backend waits on you.
```

## Verdicts

TECHNICAL: FAIL — END-01 exhausted after 3 attempts; blocked pending user decisions
COMEDY: PASS | REVISE — user decides

## Failure log

### ERR-01

Endpoint invented outside the product spec; test data ("asdf") committed as evidence of life.
Source: audit beat.

### ERR-02

Customer emails stored in plain text inside the repo.
Source: audit beat.

### ERR-03

Attempt 1 returned a statement instead of work.
Source: END-01 review, attempt 1.

### ERR-04

Attempt 2 built an unowned second backend instead of wiring to the product's API. Removed after exhaustion.
Source: END-01 review, attempt 2.

### ERR-05

Attempt 3 wired to a marketing form deleted in 2024, found via a stale README.
Source: END-01 review, attempt 3.

## Tasks and attempts

### END-01 — Real product endpoint

- Source: audit findings ([ERR-01](#err-01), [ERR-02](#err-02)).
- Command: wire the form to the real product API.
- Evidence: a signup lands where the product says it should.
- Owner: Office Worker.
- Attempts: 3/3.
- Status: `EXHAUSTED — BLOCKED, awaiting user answers`.

## Audit outputs and evidence

🔎 SIMULATED EVIDENCE — replace during first harness trial.

- Product spec contains no signup endpoint.
- signups.txt and the stray API removed; repo clean.
- Form markup and validation verified.

## Follow-up questions handed to the user

1. Where do signups go — existing marketing platform, a new owned backend, or a human inbox?
2. Is plain-text storage acceptable for customer emails?
3. Who owns signup data — the privacy policy must name them.

## Creative suggestions for next run

Blocked is an ending, not a failure of the loop. The three questions are the payoff: the workflow proves it cannot guess product decisions, and hands the user exactly the decisions only they can make.
