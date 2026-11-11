export const TOTAL_FRAMES = 240;

export function getFrameUrl(index: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
  const num = String(clamped + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${num}.jpg`;
}

export interface CanvasRenderState {
  assembledOpacity: number;
  assembledScale: number;
  assembledOffsetY: number;
  frameOpacity: number;
  frameIndex: number;
  frameScale: number;
}

function clamp01(val: number): number {
  return Math.max(0, Math.min(1, val));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Maps normalized scroll progress [0, 1] to exact canvas layer opacities,
 * scales, and frame index across all 5 storytelling beats.
 */
export function getCanvasRenderState(progress: number): CanvasRenderState {
  const p = clamp01(progress);

  // Beat 1: Hero (0% - 8%) -> Assembled silhouette framed below Hero headline
  if (p < 0.08) {
    const t = p / 0.08;
    const eased = easeInOutCubic(t);
    return {
      assembledOpacity: 1,
      assembledScale: 0.86 + 0.08 * eased,
      assembledOffsetY: 0.1 - 0.1 * eased,
      frameOpacity: 0,
      frameIndex: 0,
      frameScale: 0.94,
    };
  }

  // Beat 2A: Mechanical ignition (8% - 15%) -> Assembled dissolves into opening exploded frame
  if (p < 0.15) {
    const t = (p - 0.08) / 0.07;
    const eased = smoothstep(0, 1, t);
    return {
      assembledOpacity: 1 - eased,
      assembledScale: 0.94 + 0.1 * eased,
      assembledOffsetY: 0,
      frameOpacity: eased,
      frameIndex: Math.round(eased * 23),
      frameScale: 0.94 + 0.06 * eased,
    };
  }

  // Beat 2B: Disassembly sweep (15% - 40%) -> Frames 024..120
  if (p < 0.4) {
    const t = (p - 0.15) / 0.25;
    const eased = easeInOutCubic(t);
    return {
      assembledOpacity: 0,
      assembledScale: 1,
      assembledOffsetY: 0,
      frameOpacity: 1,
      frameIndex: 23 + eased * (119 - 23),
      frameScale: 1.0,
    };
  }

  // Beat 3: Exploded Technical View (40% - 62%) -> Frames 120..240
  if (p < 0.62) {
    const t = (p - 0.4) / 0.22;
    const eased = easeInOutCubic(t);
    return {
      assembledOpacity: 0,
      assembledScale: 1,
      assembledOffsetY: 0,
      frameOpacity: 1,
      frameIndex: 119 + eased * (239 - 119),
      frameScale: 1.0,
    };
  }

  // Beat 4A: Reverse reassembly (62% - 79%) -> Frames 240..001
  if (p < 0.79) {
    const t = (p - 0.62) / 0.17;
    const eased = easeInOutCubic(t);
    return {
      assembledOpacity: 0,
      assembledScale: 1,
      assembledOffsetY: 0,
      frameOpacity: 1,
      frameIndex: 239 * (1 - eased),
      frameScale: 1.0,
    };
  }

  // Beat 4B: Final lock-in (79% - 86%) -> Exploded frame 001 contracts back into assembled
  if (p < 0.86) {
    const t = (p - 0.79) / 0.07;
    const eased = smoothstep(0, 1, t);
    return {
      assembledOpacity: eased,
      assembledScale: 1.04 - 0.1 * eased,
      assembledOffsetY: -0.04 * eased,
      frameOpacity: 1 - eased,
      frameIndex: 0,
      frameScale: 1.0 - 0.06 * eased,
    };
  }

  // Beat 5: Final CTA (86% - 100%) -> Fully assembled headphones elevated cleanly above CTA
  const t = (p - 0.86) / 0.14;
  const eased = easeInOutCubic(t);
  return {
    assembledOpacity: 1,
    assembledScale: 0.94 - 0.12 * eased,
    assembledOffsetY: -0.04 - 0.08 * eased,
    frameOpacity: 0,
    frameIndex: 0,
    frameScale: 0.94,
  };
}

export interface TechnicalCallout {
  id: string;
  tag: string;
  title: string;
  spec: string;
  description: string;
  range: [number, number];
  /** Normalized coordinates over the 16:9 image stage (percentage 0-100) */
  anchor: { x: number; y: number };
  elbow: { x: number; y: number };
  cardAnchor: { x: number; y: number; verticalAlign: "top" | "bottom" };
}

export const TECHNICAL_CALLOUTS: TechnicalCallout[] = [
  {
    id: "driver",
    tag: "01 / ACOUSTIC ENGINE",
    title: "40mm Carbon-Fiber Driver",
    spec: "4 Hz – 40,000 Hz  ·  OFC Voice Coil",
    description:
      "A rigid carbon-fiber composite dome paired with an oxygen-free copper voice coil and high-flux neodymium magnet delivers surgical micro-detail and effortless sub-bass.",
    range: [0.425, 0.49],
    anchor: { x: 63, y: 52 },
    elbow: { x: 67, y: 26 },
    cardAnchor: { x: 70, y: 26, verticalAlign: "top" },
  },
  {
    id: "anc",
    tag: "02 / COGNITIVE SILENCE",
    title: "Dual-Core ANC DSP & 12-Mic Array",
    spec: "Real-Time Adaptive Noise Cancellation",
    description:
      "Twelve precision microphones feed a dedicated dual-core noise-cancelling processor, sampling ambient acoustic pressure thousands of times per second.",
    range: [0.49, 0.555],
    anchor: { x: 47, y: 50 },
    elbow: { x: 54, y: 76 },
    cardAnchor: { x: 58, y: 76, verticalAlign: "bottom" },
  },
  {
    id: "battery",
    tag: "03 / ENDURANCE CELL",
    title: "30-Hour Acoustic Architecture",
    spec: "3 Min Charge = 3 Hours Playback",
    description:
      "High-density lithium architecture sits suspended within a zero-resonance magnesium housing, engineered for uninterrupted studio silence across continents.",
    range: [0.555, 0.62],
    anchor: { x: 38, y: 48 },
    elbow: { x: 46, y: 24 },
    cardAnchor: { x: 51, y: 24, verticalAlign: "top" },
  },
];

export const SCROLL_CHAPTERS = [
  { label: "Overview", progress: 0 },
  { label: "Disassembly", progress: 0.25 },
  { label: "Architecture", progress: 0.52 },
  { label: "Craft", progress: 0.74 },
  { label: "Order", progress: 0.96 },
] as const;
