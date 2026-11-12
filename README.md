# Hush

**Silence, re-engineered.** An editorial scrollytelling landing page for flagship wireless headphones, driven by a 240-frame HTML5 Canvas explosion and reassembly sequence.

**Live Demo:** [https://hush-headphones-website.vercel.app](https://hush-headphones-website.vercel.app)

## Overview

Hush is a dark-mode product showcase that combines cinematic scroll choreography with precision engineering storytelling. As the visitor scrolls down a `620vh` sticky stage, a pair of matte-black wireless headphones transitions from an assembled hero shot into a 240-frame 3D disassembly sequence, pauses on a floating technical diagram with sequential component callouts, and smoothly reassembles into a final call to action with an interactive finish configurator.

## Features

- **Scroll-Synchronized 240-Frame Canvas Playback**: Smooth scrubbable playback across 240 JPEG frames (`1280×720`) rendered on a `devicePixelRatio`-aware HTML5 `<canvas>` with spring damping.
- **Five Choreographed Storytelling Beats**:
  1. **Hero (`0%`)**: Assembled studio view with editorial typography and an animated scroll prompt.
  2. **Disassembly (`0–40%`)**: Mechanical ignition and outward explosion into internal acoustic components.
  3. **Exploded Technical View (`40–62%`)**: Sequential callout cards with stage-aligned SVG elbow leader lines highlighting the 40mm carbon-fiber driver, dual-core ANC processor and 12-mic array, and 30-hour endurance architecture.
  4. **Reassembly (`62–86%`)**: Reverse-scrubbed reassembly paired with sound fidelity and ergonomic craft copy.
  5. **Final CTA (`86–100%`)**: Reassembled headphones locked above the closing headline, specifications, and interactive purchase drawer.
- **Seamless Obsidian Edge Feathering**: Per-frame 4-edge gradient masking in `<canvas>` dissolves frame borders directly into `#000000` so no image seams appear.
- **Progressive Preloading & Fallback**: Priority keyframes hydrate first, followed by 10-frame concurrent batches with nearest-loaded-frame fallback to prevent blank flashes during rapid scrolling.
- **Interactive Finish Configurator**: Modal drawer allowing users to switch between *Obsidian Black* and *Platinum Silver* finishes and simulate reservation confirmation.
- **Responsive Mobile & Desktop Layout**: Stage containment adjusts cleanly for portrait mobile screens, placing callout cards in the lower safe zone without obscuring hardware visuals.

## Tech Stack

- **Framework**: Next.js 14 (`App Router`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion (`useScroll`, `useTransform`, `useSpring`, `AnimatePresence`)
- **Rendering**: HTML5 2D Canvas (`requestAnimationFrame` + HiDPI scaling)
- **Icons & Fonts**: Lucide React, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`

## Project Structure

```text
├── app/
│   ├── globals.css          # Base obsidian styling, custom scrollbar, selection styles
│   ├── layout.tsx           # Root layout, local variable fonts, Hush metadata
│   └── page.tsx             # 620vh scroll track, sticky stage, footer, modal state
├── components/
│   ├── Navbar.tsx           # Auto-revealing top bar, chapter navigation, progress hairline
│   ├── PurchaseModal.tsx    # Finish configurator and reservation confirmation modal
│   ├── ScrollytellingCanvas.tsx  # HiDPI HTML5 canvas engine, preloader, edge feathering
│   └── StoryOverlays.tsx    # Scroll-linked typography beats and SVG callout leaders
├── lib/
│   └── sequenceConfig.ts    # Scroll progress state machine, callout coordinates, chapters
├── public/
│   ├── frames/              # 240 sequential JPG frames (ezgif-frame-001.jpg .. 240.jpg)
│   └── images/              # Assembled hero render and studio preview photography
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## How the Scroll-to-Frame Animation Works

1. [`Home`](app/page.tsx) binds Framer Motion's `useScroll` to a `620vh` container wrapping a sticky `100dvh` viewport stage.
2. [`ScrollytellingCanvas`](components/ScrollytellingCanvas.tsx) wraps `scrollProgress` in a tuned `useSpring` (`stiffness: 300`, `damping: 38`) to smooth discrete mouse-wheel notches without lag, then schedules a `requestAnimationFrame` draw pass.
3. [`getCanvasRenderState`](lib/sequenceConfig.ts) maps normalized progress `p ∈ [0, 1]` via `easeInOutCubic` and `smoothstep` curves:
   - `0.00 – 0.08`: Holds the assembled hero shot while subtly scaling and centering it.
   - `0.08 – 0.15`: Cross-dissolves from the assembled render into opening frames `001–024`.
   - `0.15 – 0.40`: Advances through frames `024–120` during disassembly.
   - `0.40 – 0.62`: Sweeps frames `120–240` into the horizontal technical layout while `CalloutOverlay` fades each specification card in and out sequentially.
   - `0.62 – 0.79`: Plays frames `240–001` in reverse for mechanical reassembly.
   - `0.79 – 0.86`: Locks frame `001` back into the assembled render.
   - `0.86 – 1.00`: Elevates the assembled headphones smoothly above the final CTA.

## Getting Started

### Prerequisites

- Node.js `18.18+` or `20+`
- `npm` `9+`

### Installation & Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Preview

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Replacing the Image Sequence Frames

1. Replace the files in `public/frames/` using zero-padded sequential filenames (for example `ezgif-frame-001.jpg` through `ezgif-frame-240.jpg`).
2. If your new sequence has a different frame count or filename pattern, update `TOTAL_FRAMES` and `getFrameUrl` in [`lib/sequenceConfig.ts`](lib/sequenceConfig.ts).
3. Replace `public/images/assembled-hero.jpg` (and optionally `public/images/hero-studio-horizontal.jpg`) with matching-aspect-ratio renders on a dark `#000000` background.
4. Adjust the percentage coordinates (`anchor`, `elbow`, `cardAnchor`) in `TECHNICAL_CALLOUTS` inside [`lib/sequenceConfig.ts`](lib/sequenceConfig.ts) to align the callout dots with your components.

> **Asset Optimization Tip**: The current 240 JPEG frames total ~5.43 MB (~23 KB/frame), which loads quickly and stays well under GitHub's 100 MB per-file limit. If you upgrade to 2K/4K frames in the future, batch-converting them to `.webp` can reduce transfer weight further without visible banding.

## Deployment (Vercel)

The live site is hosted on Vercel at [https://hush-headphones-website.vercel.app](https://hush-headphones-website.vercel.app).

1. Push the repository to GitHub on the `main` branch.
2. Import the repository in [Vercel](https://vercel.com) (`Framework Preset: Next.js`).
3. Leave the default build command (`npm run build`) and output directory (`.next`). Static assets in `public/frames/` and `public/images/` are served directly from Vercel's Edge Network.

## Design Notes

- **Color Palette** (`app/globals.css`, `tailwind.config.ts`):
  - Background Void: `#000000` (`obsidian`) / `#050507` (`surface`)
  - Primary Text: `#FFFFFF`
  - Secondary Text: `#A1A1A6` (`muted`)
  - Accent: `#9FB3C8` / `#8EA4C8` / `#C8D0DC` (cool silver / muted slate blue)
- **Typography** (`app/layout.tsx`, `tailwind.config.ts`):
  - Primary UI & Display: `Inter Variable` with SF Pro / system sans fallbacks and tight tracking (`-0.04em` on hero display headlines)
  - Technical Callouts & Specs: `JetBrains Mono Variable`

## Disclaimer

This is a concept and portfolio demonstration project built for educational and interactive design showcase purposes. **Hush** is a fictional concept brand and is not affiliated with, endorsed by, or connected to any commercial audio or electronics manufacturer.

## License

Released under the [MIT License](LICENSE).

