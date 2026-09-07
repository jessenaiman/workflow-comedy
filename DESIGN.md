---
name: Workspace Comedians Director's Console
description: A warm blackout radio-rehearsal console where the ideal workflow is the stage map and observed dialogue is the performance.
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

# Design System: Workspace Comedians Director's Console

## Overview

**Creative North Star: "The Radio-Rehearsal Booth"**

This is an operator console with the visual grammar of a live rehearsal: warm blackout paper, thin cue-sheet rules, amber practical light, and editorial serif typography. The full-width Archify map is the stage; the transcript below it is the performance record. The left rail is an operator's call sheet, not a generic settings dashboard.

Density is deliberate and workmanlike. The page uses tonal surfaces and rules to separate zones rather than decorative cards or heavy shadows. Red marks live/on-air and Costello reaction, amber marks action and evidence, blue identifies Abbott, and green confirms completion.

**Key Characteristics:**
- Warm dark paper with restrained tonal layering
- Serif editorial copy paired with monospaced status labels
- Stage map first, observed transcript second, human verdict last
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

The page is centered in a `max-width: 1550px` main region with responsive padding of `clamp(1rem, 3vw, 2.5rem)`. The stage map spans the full main width above a two-column workbench. At desktop widths the workbench uses a `minmax(280px,380px)` call-sheet rail and a flexible performance pane with a `2.5rem` gap; the rail is separated by a right rule. Below `900px`, the workbench stacks and the rail becomes a bottom-ruled section. Below `600px`, transcript cues and rating controls collapse to one column. The sticky header uses `clamp(1rem,4vw,4rem)` horizontal padding.

The stage map is a bordered iframe at `height: 900px`; on smaller screens it uses a `600px` minimum or `70vh` with a `520px` minimum. Sections use `1.2rem` vertical padding and thin rules as the spacing rhythm.

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
- **Stage map:** Full-width framed black iframe with a small mono sync output overlaid at bottom right.
- **Verdict:** Panel Brown background, rule border, and a gold topological role as the human close/reopen surface.

### Signature Component: Stage Map + Transcript
The Archify map is the theory surface and stays above the transcript. Live turns call out corresponding map nodes, with the sync label reporting whether the map follows the cue. Transcript rows use a role color, mono status/provider metadata, evidence text, and rule separators. The gold `2px` top border marks the start of observed performance.

## Do's and Don'ts

### Do:
- **Do** keep the Archify stage map full-width above the performance transcript.
- **Do** use warm blackout surfaces and thin rules for hierarchy.
- **Do** reserve amber, red, blue, and green for cues, roles, and status meaning.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** keep human verdict controls after the evidence-bearing transcript.

### Don't:
- **Don't** introduce generic dashboard card grids, glossy shadows, or large rounded containers.
- **Don't** replace the serif/mono pairing with a single sans-serif voice.
- **Don't** use accent colors as arbitrary decoration.
- **Don't** hide evidence, failed fields, or the human verdict behind collapsed UI.
