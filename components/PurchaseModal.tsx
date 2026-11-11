"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles, X } from "lucide-react";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
}

const FINISHES = [
  {
    id: "obsidian",
    name: "Obsidian Black",
    swatch: "#141416",
    ring: "border-white/50",
    tagline: "Matte acoustic composite with gunmetal titanium hinges",
  },
  {
    id: "silver",
    name: "Platinum Silver",
    swatch: "#C6CCD6",
    ring: "border-[#9FB3C8]",
    tagline: "Anodized cool-silver finish with cloud-gray memory foam",
  },
] as const;

export default function PurchaseModal({ open, onClose }: PurchaseModalProps) {
  const [selectedFinish, setSelectedFinish] = useState<(typeof FINISHES)[number]["id"]>("obsidian");
  const [ordered, setOrdered] = useState(false);

  const activeFinish = FINISHES.find((f) => f.id === selectedFinish) ?? FINISHES[0];

  const handleConfirm = () => {
    setOrdered(true);
  };

  const handleClose = () => {
    setOrdered(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-2xl"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#070709] shadow-2xl"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close purchase drawer"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[#A1A1A6] transition-colors hover:border-white/25 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Product Studio Preview */}
              <div className="relative flex flex-col justify-between overflow-hidden bg-black p-6 md:col-span-5 md:border-r md:border-white/[0.06]">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#9FB3C8]">
                    Flagship Acoustic Series
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    Hush Studio
                  </h3>
                </div>

                <div className="relative my-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
                  <Image
                    src="/images/hero-studio-horizontal.jpg"
                    alt="Hush Wireless Studio Finish"
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className={`object-cover transition-all duration-700 ${
                      selectedFinish === "silver" ? "brightness-125 contrast-95 saturate-50" : ""
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </div>

                <div className="space-y-2 border-t border-white/[0.06] pt-4 text-xs text-[#A1A1A6]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#9FB3C8]" />
                    <span>2-Year Hush Precision Care Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#9FB3C8]" />
                    <span>Complimentary Express Delivery</span>
                  </div>
                </div>
              </div>

              {/* Configuration & Checkout */}
              <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-7">
                {ordered ? (
                  <div className="my-auto space-y-5 py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#9FB3C8]/30 bg-[#9FB3C8]/10 text-[#9FB3C8]">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-semibold tracking-tight text-white">
                        Reservation Confirmed
                      </h4>
                      <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#A1A1A6]">
                        Your Hush Studio headphones in{" "}
                        <span className="text-white">{activeFinish.name}</span> are reserved for
                        priority dispatch.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-full border border-white/15 px-6 py-2.5 text-xs font-medium tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                    >
                      Return to Showcase
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A1A1A6]">
                          Configure Edition
                        </p>
                        <div className="mt-1 flex items-baseline justify-between">
                          <h4 className="text-2xl font-semibold tracking-tight text-white">
                            Hush Studio
                          </h4>
                          <span className="text-lg font-medium text-white">$449</span>
                        </div>
                      </div>

                      {/* Finish Selector */}
                      <div className="space-y-3">
                        <p className="text-xs text-[#A1A1A6]">
                          Finish — <span className="text-white">{activeFinish.name}</span>
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {FINISHES.map((finish) => {
                            const active = finish.id === selectedFinish;
                            return (
                              <button
                                key={finish.id}
                                type="button"
                                onClick={() => setSelectedFinish(finish.id)}
                                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${
                                  active
                                    ? "border-white/40 bg-white/[0.06]"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                                }`}
                              >
                                <span
                                  className="h-5 w-5 shrink-0 rounded-full border border-white/20"
                                  style={{ backgroundColor: finish.swatch }}
                                />
                                <span className="text-xs font-medium text-white">
                                  {finish.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs leading-relaxed text-[#A1A1A6]">
                          {activeFinish.tagline}
                        </p>
                      </div>

                      {/* Spec Summary */}
                      <div className="grid grid-cols-2 gap-2 border-y border-white/[0.06] py-4 text-[11px]">
                        <div>
                          <span className="text-[#A1A1A6]">Drivers</span>
                          <p className="mt-0.5 font-medium text-white">40mm Carbon Composite</p>
                        </div>
                        <div>
                          <span className="text-[#A1A1A6]">Processor</span>
                          <p className="mt-0.5 font-medium text-white">Dual-Core ANC + 12 Mics</p>
                        </div>
                        <div>
                          <span className="text-[#A1A1A6]">Battery</span>
                          <p className="mt-0.5 font-medium text-white">30 Hours (ANC On)</p>
                        </div>
                        <div>
                          <span className="text-[#A1A1A6]">Audio</span>
                          <p className="mt-0.5 font-medium text-white">24-bit Lossless · USB-C</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] text-[#A1A1A6]">Total</p>
                        <p className="text-xl font-semibold tracking-tight text-white">$449.00</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex-1 rounded-full bg-white py-3 text-sm font-medium tracking-tight text-black transition-all duration-300 hover:bg-[#E5E9F0]"
                      >
                        Complete Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
