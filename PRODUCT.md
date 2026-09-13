# Workspace Comedians

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain HTML, CSS, and JavaScript served by the Node.js standard library. Ollama provides local model inference.

## Users

The primary user is a human director testing whether a bounded multi-agent workflow can produce useful, funny, and original problem-solving dialogue.

## Product Purpose

Run an Office-comedy review locally, show each agent turn against the B workflow, visibly write an earned joke after failure, and let the human decide whether the issue is actually resolved.

## Positioning

The workflow is both an evidence discipline and a performance structure. Comedy emerges from constrained handoffs and correction, while the human retains authority over closure.

## Operating Context

The user enters a hypothetical, an acceptance check, and optionally a director-only regression. Ollama runs the roles locally. Archify shows the ideal path. Completed rounds and human verdicts are retained as append-only JSONL for comparison.

## Capabilities and Constraints

- Office is the runnable mechanism in version one.
- Each round permits one correction, retry, and recheck.
- Only a human can reopen or close a case; reopening requires new evidence.
- Agents cannot read files, execute commands, or alter repositories.
- The director selects any installed Ollama completion model; `ornith-1.5:9b` is recommended.

## Brand Commitments

The working roles are Big Brain, Abbott, and Costello. Abbott receives a serious task and a competent first attempt. Evidence and a named failed field precede any comic reaction.

## Evidence on Hand

- `workspace-comedians.workflow.json` is the validated Office-comedy B workflow.
- The source persona contracts live under `C:\sites\old-macdonald-had-a-school\docs\comedy-agents`.
- No validated live console or prior run history exists yet.

## Product Principles

- Human resolution outranks agent confidence.
- Evidence precedes comedy.
- One bounded loop per round; new evidence earns a new round.
- Theory and observed behavior remain visibly separate.
- Local operation must not imply repository access.

## Accessibility & Inclusion

The console must be keyboard operable, retain visible focus, expose live status text to assistive technology, and remain usable with reduced motion.
