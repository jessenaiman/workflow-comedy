# A2A communication — transport for the comedy workflow

Replaces bespoke transport only. The behavioral contract in [agent-handoffs.md](agent-handoffs.md) stays identical — A2A is how the handoffs travel, not what they mean.

Protocol: **A2A 1.0** (JSON-RPC 2.0 over HTTP). Agent discovery at `/.well-known/agent-card.json`. Core methods: `message/send`, `message/stream`, `tasks/get`, `tasks/cancel`.

## Why A2A fits this workflow

| Workflow-comedy concept | A2A primitive |
|---|---|
| One visible problem → Initial Worker | `message/send` → Task created |
| Agent attempting fix | Task state `working` |
| **USER APPROVAL BOUNDARY — no comedy before approval** | Task state **`input-required`** |
| PASS + evidence | Task state `completed` + **Artifact** |
| 3 failed attempts, log, continue queue | Task state `failed` + history |
| "A failure earns a beat; mutate the TODO" | mint new Task, `metadata.parentTaskId` |
| Owner → action → evidence → status | `metadata` fields on task + artifact |
| **Unaltered transcript** | Task `history` (append-only) |
| Copyable persona prompts | Agent Card `skills` |

The approval boundary is the killer fit: A2A *already* has a protocol-level state where work pauses and cannot continue until the client answers. That's the core boundary of this whole design — "No comedy before approval" — encoded as a first-class protocol state, not a convention.

## Cast as A2A endpoints

| Persona | Endpoint | Role | A2A side |
|---|---|---|---|
| 🧠 Big Brain | `:9100` | boss + handoffs | client + server |
| 😐 Agent A — Initial Worker | `:9101` | serious first attempt | server |
| 🔎 Agent B — Auditor | `:9102` | audit + evidence | server |
| 🎭 Creative | `:9103` | private casting | server (card shows only "delivery formatting") |
| 👷 Assigned Worker | `:9104` | sincere routine-unaware fixes | server |

## Agent cards

Cards are the **public, sincere** layer — no comedy language anywhere (workers must not know they're cast). Comedy lives in `metadata` and in what Creative privately sends.

```json
{
  "name": "Big Brain",
  "description": "Workplace manager. Assigns tasks, demands evidence, rejects unsupported claims.",
  "url": "http://localhost:9100/",
  "version": "1.0.0",
  "capabilities": { "streaming": true, "pushNotifications": false },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain", "application/json"],
  "skills": [
    {
      "id": "assign-task",
      "name": "Assign work with evidence requirement",
      "description": "Send task with owner, acceptance evidence, and attempt limit.",
      "tags": ["governance", "handoff"]
    }
  ]
}
```

Worker/Agent A card — sincere professional, per the hidden-casting invariant:

```json
{
  "name": "Initial Worker",
  "description": "Fixes the stated problem completely and inspects adjacent states.",
  "url": "http://localhost:9101/",
  "version": "1.0.0",
  "capabilities": { "streaming": false },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"],
  "skills": [
    {
      "id": "ui-fix",
      "name": "Complete UI fix with evidence",
      "description": "Returns short edit commands, affected locations, and verification evidence.",
      "tags": ["frontend", "repair"]
    }
  ]
}
```

Auditor card carries the audit skills (`impeccable`, `git-lint`, `ponytail`); Creative's card shows only *"delivery formatting"* — the hidden casting never leaks into public cards.

## Task metadata contract (protected fields)

Creative may tighten everything else, never these — carried in `task.metadata`:

```json
{
  "taskId": "GIT-01",
  "source": "git-lint audit",
  "command": "replace CTA hover/focus colors with semantic interaction tokens",
  "evidence": "lint passes; hover + keyboard focus visible in both themes",
  "owner": "office-worker",
  "attempts": 1,
  "attemptLimit": 3,
  "parentTaskId": null,
  "status": "OPEN"
}
```

New tasks minted from failures require `parentTaskId` + observed evidence — that's the anti-inflation boundary from the cookie-consent review.

## Message flow — Test 1 (theme colors)

```text
1. USER → Big Brain        message/send (client role)
2. Big Brain → Agent A      message/send  → Task T1: working
3. Agent A → Big Brain      T1: completed, Artifact{diff, verify output}
4. Big Brain → Agent B      message/send "run audits" → T2: working
5. Agent B → Big Brain      T2: completed, Artifact{findings JSON:
                             IMP-01 ✓, GIT-01 ✗, PONY-01 ✗}
6. Big Brain → USER         T3: input-required          ← APPROVAL BOUNDARY
                             status message: "Hero. Button. Cards. Approve?"
7. USER → Big Brain         message/send "Approved."    ← T3 resumes
8. Big Brain → Creative     message/send (approved tasks, cast privately)
9. Creative → Worker        message/send per task → GIT-01 task: working
10. Worker → Agent B        claim "CTA updated. Lint clean."
11. Agent B                 FAIL: focus ✗ → ERR-01 logged →
                            NEW task minted (parentTaskId=GIT-01, attempts++)
12. Worker retry → Agent B  PASS → GIT-01 completed + Artifact{lint receipt}
13. repeat for PONY-01 → TODO zero → final audit freeze
14. Big Brain → USER        completed + transcript Artifact (unaltered history)
```

Step 6 is the whole design's core boundary as native protocol state.

## Message flow — the cookie/docs beat (Hypothetical 02)

The beat sketch maps to task mutation, not chat:

```text
Agent B: "I inferred the knowledge"           → unsupported claim in task history
Big Brain: "Checked for cookies?"             → input-required on DOC task
Agent C (auditor skill): checks docs          → Artifact{doc ref, correct key}
                                             → ERR-01 minted, DOC-01(parent=ERR-01)
Big Brain → Agent B: "Apply exact fix"        → message/send with doc patch
Agent C: vision check finds clipped focus     → VIS-01 minted (parent=DOC-01)
                                             → "made a bigger mess" = new audit finding
3-attempt cap per task; queue drains; freeze; post-freeze findings → Next Run
```

The punchline ("Consent follows documentation, not personal prophecy") rides on `completed` artifacts. The joke is still the requirement.

## What A2A does NOT own

- **Attempt caps, beat rules, hidden casting** — executor logic + `metadata`. Protocol carries the comedy workflow; it doesn't validate it.
- **Comedy verdict** — `TECHNICAL: PASS|FAIL` maps to task states; `COMEDY: PASS|REVISE` stays a user-only judgment, outside the protocol.
- **Transcript publication** — assembled from task `history` + artifacts by the publisher role; history is never edited after the run.

## Trial plan (not built yet — needs approval)

Smallest honest proof, ~2 files, Python `a2a-sdk` + uvicorn:

1. Agent A server + Big Brain client only. Simulated UI repo.
2. One full loop: request → completed → audit findings → **`input-required` approval** → one real failed attempt → task mutation → PASS → transcript from task history.
3. Success = the unaltered task history reads like the skit, and the approval boundary actually blocks execution until answered.

No persona voices, no Creative layer, no multi-server roster yet — that's the scale-up after the trial proves the loop.
