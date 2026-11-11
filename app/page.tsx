"use client";

import { useCallback, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import Navbar from "@/components/Navbar";
import PurchaseModal from "@/components/PurchaseModal";
import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";
import StoryOverlays from "@/components/StoryOverlays";

export default function Home() {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"],
  });

  const handleJumpTo = useCallback((progress: number) => {
    const el = scrollTrackRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - window.innerHeight;
    const targetTop = el.offsetTop + maxScroll * Math.max(0, Math.min(1, progress));
    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar
        scrollProgress={scrollYProgress}
        onJumpTo={handleJumpTo}
        onBuyClick={() => setBuyModalOpen(true)}
      />

      {/* 620vh Scroll Choreography Track */}
      <div ref={scrollTrackRef} className="relative h-[620vh] w-full bg-black">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
          <ScrollytellingCanvas
            scrollProgress={scrollYProgress}
            assembledSrc="/images/assembled-hero.jpg"
          />
          <StoryOverlays
            scrollProgress={scrollYProgress}
            onBuyClick={() => setBuyModalOpen(true)}
            onJumpTo={handleJumpTo}
          />
        </div>
      </div>

      {/* Ultra-Minimal Editorial Footer */}
      <footer className="border-t border-white/[0.06] bg-black px-6 py-10 text-center">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-xs text-[#A1A1A6]">
            <span className="font-semibold uppercase tracking-[0.22em] text-white/90">
              Hush
            </span>
            <span className="h-3 w-px bg-white/15" />
            <span>Studio Acoustic Showcase</span>
          </div>
          <p className="font-mono text-[11px] text-[#A1A1A6]/70">
            40mm Carbon Driver · Dual-Core ANC DSP · Designed for Pure Silence
          </p>
        </div>
      </footer>

      <PurchaseModal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
      />
    </main>
  );
}

