"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  TOTAL_FRAMES,
  getCanvasRenderState,
  getFrameUrl,
} from "@/lib/sequenceConfig";

interface ScrollytellingCanvasProps {
  scrollProgress: MotionValue<number>;
  assembledSrc?: string;
}

const PRIORITY_INDICES = [
  0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 119, 135, 150, 165, 180, 195, 210, 225, 239,
];

export default function ScrollytellingCanvas({
  scrollProgress,
  assembledSrc = "/images/assembled-hero.jpg",
}: ScrollytellingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const assembledImgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const latestProgressRef = useRef<number>(0);

  const [initialReady, setInitialReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Smooth spring tied tightly to scroll position to eliminate stepped mouse-wheel jitter
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 300,
    damping: 38,
    restDelta: 0.0001,
  });

  const findNearestLoadedFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const rounded = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(targetIndex)));
    const exact = framesRef.current[rounded];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return exact;
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const forward = rounded + offset;
      if (forward < TOTAL_FRAMES) {
        const img = framesRef.current[forward];
        if (img && img.complete && img.naturalWidth > 0) return img;
      }
      const backward = rounded - offset;
      if (backward >= 0) {
        const img = framesRef.current[backward];
        if (img && img.complete && img.naturalWidth > 0) return img;
      }
    }
    return null;
  }, []);

  const drawLayerWithEdgeFeather = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number,
      opacity: number,
      scale: number,
      offsetYRatio = 0
    ) => {
      if (opacity <= 0.002 || !img.complete || img.naturalWidth === 0) return;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const viewAspect = canvasWidth / canvasHeight;

      // Responsive containment with balanced cinema margins
      let baseW: number;
      let baseH: number;
      if (viewAspect >= 1.35) {
        // Desktop / Landscape
        const maxW = canvasWidth * 0.92;
        const maxH = canvasHeight * 0.86;
        if (maxW / imgAspect <= maxH) {
          baseW = maxW;
          baseH = maxW / imgAspect;
        } else {
          baseH = maxH;
          baseW = maxH * imgAspect;
        }
      } else {
        // Portrait / Mobile: full horizontal fit centered with clear top/bottom editorial space
        baseW = canvasWidth * 0.98;
        baseH = baseW / imgAspect;
      }

      const drawW = baseW * scale;
      const drawH = baseH * scale;
      const dx = (canvasWidth - drawW) / 2;
      const dy = (canvasHeight - drawH) / 2 + canvasHeight * offsetYRatio;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, drawW, drawH);

      // Soft 4-edge studio void feathering so image borders melt 100% invisibly into #000000
      const edgeX = drawW * 0.07;
      const edgeY = drawH * 0.1;

      const topGrad = ctx.createLinearGradient(0, dy, 0, dy + edgeY);
      topGrad.addColorStop(0, "rgba(0,0,0,1)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(dx - 2, dy - 2, drawW + 4, edgeY + 2);

      const botGrad = ctx.createLinearGradient(0, dy + drawH - edgeY, 0, dy + drawH);
      botGrad.addColorStop(0, "rgba(0,0,0,0)");
      botGrad.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(dx - 2, dy + drawH - edgeY, drawW + 4, edgeY + 2);

      const leftGrad = ctx.createLinearGradient(dx, 0, dx + edgeX, 0);
      leftGrad.addColorStop(0, "rgba(0,0,0,1)");
      leftGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = leftGrad;
      ctx.fillRect(dx - 2, dy - 2, edgeX + 2, drawH + 4);

      const rightGrad = ctx.createLinearGradient(dx + drawW - edgeX, 0, dx + drawW, 0);
      rightGrad.addColorStop(0, "rgba(0,0,0,0)");
      rightGrad.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = rightGrad;
      ctx.fillRect(dx + drawW - edgeX, dy - 2, edgeX + 2, drawH + 4);

      ctx.restore();
    },
    []
  );

  const renderCanvas = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW === 0 || cssH === 0) return;

      const targetW = Math.round(cssW * dpr);
      const targetH = Math.round(cssH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Unified deep obsidian background matching image frame margins
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cssW, cssH);

      const state = getCanvasRenderState(progress);

      // 1. Sequence frame layer
      if (state.frameOpacity > 0.002) {
        const frameImg = findNearestLoadedFrame(state.frameIndex);
        if (frameImg) {
          drawLayerWithEdgeFeather(
            ctx,
            frameImg,
            cssW,
            cssH,
            state.frameOpacity,
            state.frameScale
          );
        }
      }

      // 2. Assembled product layer (Hero & Final Reassembly Lock)
      if (state.assembledOpacity > 0.002 && assembledImgRef.current) {
        drawLayerWithEdgeFeather(
          ctx,
          assembledImgRef.current,
          cssW,
          cssH,
          state.assembledOpacity,
          state.assembledScale,
          state.assembledOffsetY
        );
      }

      ctx.restore();
    },
    [drawLayerWithEdgeFeather, findNearestLoadedFrame]
  );

  const scheduleDraw = useCallback(
    (progress: number) => {
      latestProgressRef.current = progress;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        renderCanvas(latestProgressRef.current);
      });
    },
    [renderCanvas]
  );

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    scheduleDraw(latest);
  });

  // Preload assembled hero image + priority keyframes first, then remaining frames cleanly
  useEffect(() => {
    let cancelled = false;

    const loadImage = (src: string): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    async function preloadSequence() {
      // Load assembled hero image and frame 001 immediately for zero-delay first paint
      const [heroImg, firstFrame] = await Promise.all([
        loadImage(assembledSrc),
        loadImage(getFrameUrl(0)),
      ]);

      if (cancelled) return;
      if (heroImg) {
        assembledImgRef.current = heroImg;
      } else {
        // Fallback if custom assembled image is unavailable
        const fallback = await loadImage("/images/hero-studio-horizontal.jpg");
        if (!cancelled && fallback) assembledImgRef.current = fallback;
      }

      if (firstFrame) {
        framesRef.current[0] = firstFrame;
        setLoadedCount(1);
      }

      setInitialReady(true);
      scheduleDraw(latestProgressRef.current);

      // Load priority keyframes next
      await Promise.all(
        PRIORITY_INDICES.filter((idx) => idx !== 0).map(async (idx) => {
          const img = await loadImage(getFrameUrl(idx));
          if (!cancelled && img) {
            framesRef.current[idx] = img;
            setLoadedCount((c) => c + 1);
          }
        })
      );

      if (cancelled) return;
      scheduleDraw(latestProgressRef.current);

      // Progressive batch loading for remaining frames (concurrency = 10)
      const prioritySet = new Set(PRIORITY_INDICES);
      const remaining: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!prioritySet.has(i)) remaining.push(i);
      }

      const BATCH_SIZE = 10;
      for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
        if (cancelled) break;
        const batch = remaining.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (idx) => {
            const img = await loadImage(getFrameUrl(idx));
            if (!cancelled && img) {
              framesRef.current[idx] = img;
              setLoadedCount((c) => c + 1);
            }
          })
        );
        if (!cancelled) {
          scheduleDraw(latestProgressRef.current);
        }
      }
    }

    preloadSequence();

    const handleResize = () => scheduleDraw(latestProgressRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [assembledSrc, scheduleDraw]);

  const progressPct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));

  return (
    <div className="relative h-full w-full bg-black">
      <canvas
        ref={canvasRef}
        aria-label="Hush Interactive 3D Engineering Sequence"
        className="block h-full w-full"
      />

      {/* Subtle loading veil only during first frame hydration */}
      <AnimatePresence>
        {!initialReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A1A1A6]">
              Initializing Acoustics
            </span>
            <div className="mt-3 h-[1px] w-32 overflow-hidden bg-white/10">
              <div
                className="h-full bg-[#9FB3C8] transition-all duration-300"
                style={{ width: `${Math.max(15, progressPct)}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
