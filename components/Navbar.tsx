"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { SCROLL_CHAPTERS } from "@/lib/sequenceConfig";

interface NavbarProps {
  scrollProgress: MotionValue<number>;
  onJumpTo: (progress: number) => void;
  onBuyClick: () => void;
}

export default function Navbar({ scrollProgress, onJumpTo, onBuyClick }: NavbarProps) {
  const navOpacity = useTransform(scrollProgress, [0.02, 0.06], [0, 1]);
  const navY = useTransform(scrollProgress, [0.02, 0.06], [-10, 0]);
  const navPointerEvents = useTransform(scrollProgress, (v) =>
    v >= 0.03 ? "auto" : "none"
  );
  const progressScaleX = useTransform(scrollProgress, [0, 1], [0, 1]);

  return (
    <motion.header
      style={{ opacity: navOpacity, y: navY, pointerEvents: navPointerEvents }}
      className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Brand Identity */}
        <button
          type="button"
          onClick={() => onJumpTo(0)}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 transition-colors group-hover:text-white">
            Hush
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="text-xs font-medium tracking-tight text-[#A1A1A6] transition-colors group-hover:text-white">
            Studio
          </span>
        </button>

        {/* Chapter Jump Controls */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Story chapters">
          {SCROLL_CHAPTERS.map((chapter) => (
            <button
              key={chapter.label}
              type="button"
              onClick={() => onJumpTo(chapter.progress)}
              className="text-xs font-normal tracking-wide text-[#A1A1A6] transition-colors duration-300 hover:text-white focus:outline-none"
            >
              {chapter.label}
            </button>
          ))}
        </nav>

        {/* Subtle Primary CTA */}
        <button
          type="button"
          onClick={onBuyClick}
          className="rounded-full bg-white px-4 py-1.5 text-xs font-medium tracking-tight text-black transition-all duration-300 hover:bg-[#E5E9F0] focus:outline-none focus:ring-2 focus:ring-[#9FB3C8]/50"
        >
          Buy Now
        </button>
      </div>

      {/* Hairline progress bar */}
      <motion.div
        style={{ scaleX: progressScaleX }}
        className="h-[1px] w-full origin-left bg-gradient-to-r from-white/30 via-[#9FB3C8] to-white/70"
      />
    </motion.header>
  );
}
