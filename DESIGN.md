---
name: Office Comedy Live Script Room
description: A screenplay-first table read where evidence writes the joke and the workflow map acts as the director's control surface.
colors:
  ink: "#f3eee2"
  paper: "#15130f"
  panel: "#211e18"
  header: "#191610"
  line: "#5b5041"
  muted: "#b9ad9b"
  red: "#ee725a"
  gold: "#f2c55c"
  green: "#84d8a2"
  blue: "#9fb9ff"
  focus: "#fff0a5"
  field: "#11100d"
  stage: "#0e0d0b"
rounded:
  sm: "4px"
spacing:
  control: ".7rem"
  section: "1.2rem"
  workbench: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "#18130b"
    rounded: "{rounded.sm}"
    padding: ".65rem .9rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: ".65rem .9rem"
  input-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: ".7rem"
---

# Design System: Office Comedy Live Script Room

## Overview

**Creative North Star: "The Live Table Read"**

This is a screening room built around a bright screenplay page. Dialogue, evidence, and the Joke Desk dominate the reading surface; the compact Archify map and call sheet stay in a dark, sticky director rail. Courier-style dialogue and scene headings make each slow model turn feel like a live table read.

Density is deliberate and workmanlike. The page uses tonal surfaces and rules to separate zones rather than decorative cards or heavy shadows. Red marks live/on-air and Costello reaction, amber marks action and evidence, blue identifies Abbott, and green confirms completion.

**Key Characteristics:**
- Warm dark paper with restrained tonal layering
- Serif editorial copy paired with monospaced status labels
- Screenplay and Joke Desk first, compact stage control beside them, human verdict last
- Thin rules, small radii, visible focus, reduced-motion support

## Colors

The palette is a warm blackout with amber cue light, red live signals, and role-specific evidence colors.

### Primary
- **Cue Amber** (#f2c55c): Primary actions, labels, stage synchronization, and selected history state.
- **Live Red** (#ee725a): On-air indicator, Costello role, wrong/blocked states, and the LIVE DUO wordmark accent.

### Tertiary
- **Proof Green** (#84d8a2): Completed status.
- **Abbott Blue** (#9fb9ff): Abbott role in the transcript.

### Neutral
- **Warm Ink** (#f3eee2): Main copy and control text.
- **Blackout Paper** (#15130f): Page background.
- **Panel Brown** (#211e18): Panel tonal layer.
- **Header Brown** (#191610): Sticky header surface.
- **Rule Brown** (#5b5041): Dividers, borders, and section rules.
- **Quiet Muted** (#b9ad9b): Supporting copy, provider labels, health text, and evidence.
- **Field Black** (#11100d): Inputs and selects.
- **Stage Black** (#0e0d0b): Archify frame surface.
- **Focus Cream** (#fff0a5): Keyboard focus ring.

### Named Rules
**The Cue-Light Rule.** Accent colors communicate live state, role, or proof; they are not decoration.

## Typography

**Display Font:** `ui-serif, Georgia, serif`

**Label/Mono Font:** `ui-monospace, monospace`

**Character:** Serif copy feels editorial and composed; compact uppercase mono labels feel like a technical call sheet and keep operational state scannable.

### Hierarchy
- **Display:** `clamp(1.25rem, 3vw, 2.2rem)`, normal weight, `letter-spacing: -.035em`: Console title.
- **Headline:** `1.35rem`, `letter-spacing: -.02em`: Section and verdict headings.
- **Body:** `1rem` inherited, `line-height: 1.45`: Instructions, transcript, and evidence.
- **Label:** `700 .75rem/1.2`, mono, `letter-spacing: .1em`, uppercase: Call sheet, performance log, archive, and verdict markers.
- **Status:** `700 .72rem`, mono, `letter-spacing: .05em`: Turn and provider metadata.

### Named Rules
**The Two-Voice Rule.** Use serif for human-readable narrative and mono only for operational labels, statuses, and provider metadata.

## Layout

The page uses a `minmax(300px,390px)` sticky director rail beside a flexible screenplay page. The rail contains the 350px Archify control map, model selector, scene fields, and archive. The screenplay page contains scene heading, three-slot Joke Desk, live transcript, and verdict. Below `980px`, the rail becomes a two-column block above the script; below `650px`, everything stacks.

The stage map is a bordered iframe at `350px` desktop height, `420px` tablet height, and `360px` phone height. It controls and explains the run without displacing the script from the first viewport.

## Elevation & Depth

There are no box shadows. Depth comes from tonal layering (`paper`, `header`, `panel`, `field`, `stage`), borders, and the gold transcript rule. The stage is visually deep because it is inset as a framed black surface; the verdict is a restrained panel layer rather than a floating card.

### Named Rules
**The Flat Booth Rule.** Keep surfaces flat at rest; use rules and tonal shifts to establish hierarchy.

## Shapes

Controls use a restrained `4px` radius. The stage map and iframe are square-cornered and framed by a `1px` rule. Transcript cues are open rows divided by rules, not rounded cards. Focus uses a `3px` solid focus color with `3px` offset. Inputs have a minimum height of `2.7rem`; textareas are vertically resizable with a `6rem` minimum.

## Components

### Buttons
- **Shape:** Small `4px` radius.
- **Primary:** Cue Amber background, dark text, `padding: .65rem .9rem`, bold weight.
- **Secondary:** Transparent background, ink text, rule-colored border.
- **Hover / Focus:** Preserve the visible border language; all keyboard focus uses the global cream `3px` ring.
- **Disabled:** Reduced opacity (`.55`) and not-allowed cursor.

### Inputs / Fields
- **Style:** Field Black background, warm ink text, `1px` rule border, `4px` radius, `.7rem` padding.
- **Focus:** Global `:focus-visible` cream outline, `3px` offset.
- **Director field:** The hidden regression textarea uses a warmer `#755c38` border to mark director-only context.

### Navigation
- **Style:** Sticky, dark header with a bottom rule; title at left, live feed and health state at right.
- **States:** `LIVE DUO` uses red for the live accent; the feed label is red uppercase mono; health is muted serif text.

### Cards / Containers
- **Style:** Containers are rule-bounded sections rather than floating cards.
- **Stage map:** Compact framed iframe in the director rail with a live node-name receipt beneath it.
- **Verdict:** Panel Brown background, rule border, and a gold topological role as the human close/reopen surface.

### Signature Component: Evidence-Written Joke Desk
Three screenplay slots remain visible throughout the run: Setup waits for verified failure evidence, Turn waits for Costello's correction, and Payoff waits for retry evidence. Each validated event types into its slot while the next model call runs. Raw partial model JSON never appears. Archify focus follows the same events in the director rail.

## Do's and Don'ts

### Do:
- **Do** keep screenplay text visually dominant and Archify visible as a compact control.
- **Do** show the chosen model and provider on every turn.
- **Do** let only verified failure evidence begin the Joke Desk.
- **Do** use warm blackout surfaces and thin rules for hierarchy.
- **Do** reserve amber, red, blue, and green for cues, roles, and status meaning.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** keep human verdict controls after the evidence-bearing transcript.

### Don't:
- **Don't** introduce generic dashboard card grids, glossy shadows, or large rounded containers.
- **Don't** replace the serif/mono pairing with a single sans-serif voice.
- **Don't** use accent colors as arbitrary decoration.
- **Don't** hide evidence, failed fields, or the human verdict behind collapsed UI.
