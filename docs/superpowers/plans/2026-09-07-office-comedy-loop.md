# Office Comedy Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run the B agent loop as a readable Office-comedy demo with a guaranteed failed first attempt, visible earned-joke construction, and a validated Ollama model selector.

**Architecture:** Reuse the tested DUO provider and persistence code, but change the round path to the B workflow for one audit task. Add one native Ollama inventory endpoint, carry the selected model through the existing case/round/chat boundary, and emit three joke events consumed by a dedicated live region.

**Tech Stack:** Node.js 24 standard library, Ollama 0.33.3 REST API, Langfuse JS SDK 5.11.0, Archify 2.17, plain HTML/CSS/JavaScript.

**Spec:** `docs/superpowers/specs/2026-09-07-office-comedy-loop-design.md`

## Global Constraints

- Work only in `C:\sites\workflow-comedy`.
- The first Abbott attempt must fail deterministically from director-only regression evidence.
- Comedy begins only after the evidence failure.
- Use `ornith-1.5:9b` as recommended, not as a hidden fixed model.
- Accept only models currently reported with Ollama `completion` capability.
- One task follows the real B loop and truthfully takes `More Audit Tasks? → NO`.
- Preserve Langfuse model, session, hierarchy, usage, cost, and error capture.

---

### Task 1: Deliver the canonical B workflow

**Files:**
- Modify: `workspace-comedians.workflow.json`
- Generate: `workspace-comedians.workflow.html`
- Generate: `workspace-comedians.workflow.visual-check.*`
- Test: Archify validation, delivery, and visual-check receipts

**Interfaces:**
- Consumes: preserved `dfbecba:diagrams/workflow-comedy-loop.json`
- Produces: B node IDs `task_list`, `creative_cast`, `sincere_prompt`, `worker_attempt`, `evidence_check`, `failure_beat`, `attempt_ledger`, `task_closed`, `more_tasks`, `final_transcript`

- [ ] Read the workflow/common schemas and one workflow example.
- [ ] Replace the current candidate with the preserved B source, limit Office v1 to one retry, route a failed retry from `evidence_check` to `final_transcript`, and keep `quality_profile: "showcase"`.
- [ ] Run `node bin/archify.mjs validate workflow <candidate> --quality showcase --json`; require 9 checks, 0 errors, 0 warnings.
- [ ] Run `deliver`, then `visual-check`; preserve all receipts and generated evidence.
- [ ] Commit the frozen candidate and generated artifacts.

### Task 2: Execute B with model choice and earned joke events

**Files:**
- Modify: `server.test.mjs`
- Modify: `server.mjs`
- Modify: `instrumentation.mjs`

**Interfaces:**
- Produces: `completionModels(models)`, `selectModel(requested, models)`, `GET /api/models`
- Emits: `{ type: "joke", phase: "setup" | "turn" | "payoff", text, roundId }`
- Carries: `model` from case request through round storage to `ollamaChat`

- [ ] Add a failing unit test that filters out embedding-only models and rejects an unavailable selection.
- [ ] Add a failing run test expecting the B path and exact joke phase order after the forced first failure.
- [ ] Run `node --test server.test.mjs`; verify failures identify missing behavior.
- [ ] Implement model inventory/validation with native `fetch` and no cache or dependency.
- [ ] Thread `model` through `cleanInput`, `modelInput`, `runRound`, and `ollamaChat`; set the Langfuse generation model from the request.
- [ ] Emit `setup` after the forced evidence failure, `turn` after Costello correction, and `payoff` after Costello recheck.
- [ ] Build the truthful B path and compare it with the canonical diagram edges.
- [ ] Run the complete suite and commit only after green.

### Task 3: Show the Office skit live

**Files:**
- Modify: `index.html`
- Modify: `server.test.mjs`

**Interfaces:**
- Consumes: `GET /api/models`, NDJSON `joke` events, B `nodeId` values
- Produces: installed-model `<select>`, Office preset, three-slot `aria-live="polite"` Joke Desk, advancing Archify focus

- [ ] Add HTTP assertions for the model endpoint and Office scenario payload.
- [ ] Add the model selector and load it from `/api/models`, preselecting the recommended installed model.
- [ ] Change the preset to the guaranteed stale-response Office scenario and submit its selected model.
- [ ] Render Setup, Turn, and Payoff slots immediately; update each from streamed joke events.
- [ ] Map server turns/transitions to the B diagram node IDs and keep transcript/verdict behavior.
- [ ] Run the complete suite.
- [ ] Restart the root server and run the Office preset in a browser.
- [ ] Verify visible first failure, readable paced joke construction, model label, advancing diagram, final transcript, and no console errors.
- [ ] Fetch the new Langfuse observation tree and verify the selected model.
- [ ] Commit and request focused code review.
