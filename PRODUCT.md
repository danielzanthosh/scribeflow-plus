# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are STEM students, academic researchers, and lifelong learners transcribing dense digital notes, mathematical formulas, and tables into physical paper notebooks. They operate in lecture halls, dorm rooms, study desks, and libraries, balancing screen visibility with notebook handwriting.

## Product Purpose

ScribeFlow+ eliminates the cognitive friction, eye fatigue, and lost-place disorientation that occurs when copying lecture slides, papers, or digital documents by hand into a physical notebook. It paces transcription into natural 3–6 word syntactic working-memory chunks and senses when the user is writing vs looking up at the screen.

## Positioning

Unlike generic teleprompters, word processors, or AI-heavy transcription tools, ScribeFlow+ is a 100% local-first, distraction-free transcription flow. Its core mechanism couples non-AI linguistic phrase boundary detection with real-time head pitch and gaze vision tracking that requires zero server calls, zero accounts, and zero telemetry.

## Operating Context

- **Environment**: Desks, study tables, lecture halls, and libraries under varied lighting (daylight and dim night settings).
- **Physical Setup**: Laptop or tablet placed at arm's length with a paper notebook resting directly below on the desk surface, creating an ergonomic ~20° vertical head pitch delta.
- **Tools**: Physical paper notebooks, pens/pencils, alongside modern web browsers (Chrome, Edge, Firefox, Safari) with webcam access.
- **Workflow**: Paste/OCR notes -> Calibrate desk angle (2 clicks) -> Read active phrase -> Look down at paper to write -> Look up at screen -> Automatic advancement to next phrase.

## Capabilities and Constraints

- **Non-AI Linguistic Chunking Engine**: Syntactically groups phrases by clauses, conjunctions, and prepositions while strictly preserving inline LaTeX (`$...$`), display math blocks (`$$...$$`), and Markdown tables intact.
- **Dual-State Gaze & Head Pitch Vision**: Estimates head pitch elevation via local HTML5 Canvas pixel analysis. Identifies "Screen Reading" vs "Notebook Writing" with a dwell filter debounce to prevent jitter.
- **Client-Side Privacy**: Zero camera recording, zero frame storage, zero cloud uploads. Video stream processed strictly in local browser memory.
- **Zero-Database Storage**: Scripts and user settings persist locally in browser `LocalStorage`. File import and export available via Markdown and JSON.
- **Formatting Guarantees**: KaTeX equation rendering with safe exception boundaries, and GitHub Flavored Markdown tables.
- **Six Contrast-Verified Themes**: Warm Paper, Midnight Obsidian, Cyberpunk Neon, Nordic Frost, Solarized Dusk, and Botanical Sage (all meeting WCAG AA ≥ 4.5:1 contrast standards).
- **Optional BYOK AI**: Bring-Your-Own-Key client (OpenRouter/OpenAI-compatible) solely for optional OCR cleanup, semantic phrase refinement, and note formatting repair.
- **Offline & PWA Expectation**: Full offline operability for classrooms and disconnected library environments.

## Brand Commitments

- **Product Name**: ScribeFlow+
- **Author & Creator**: Daniel Santhosh
- **Licensing**: Open source under the MIT License, with an explicit first-launch legal gatekeeper ensuring user consent to privacy and license terms.
- **Tone & Voice**: Academic, focused, distraction-free, quiet, and tactile.

## Evidence on Hand

- Fully operational React 18 + TypeScript + Vite codebase located in [`src/`](src/).
- Sample lecture notes included in [`src/utils/presets.ts`](src/utils/presets.ts) covering Physics & Calculus, Thermodynamics, Cellular Biology, and World History.
- Public GitHub repository established at [https://github.com/danielzanthosh/scribeflow-plus](https://github.com/danielzanthosh/scribeflow-plus).

## Product Principles

1. **Local-First & Absolute Privacy**: User notes and camera streams never leave the client device; the app remains fully functional without an internet connection.
2. **Cognitive Flow over Density**: Never overwhelm the scribing student; present text in natural working-memory chunks matched to handwriting rhythm.
3. **Deterministic Syntactic Quality**: Core parsing, chunking, and rendering must not depend on non-deterministic external LLMs or network latency.
4. **Ergonomic Symbiosis**: Hardware, webcam vision, and typography must actively adapt to the physical posture of handwritten scribing.

## Accessibility & Inclusion

- Keyboard navigability for all transcription flows (`Space`, arrow keys, `J`, `K`, `R`, `F`).
- High-contrast text palettes across all light and dark themes.
- Web Audio tactile auditory feedback with mute controls.
- Motion safety: All spring and slide animations respect `prefers-reduced-motion`.
