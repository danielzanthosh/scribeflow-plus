---
name: ScribeFlow+
description: The distraction-free cognitive note transcription flow
colors:
  paper-bg: "#faf7f0"
  paper-surface: "#ffffff"
  paper-surface-hover: "#f5f2eb"
  paper-border: "#e7e2d6"
  paper-border-focus: "#b45309"
  paper-text: "#1c1917"
  paper-text-muted: "#78716c"
  paper-text-subtle: "#a8a29e"
  paper-primary: "#854d0e"
  paper-primary-hover: "#713f12"
  paper-accent: "#b45309"
  paper-accent-bg: "#fef3c7"
  paper-active-chunk: "#451a03"
  paper-active-chunk-bg: "#fef08a"
  midnight-bg: "#090d16"
  midnight-surface: "#111827"
  midnight-text: "#f9fafb"
  midnight-accent: "#38bdf8"
  cyberpunk-bg: "#07080f"
  cyberpunk-surface: "#0f121d"
  cyberpunk-accent: "#00f0ff"
  nordic-bg: "#f4f6f9"
  nordic-surface: "#ffffff"
  nordic-accent: "#0284c7"
  solarized-bg: "#00212b"
  solarized-surface: "#073642"
  solarized-accent: "#b58900"
  sage-bg: "#f3f6f4"
  sage-surface: "#ffffff"
  sage-accent: "#2d6a4f"
typography:
  display:
    fontFamily: "Crimson Pro, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.15
  headline:
    fontFamily: "Crimson Pro, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Crimson Pro, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.paper-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.paper-primary-hover}"
  card-stage:
    backgroundColor: "{colors.paper-surface}"
    rounded: "{rounded.xl}"
    padding: "32px"
---

# Design System: ScribeFlow+

## Overview

**Creative North Star: "The Scribe's Sanctuary"**

ScribeFlow+ creates a focused, tactile desk environment that bridges physical ink with digital clarity. It draws aesthetic inspiration from illuminated manuscripts, fine stationery, and scholarly reading rooms, re-imagining them for modern high-resolution screens and webcam vision interfaces.

The design eliminates sensory clutter: navigation recedes into quiet chrome, cards avoid superfluous dropshadows or decorative gradients, and active reading text commands the stage with generous vertical whitespace and warm, paper-like warmth.

### Key Characteristics:
- **Paper-First Tactility:** High-contrast organic ink tones against cream ivory or deep nocturnal slate.
- **Rhythmic Working Memory:** Active phrases presented with clear, optical scale steps (3–6 words), framed by subtle context cues.
- **Purposeful Feedback:** Mechanical tactile audio clicks, micro-spring scale buttons (`active:scale-95`), and crisp dwell indicators.

## Colors

The ScribeFlow+ palette operates across six distinct atmospheric themes, with **Warm Paper** serving as the canonical default.

### Primary
- **Amber Ochre** (`#854d0e`): The foundational action color in the default Warm Paper theme, used for primary action buttons and confirmed states.
- **Crimson Amber Accent** (`#b45309`): Used for focused focus rings, active icons, and key phrase badges.

### Neutral
- **Deep Ink** (`#1c1917`): High-legibility text tone delivering WCAG AAA 16:1 contrast against the ivory background.
- **Warm Paper Surface** (`#faf7f0`): Background tone designed to mimic archival linen-rag paper.
- **Warm Border Tone** (`#e7e2d6`): Crisp 1px structural separator dividing workspace zones without visual heaviness.
- **Highlighter Yellow** (`#fef08a`): Deliberate highlighter tint used exclusively for active transcription phrases.

### Named Rules
**The Single-Active Rule.** Only one phrase may carry the highlighter accent (`var(--color-active-chunk-bg)`) at any given moment. All peripheral interface elements must yield hierarchy to the active text.

## Typography

**Display Font:** Crimson Pro (with Georgia, serif fallback)  
**Body Font:** Crimson Pro, with configurable switches to Inter (Sans-Serif) or JetBrains Mono  
**Label/Mono Font:** JetBrains Mono (monospace)

### Hierarchy
- **Display** (600 weight, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.15): Central active phrase in huge mode.
- **Headline** (700 weight, 1.75rem, line-height 1.25): Document titles and modal headers.
- **Title** (600 weight, 1.125rem, line-height 1.4): Section headers and panel groupings.
- **Body** (400 weight, 1.25rem, line-height 1.6, max line length 65ch): Standard transcription text and prose descriptions.
- **Label** (500 weight, 0.75rem, letter-spacing 0.05em, uppercase): Gaze HUD pitch metrics, chunk counters, and shortcuts.

### Named Rules
**The Formula Integrity Rule.** Mathematical expressions rendered via KaTeX must inherit font size and color from their parent block without artificial inline overrides or clipping.

## Layout

The workspace utilizes an edge-to-edge fluid viewport divided into three functional planes:
1. **Header Bar (56px):** Slim navigation rail housing theme switcher, mode toggle, and utility actions.
2. **Peripheral Inspector (288px width):** Optional collapsible script sidebar displaying the full document transcript with live synchronized scroll tracking.
3. **Hero Stage (Max-width 896px):** Centered viewport giving maximum breathing room to the active transcription card.

## Elevation & Depth

ScribeFlow+ follows a **Tonal Layering & Soft Structure** model. Hard offset zero-blur shadows and multi-layer dropshadows are forbidden. Depth is communicated primarily through distinct tonal surfaces, crisp 1px borders (`#e7e2d6`), and soft ambient elevation (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08)`) applied strictly to the central hero card.

### Shadow Vocabulary
- **Hero Card Elevation** (`box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06)`): Applied to the active reading card to slightly lift it above the reading plane.
- **Modal Overlay Elevation** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`): Applied to centered floating dialogs against the blurred backdrop.

## Shapes

- **Radius Hierarchy:**
  - Micro-controls & Badges: 8px (`rounded-lg`)
  - Standard Buttons & Inputs: 12px (`rounded-xl`)
  - Cards & Floating Panels: 16px to 24px (`rounded-2xl` to `rounded-3xl`)
  - Status Indicators & Pills: 9999px (`rounded-full`)

## Components

- **Hero Phrase Card:** Expansive, centered card with 32px internal padding, subtle pop animation (`animate-chunk-pop`), and zero decorative iconography inside the text field.
- **Navigation Buttons:** Large, tactile touch/click targets with subtle micro-spring compression (`active:scale-95`).
- **Gaze Vision HUD:** Floating picture-in-picture panel anchored to bottom-right, equipped with collapsible toggle and live horizon angle bar.
- **Transcript Item:** Interactive row item with gentle left-border highlight and automatic scroll centering on index change.

## Do's and Don'ts

### Do:
- Preserve high contrast (body text contrast ≥ 4.5:1 against surfaces at all times).
- Keep controls named with their exact action ("Start Flow", "Next Phrase", "Calibrate Screen").
- Ensure all modal dialogs can be dismissed cleanly via `Esc`.
- Provide smooth hardware-accelerated transitions via `transform` and `opacity`.

### Don't:
- Never use decorative gradient text or saturated rainbow highlights.
- Never use nested cards inside the main transcription stage.
- Never clip KaTeX equations or truncate mathematical notation without horizontal scrolling affordance.
- Never autoplay external audio files; all feedback must be synthesized locally via Web Audio API.
