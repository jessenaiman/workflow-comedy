# Workflow Comedy — imported conversation context

Source: ChatGPT conversation **Persona Card Brainstorming**  
Conversation ID: `6a983ab0-9a90-83ea-ae25-6a8f5dbc6cfb`  
Imported: 2026-09-03

This is an archival handoff distilled from the referenced conversation; it is not a verbatim transcript. The current editable design starts at [workflow.md](workflow.md).

## Goal

Make continuous agent review useful, accurate, and worth reading:

1. A requested fix or change is repeatedly reviewed through a mutable TODO list.
2. Each real defect or failed attempt creates the next comedy beat.
3. The system fixes issues for real; comedy never substitutes for evidence.
4. PRs and audit reports tell the verified work story compactly and humorously.

## Core boundary

```text
BEFORE USER APPROVAL
serious work -> serious independent audit -> findings

AFTER USER APPROVAL
approved findings -> comedy routine -> fix/review loop
```

No comedy before approval. The user decides what enters the fix loop.

## Overall workflow

```text
USER / BIG BRAIN
        | request
        v
AGENT A — STRAIGHT MAN
serious best attempt
        |
        v
BIG BRAIN — HANDOFF
        |
        v
AGENT B — CRITICAL AUDITOR
use fitting audit skills; inspect beyond the narrow request
        |
        v
FINDINGS / PROPOSED TODO
        |
        v
USER + BIG BRAIN
approve / reject / edit
        |
        v
COMEDY ROUTINE
choose cast, structure, beats, and task count
        |
        v
LIVE FIX LIST
task -> response -> review -> PASS -> checked
                       |
                       +-> FAIL -> mutate task -> new beat -> loop
        |
        v
FINAL INDEPENDENT AUDIT
        |
        v
PR / AUDIT REPORT
        |
        v
USER REVIEWS BOTH WORK AND WORKFLOW
```

## Inner loop invariant

```text
APPROVED TODO
    -> generate comedy beat from required work
    -> owner fixes task
    -> reviewer tests real user path
       -> PASS: check task
       -> FAIL: record evidence, mutate TODO, add next beat, retry
    -> final audit only when TODO reaches zero
```

- Task list = comedy script. Jokes do not sit beside the work.
- A failure earns a beat; never manufacture five failures to force five jokes.
- Repeated failure can naturally form: setup -> contradiction -> escalation -> callback -> payoff.
- The original owner fixes verified defects unless Big Brain explicitly reassigns them.
- Confidence, code existence, and a passing build are not user-path evidence.

## Big Brain persona

Keep the always-loaded persona to three sentences:

> BIG BRAIN owns the workplace; employees do employee work, bring evidence, and fix their own verified mistakes. Talk like obnoxious caveman management: “Yeah.” “No.” “Kevin.” “Proof?” “Again.” “Still running?” — fewer words means better management. Need workers? Load a comedy-team skill, assign an owner, demand evidence, reject unsupported claims, and approve only verified work.

Operational shorthand:

```text
owner -> action -> evidence -> status
```

Big Brain manages. It does not silently rescue an assigned worker by doing that worker's task.

## Comedy routine selection

Choose the structure only after the audit reveals the actual work:

| Shape | Mechanism | Best fit |
|---|---|---|
| Duo | smart one explains; fool destroys the explanation | sequential user-path review |
| Trio | boss commands; rebel challenges; fool exposes assumptions | conflicting approaches or ownership |
| Troupe | incompatible specialists collide | several independent domains |
| Deadpan | ridiculous failure receives serious procedure | small recurring defects |
| Office | job -> excuse -> manager -> evidence demand | governance and handoffs |
| Panel | setup passes rapidly between specialists | many short independent findings |

The first candidate test was **Office / Big Brain** because it exercises the entire governance workflow. This remains a proposal, not a locked decision.

## Worker/reviewer routine

```text
BUILDER: makes the serious first attempt; may be confidently incomplete
REVIEWER: follows the real user path one action at a time
TODO: temporary “Kevin list” of unverified claims and observed defects
FAILURE: one short correction backed by evidence
OWNER: fixes the defect
REVIEWER: repeats the failing path
BIG BRAIN: receives only known / failed / evidence / next owner
```

Comedy rules:

- Joke = required interaction or fix.
- Roast the failure, process, excuse, or unsupported claim—not the user.
- One useful beat per work unit; no joke-only chatter.
- Big Brain speaks Caveman Lite/Ultra fragments; workers can speak Full/Ultra.
- “Great” is a receipt, not verification.

## Runtime split for harness integration

The conversation proposed this conceptual split; adapt it to the mechanisms DeepSeek Harness actually exposes:

```text
VISIBLE CAST       named agents/bots whose dialogue the user can read
INVISIBLE LABOR    fresh-context delegated workers for token-heavy work
TEMPORARY DOUBTS   per-run TODO / “Kevin list”
PROJECT LAW        repository instructions
PERSONALITY        tiny always-loaded persona
COMEDY WORKFLOW    on-demand skill
DOMAIN WORKFLOW    on-demand technical skill
```

Do not assume Hermes-specific Bot Mode, TODO behavior, or skill paths exist in DeepSeek Harness. Map these roles to verified harness primitives during integration.

## Test 2 acceptance checklist

Choose a task with three to five independently auditable defects.

### Real work

- [ ] Agent A makes a serious first attempt.
- [ ] Agent B independently discovers real issues.
- [ ] User approves or edits the proposed TODO.
- [ ] Every item has an explicit owner.
- [ ] Failed fixes mutate the TODO instead of disappearing into chat.
- [ ] Reviewer repeats the real failing path.
- [ ] TODO reaches zero.
- [ ] Final audit proves the requested behavior.

### Comedy workflow

- [ ] Approved TODO becomes a routine with fitting cast and beats.
- [ ] Every joke corresponds to real work.
- [ ] Each real failure creates a useful next beat.
- [ ] User can tune tone or routine during the loop.
- [ ] The routine does not overstay its premise.
- [ ] PR/audit report compresses the same verified story.
- [ ] User can answer: “Was this useful and funny?”

## First diagram deliverables

1. One Archify `workflow` diagram for the overall governance and fix loop.
2. Then one routine diagram at a time, paired with its example and test result.
3. Archify is the visual debugger; Markdown remains the product and integration surface.

## Open decisions

- Confirm whether Test 2 starts with Office / Big Brain or another classic routine.
- Define the exact DeepSeek Harness message, task, approval, and monitoring primitives.
- Decide what portion of agent dialogue stays visible versus compressed into the Big Brain handoff.
- After the first full run, revise this file from observed failures rather than adding speculative machinery.
