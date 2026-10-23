import { Script } from '../types';

export const DEFAULT_PRESET_SCRIPTS: Script[] = [
  {
    id: 'preset-calc-physics',
    title: 'Calculus & Quantum Mechanics Notes',
    category: 'Physics & Math',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastChunkIndex: 0,
    content: `# Advanced Mathematical Physics

## Fundamental Principles
The core law of classical mechanics states that force equals rate of change of momentum:
$$F = \\frac{dp}{dt} = m \\cdot a$$

For energy conservation in a conservative field:
$$\\nabla \\times \\mathbf{F} = 0 \\implies \\mathbf{F} = -\\nabla V$$

## Time-Dependent Schrödinger Equation
In non-relativistic quantum systems, the wave function $\\Psi(r, t)$ satisfies:
$$i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)$$

Where the Hamiltonian operator is defined as:
$$\\hat{H} = -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t)$$

### Key Mathematical Constants
- Euler's identity links five fundamental constants: $e^{i\\pi} + 1 = 0$
- Normalized Gaussian distribution: $\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$
- Planck's reduced constant: $\\hbar \\approx 1.0545718 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$`,
  },
  {
    id: 'preset-thermodynamics-table',
    title: 'Thermodynamics & Physical Constants',
    category: 'Chemistry & Tables',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastChunkIndex: 0,
    content: `# Chemical Thermodynamics & Gas Properties

## Standard Thermodynamic Values at 298.15 K
| Substance | Formula | $\\Delta H_f^\\circ$ (kJ/mol) | $S^\\circ$ (J/mol·K) | State |
| Carbon Dioxide | $CO_2$ | -393.5 | 213.8 | Gas |
| Water (Liquid) | $H_2O$ | -285.8 | 69.91 | Liquid |
| Methane | $CH_4$ | -74.8 | 186.3 | Gas |
| Glucose | $C_6H_{12}O_6$ | -1273.3 | 212.1 | Solid |
| Ammonia | $NH_3$ | -46.1 | 192.8 | Gas |

## Fundamental Gibbs Relation
The spontaneity of a reaction is dictated by Gibbs Free Energy:
$$\\Delta G = \\Delta H - T\\Delta S$$

When $\\Delta G < 0$, the process is thermodynamically spontaneous.`,
  },
  {
    id: 'preset-cellular-biology',
    title: 'Cellular Respiration & ATP Synthesis',
    category: 'Biology',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastChunkIndex: 0,
    content: `# Cellular Respiration & Bioenergetics

## 1. Overview of Aerobic Respiration
Cellular respiration is a series of catabolic metabolic pathways that extract biochemical energy from glucose:
$$C_6H_{12}O_6 + 6O_2 \\longrightarrow 6CO_2 + 6H_2O + 30-32\\text{ ATP}$$

## Three Sequential Phases:
- **Glycolysis**: Occurs in the cytoplasm; converts 1 glucose into 2 pyruvate molecules yielding net 2 ATP and 2 NADH.
- **Citric Acid Cycle (Krebs)**: Takes place inside mitochondrial matrix, producing $FADH_2$, NADH, and GTP.
- **Oxidative Phosphorylation**: Chemiosmosis driven by ATP synthase across the inner mitochondrial membrane.

### Proton Motive Force
The electrochemical proton gradient generates an electrical potential $\\Delta\\psi$ and pH gradient $\\Delta\\text{pH}$, rotating the $F_0$ subunit to forge ATP from ADP and inorganic phosphate.`,
  },
  {
    id: 'preset-world-history',
    title: 'The Silk Road & Early Global Trade',
    category: 'History',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastChunkIndex: 0,
    content: `# The Silk Road and Trans-Eurasian Exchange

The Silk Road was not a single paved highway, but rather an intricate network of overland and maritime trading routes that connected the Mediterranean basin with East Asia across the steppes, deserts, and mountain passes of Central Asia.

Beginning in the Han Dynasty (around 130 BCE), trade flourished through oasis cities like Samarkand, Dunhuang, and Bukhara. Merchants rarely traveled the entire 4,000-mile span themselves; instead, goods were passed along through regional intermediaries, trade caravans, and specialized caravanserais.

### Major Commodities Exchanged:
- **From China**: Silk, porcelain, paper, gunpowder, and tea.
- **From Central Asia**: Ferghana warhorses, jade, alfalfa, and lapis lazuli.
- **From India**: Cotton textiles, spices, ivory, and Buddhist philosophy.
- **From Rome & Byzantium**: Glassware, gold coinage, olive oil, and dyed wool.`,
  },
];
