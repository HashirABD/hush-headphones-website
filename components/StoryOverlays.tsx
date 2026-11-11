"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { TECHNICAL_CALLOUTS, type TechnicalCallout } from "@/lib/sequenceConfig";

interface StoryOverlaysProps {
  scrollProgress: MotionValue<number>;
  onBuyClick: () => void;
  onJumpTo: (progress: number) => void;
}

function CalloutOverlay({
  callout,
  scrollProgress,
}: {
  callout: TechnicalCallout;
  scrollProgress: MotionValue<number>;
}) {
  const [start, end] = callout.range;
  const fadeInEnd = start + (end - start) * 0.22;
  const fadeOutStart = end - (end - start) * 0.22;

  const opacity = useTransform(
    scrollProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [14, 0, 0, -10]
  );

  const ax = callout.anchor.x * 16;
  const ay = callout.anchor.y * 9;
  const ex = callout.elbow.x * 16;
  const ey = callout.elbow.y * 9;
  const cx = callout.cardAnchor.x * 16;
  const cy = callout.cardAnchor.y * 9;

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {/* Desktop Stage-Aligned Annotation Marker + Precision SVG Elbow Leader + Non-Occluding Card */}
      <div className="relative hidden h-[min(86vh,calc(92vw*0.5625))] w-[min(92vw,calc(86vh*1.7778))] md:block">
        <svg
          viewBox="0 0 1600 900"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <polyline
            points={`${ax},${ay} ${ex},${ey} ${cx},${cy}`}
            fill="none"
            stroke="rgba(159, 179, 200, 0.65)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={cx} cy={cy} r="3" fill="#9FB3C8" />
        </svg>

        {/* Precision Anchor Node */}
        <div
          style={{ left: `${callout.anchor.x}%`, top: `${callout.anchor.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <span className="absolute inset-0 -m-2.5 animate-ping rounded-full bg-[#9FB3C8]/30" />
          <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#9FB3C8] bg-black/85 shadow-[0_0_16px_rgba(159,179,200,0.45)]">
            <span className="h-1 w-1 rounded-full bg-white" />
          </span>
        </div>

        {/* Callout Editorial Card anchored cleanly in pure black void */}
        <div
          style={{
            left: `${callout.cardAnchor.x}%`,
            top:
              callout.cardAnchor.verticalAlign === "top"
                ? `${Math.max(4, callout.cardAnchor.y - 16)}%`
                : undefined,
            bottom:
              callout.cardAnchor.verticalAlign === "bottom"
                ? `${Math.max(4, 100 - callout.cardAnchor.y - 12)}%`
                : undefined,
          }}
          className="absolute w-72 rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur-xl lg:w-80"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9FB3C8]">
            {callout.tag}
          </p>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-white">
            {callout.title}
          </h3>
          <p className="mt-1 font-mono text-[11px] text-white/70">{callout.spec}</p>
          <p className="mt-2 text-xs leading-relaxed text-[#A1A1A6]">
            {callout.description}
          </p>
        </div>
      </div>

      {/* Mobile Clean Bottom Card */}
      <div className="absolute inset-x-4 bottom-8 rounded-2xl border border-white/10 bg-black/80 p-5 text-left backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9FB3C8]">
            {callout.tag}
          </span>
          <span className="font-mono text-[10px] text-white/60">{callout.spec}</span>
        </div>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-white">
          {callout.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#A1A1A6]">
          {callout.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function StoryOverlays({
  scrollProgress,
  onBuyClick,
  onJumpTo,
}: StoryOverlaysProps) {
  // Beat 1: Hero (0% - 9%)
  const heroOpacity = useTransform(scrollProgress, [0, 0.05, 0.095], [1, 1, 0]);
  const heroY = useTransform(scrollProgress, [0, 0.095], [0, -24]);
  const promptOpacity = useTransform(scrollProgress, [0, 0.035], [1, 0]);

  // Beat 2: Disassembly (11% - 39%)
  const disassemblyOpacity = useTransform(
    scrollProgress,
    [0.12, 0.17, 0.34, 0.39],
    [0, 1, 1, 0]
  );
  const disassemblyY = useTransform(
    scrollProgress,
    [0.12, 0.17, 0.34, 0.39],
    [24, 0, 0, -18]
  );

  // Beat 3 Header: Exploded Technical View (41% - 62%)
  const explodedHeaderOpacity = useTransform(
    scrollProgress,
    [0.4, 0.43, 0.59, 0.625],
    [0, 1, 1, 0]
  );
  const explodedHeaderY = useTransform(
    scrollProgress,
    [0.4, 0.43, 0.59, 0.625],
    [12, 0, 0, -8]
  );

  // Beat 4A: Reassembly — Sound Quality (63% - 74%)
  const soundOpacity = useTransform(
    scrollProgress,
    [0.635, 0.665, 0.72, 0.75],
    [0, 1, 1, 0]
  );
  const soundY = useTransform(
    scrollProgress,
    [0.635, 0.665, 0.72, 0.75],
    [22, 0, 0, -16]
  );

  // Beat 4B: Reassembly — Comfort & Craftsmanship (74.5% - 85%)
  const craftOpacity = useTransform(
    scrollProgress,
    [0.745, 0.775, 0.825, 0.855],
    [0, 1, 1, 0]
  );
  const craftY = useTransform(
    scrollProgress,
    [0.745, 0.775, 0.825, 0.855],
    [22, 0, 0, -16]
  );

  // Beat 5: Final CTA (86.5% - 100%)
  const finalOpacity = useTransform(scrollProgress, [0.87, 0.92, 1], [0, 1, 1]);
  const finalY = useTransform(scrollProgress, [0.87, 0.92, 1], [28, 0, 0]);
  const finalPointerEvents = useTransform(scrollProgress, (v) =>
    v >= 0.88 ? "auto" : "none"
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Subtle Ambient Vertical Readability Vignettes */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* ===================================================================== */}
      {/* BEAT 1: HERO (0%)                                                     */}
      {/* ===================================================================== */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="absolute inset-0 flex flex-col items-center justify-between px-6 pb-10 pt-14 text-center sm:pt-16"
      >
        <div className="mt-2 max-w-3xl sm:mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#9FB3C8] sm:text-[11px]">
            Hush Acoustic Engineering
          </p>
          <h1 className="mt-2.5 text-4xl font-bold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            Hush
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-[#A1A1A6] sm:text-base">
            Silence, re-engineered. Precision acoustics sculpted into pure obsidian stillness.
          </p>
        </div>

        {/* Subtle Scroll Prompt */}
        <motion.button
          type="button"
          style={{ opacity: promptOpacity }}
          onClick={() => onJumpTo(0.22)}
          className="pointer-events-auto group flex flex-col items-center gap-2.5 text-center focus:outline-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#A1A1A6] transition-colors group-hover:text-white">
            Scroll to disassemble
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-5 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]"
          >
            <ArrowDown className="h-3 w-3 text-[#9FB3C8]" />
          </motion.span>
        </motion.button>
      </motion.section>

      {/* ===================================================================== */}
      {/* BEAT 2: DISASSEMBLY (0% - 40%)                                        */}
      {/* ===================================================================== */}
      <motion.section
        style={{ opacity: disassemblyOpacity, y: disassemblyY }}
        className="absolute inset-x-5 bottom-10 mx-auto max-w-md text-center md:inset-x-auto md:bottom-14 md:left-14 md:mx-0 md:max-w-sm md:text-left lg:left-20"
      >
        <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-6 backdrop-blur-lg md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9FB3C8]">
            01 / Acoustic Architecture
          </p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            Engineered to silence the world.
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-[#A1A1A6] sm:text-[15px]">
            Every structural shell, damped acoustic baffle, and titanium slider separates along
            micro-calibrated tolerances to isolate pure studio sound.
          </p>
        </div>
      </motion.section>

      {/* ===================================================================== */}
      {/* BEAT 3: EXPLODED TECHNICAL VIEW (40% - 62%)                           */}
      {/* ===================================================================== */}
      <motion.div
        style={{ opacity: explodedHeaderOpacity, y: explodedHeaderY }}
        className="absolute left-5 top-16 sm:left-8 md:left-14 md:top-20 lg:left-20"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9FB3C8]">
          Exploded Technical Diagram
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
          Anatomy of silence.
        </p>
      </motion.div>

      {TECHNICAL_CALLOUTS.map((callout) => (
        <CalloutOverlay
          key={callout.id}
          callout={callout}
          scrollProgress={scrollProgress}
        />
      ))}

      {/* ===================================================================== */}
      {/* BEAT 4: REASSEMBLY (62% - 85%)                                        */}
      {/* ===================================================================== */}
      <motion.section
        style={{ opacity: soundOpacity, y: soundY }}
        className="absolute inset-x-5 bottom-10 mx-auto max-w-md text-center md:inset-x-auto md:bottom-14 md:right-14 md:mx-0 md:max-w-sm md:text-right lg:right-20"
      >
        <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-6 backdrop-blur-lg md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9FB3C8]">
            02 / Studio Fidelity
          </p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            Sound in three dimensions.
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-[#A1A1A6] sm:text-[15px]">
            High-resolution 24-bit wireless transmission and adaptive neural upscaling converge
            with low-distortion carbon drivers as the chamber seals shut.
          </p>
        </div>
      </motion.section>

      <motion.section
        style={{ opacity: craftOpacity, y: craftY }}
        className="absolute inset-x-5 bottom-10 mx-auto max-w-md text-center md:inset-x-auto md:bottom-14 md:left-14 md:mx-0 md:max-w-sm md:text-left lg:left-20"
      >
        <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-6 backdrop-blur-lg md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9FB3C8]">
            03 / Ergonomic Craftsmanship
          </p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            Weightless around your ears.
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-[#A1A1A6] sm:text-[15px]">
            Soft-fit synthetic leather memory cushions and stepless silent joints lock into a
            250-gram chassis built for all-day sanctuary.
          </p>
        </div>
      </motion.section>

      {/* ===================================================================== */}
      {/* BEAT 5: FINAL CTA (86% - 100%)                                        */}
      {/* ===================================================================== */}
      <motion.section
        style={{
          opacity: finalOpacity,
          y: finalY,
          pointerEvents: finalPointerEvents,
        }}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center px-5 text-center sm:bottom-12"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9FB3C8]">
          Hush Studio Wireless
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
          Nothing between you and the music.
        </h2>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px] text-[#A1A1A6]">
          <span>40mm Carbon Driver</span>
          <span className="text-white/20">•</span>
          <span>Dual-Core ANC DSP</span>
          <span className="text-white/20">•</span>
          <span>30h Battery</span>
          <span className="text-white/20">•</span>
          <span className="text-white">$449</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onBuyClick}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium tracking-tight text-black shadow-[0_0_40px_rgba(159,179,200,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#E8EDF4] focus:outline-none focus:ring-2 focus:ring-[#9FB3C8]/60"
          >
            <span>Buy Now</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => onJumpTo(0.49)}
            className="rounded-full border border-white/15 bg-black/50 px-5 py-3 text-sm font-normal tracking-tight text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:text-white focus:outline-none"
          >
            Inspect Architecture
          </button>
        </div>
      </motion.section>
    </div>
  );
}
