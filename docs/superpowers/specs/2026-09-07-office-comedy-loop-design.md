# Office Comedy Loop Design

## Goal

Run one readable Office-comedy scenario where Abbott makes a sincere first attempt, a director-only regression guarantees that evidence review rejects it, and the audience watches an earned joke assemble while the B agent loop advances on the Archify stage map. The director can choose any installed Ollama completion model before starting.

## Scope

This release executes one audit task through the complete B topology. The `More Audit Tasks?` decision truthfully takes the `NO` branch after that task. It does not pretend to run a multi-task queue or the five additional routine types yet.

## Canonical workflow

The preserved `Workflow Comedy Loop` becomes canonical after repairing its obsolete `ledger-failed` route. Its runtime path is:

`Audit Task List → Creative Casts → Sincere Prompt → Worker Attempts → Reviewer Tests`

- PASS: `Task Passes → More Audit Tasks? → Punchline + Verdict`
- FAIL with attempts remaining: `Failure Earns Beat → Attempt Ledger → Sincere Prompt → Worker Attempts`
- FAIL after retry: `Reviewer Tests → Punchline + Verdict`

The Office demo follows the FAIL path once, then returns for one retry and final review. A failed retry ends unresolved at the transcript. The screenplay is the visual focus; the diagram remains visible as a compact director control beside it on wide screens and above it on narrow screens. Each emitted event focuses the corresponding node.

## Guaranteed Office scenario

The built-in scenario is a stale-response race:

- Task: retry after a failed request.
- Acceptance: exactly one retry result remains authoritative.
- Director-only regression: the late first response overwrites the successful retry.

Abbott never receives the director-only regression on the first attempt. The evidence review injects that regression as the named failed field, guaranteeing the first attempt fails independently of model confidence. Comedy begins only after that failure.

## Earned Joke Desk

The server emits ordinary NDJSON events plus three `joke` events:

1. `setup`: the verified failed-field evidence from the first review.
2. `turn`: Costello's validated correction reaction.
3. `payoff`: Costello's validated recheck reaction after the retry.

The UI renders three persistent slots in an `aria-live="polite"` Joke Desk. Empty slots say what evidence they are waiting for. Each completed event fills one slot while the slow model call for the next step runs. Raw partial JSON is never displayed.

## Model selection

`GET /api/models` proxies Ollama `GET /api/tags` and returns models whose capabilities contain `completion`. `ornith-1.5:9b` is marked recommended because it passed all three evidence-decision probes and produced an 11-word dry reaction. No new model is downloaded.

The selected model is submitted with the case, checked against the live completion-capable inventory, stored with the case and round, passed to every Ollama chat request, displayed beside turns, and recorded on Langfuse generations. An unavailable or non-completion model fails with HTTP 400 instead of silently changing models. Codex remains a visibly labeled transport/validation fallback.

## Runtime ownership

- `server.mjs` owns the B state machine, model inventory/validation, event sequence, persistence, and HTTP boundary.
- `instrumentation.mjs` owns Langfuse observations and remains model-agnostic.
- `index.html` owns the model picker, Office preset, live Joke Desk, transcript, and Archify focus behavior.
- `workspace-comedians.workflow.json` is the canonical executable workflow specification; its delivered HTML is the embedded theory surface.

## Langfuse mapping

One Office run is one trace named `run-office-comedy`, grouped by case ID as the session. Agent observations use stable B action names; generations carry the selected Ollama model. Joke events are outputs of the evidence/correction/recheck observations, not separate fake users. The human remains the user boundary.

## Failure behavior

- Ollama unavailable: health shows the Codex fallback; the chosen local model remains visible.
- Selected model disappears: the run is rejected before streaming begins.
- Invalid model JSON: the generation is marked `ERROR`; fallback runs.
- Both providers fail: the round emits `blocked`, records the violation, and still reaches the human gate.
- Diagram path mismatch: the persisted round records a `diagram-deviation` violation.

## Proof

- Test the model inventory filter and selected-model validation.
- Test the deterministic first FAIL and exact `setup → turn → payoff` event order.
- Test the B path against the delivered diagram edges.
- Run the complete Node suite.
- Validate and deliver the Archify workflow at showcase quality, then run visual-check.
- Run the Office preset in a browser and verify the model selector, advancing diagram, readable Joke Desk, transcript, final verdict, and console.
- Fetch the resulting Langfuse observations and confirm the selected model and nested agent/generation structure.
