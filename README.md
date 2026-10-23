# ScribeFlow+

> **The distraction-free cognitive note transcription flow.** Designed for students, researchers, and writers who copy digital notes, equations, and tables into physical paper notebooks.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Local-First](https://img.shields.io/badge/Architecture-Local--First-emerald.svg)]()
[![Zero-Telemetry](https://img.shields.io/badge/Privacy-Zero--Telemetry-purple.svg)]()
[![KaTeX](https://img.shields.io/badge/Formulas-KaTeX-orange.svg)]()

---

## 💡 Why ScribeFlow+?

Copying dense study material from PDF slides, websites, or video lectures into a physical paper notebook often leads to lost focus, awkward neck strain, and fragmented concentration.

**ScribeFlow+ solves this through a dedicated transcription flow:**
- **Syntactic Cognitive Chunking**: Breaks text into natural 3–6 word handwriting units based on clause and grammar boundaries.
- **Reimagined Gaze & Head Pitch Tracking**: Detects when you glance down at your desk to write, and automatically advances to the next phrase the moment you look back up at the screen.
- **Flawless Mathematical LaTeX & Table Rendering**: Complex equations ($\int_{-\infty}^\infty e^{-x^2} dx = \sqrt{\pi}$) and Markdown tables remain intact and readable.
- **100% Local-First & Private**: No mandatory user accounts, remote databases, or cloud servers. All computer vision and data storage runs directly on your local device.

---

## ✨ Key Features

### 1. Advanced Non-AI Linguistic Chunking
- Syntactic segmentation respecting clause punctuation (`,`, `;`, `:`, `—`, `.`).
- Preserves natural prepositional phrases (`in the cytoplasm`, `at constant pressure`) and verb phrases.
- Keeps numbers and physical units together (`250 mg`, `3.14 rad/s`).
- Never cuts in the middle of inline LaTeX (`$E = mc^2$`) or display math blocks (`$$...$$`).
- Table Mode: Converts Markdown tables into readable cell-by-cell or row-by-row units with column headers.
- Modes: **Short** (3–4 words), **Balanced** (4–6 words), **Long** (6–9 words), and **Sentence Mode**.

### 2. Reimagined Head Pitch & Gaze Vision
- **Natural Writing Flow (Look-Up Trigger)**: Read the phrase, look down at your notebook to write. When you glance back up, ScribeFlow+ seamlessly displays the next phrase.
- **1-Click Desk Calibration**: Calibrate your specific screen angle and notebook position in seconds.
- **Dwell Debounce Filter**: Prevents accidental skipping during quick glances.
- **Privacy by Design**: Video frames are processed in-memory via HTML5 Canvas on your local CPU/GPU. No video frames are ever recorded or transmitted over the network.

### 3. Precision Multi-Theme System
Six themes tested for contrast (≥4.5:1 ratio) and visual comfort:
- **Warm Paper**: Classic Ivory & Crimson note aesthetic optimized for daylight study.
- **Midnight Obsidian**: Deep charcoal and sky-blue glow for late-night study sessions.
- **Cyberpunk Neon**: High-contrast dark with electric cyan and magenta accents.
- **Nordic Frost**: Minimalist cool arctic slate and crisp navy.
- **Solarized Dusk**: Nocturnal sepia canvas with solar amber accents.
- **Botanical Sage**: Earthy forest green and soothing paper tones.

### 4. Optional BYOK AI Integration (OpenRouter Compatible)
*Core ScribeFlow+ operates 100% locally without AI.* For users who want extra assistance:
- **Bring Your Own Key (BYOK)**: Supports OpenRouter, OpenAI, Groq, or local Ollama endpoints (`http://localhost:11434/v1`).
- **AI OCR Enhancement**: Refines messy textbook or chalkboard photos into clean Markdown.
- **Note Fixer**: Automatically corrects typos, broken formatting, and repairs malformed LaTeX or tables.

### 5. Client-Side Offline OCR
- Upload or drag-and-drop photos of textbook pages or handwritten notes.
- Powered by `Tesseract.js` directly inside the browser sandbox.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` / `→` / `J` / `↓` | Advance to Next Phrase |
| `←` / `K` / `↑` | Return to Previous Phrase |
| `R` / `Home` | Reset Flow to Start |
| `F` | Toggle Distraction-Free Fullscreen |
| `M` | Toggle Subtle Tactile Audio Feedback |
| `Esc` | Close Open Modals / Exit Fullscreen |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Modern web browser with WebCam access (Chrome, Edge, Firefox, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/danielzanthosh/scribeflow.git
cd scribeflow

# Install project dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛡️ Privacy & Terms Gatekeeper

On first launch, ScribeFlow+ presents a mandatory **Terms & Privacy Gatekeeper**. The application strictly enforces:
- **Zero data collection or tracking**.
- **Camera streams remain 100% in local memory**.
- **Open-source transparency under the MIT License**.

---

## 📜 License & Credits

- **Author & Creator:** Daniel Santhosh ([github.com/danielzanthosh](https://github.com/danielzanthosh))
- **License:** [MIT License](LICENSE) — free for personal, academic, and commercial use.
- **KaTeX:** Khan Academy & contributors.
- **Icons:** Lucide Icons.
- **Craft Principles:** Inspired by Emil Kowalski and Impeccable design guidelines.
