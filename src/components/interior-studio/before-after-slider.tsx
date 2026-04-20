"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
} from "lucide-react";

interface AppliedChange {
  id: string;
  text: string;
}

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  appliedChanges: AppliedChange[];
  onRedo?: () => void;
  onTryDifferent?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  downloadLabel?: string;
  creditsLeft?: number | null;
  onBuyCredits?: () => void;
  isBuyingCredits?: boolean;
}

// Pre-compute confetti positions to avoid Math.random during render
const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: 10 + ((i * 4.2) % 80),
  top: (i * 7.3) % 100,
  colorIndex: i % 4,
  duration: 1.5 + (i % 3) * 0.3,
  delay: (i % 5) * 0.1,
  rotation: (i * 18) % 360,
}));

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  appliedChanges,
  onRedo,
  onTryDifferent,
  onShare,
  onDownload,
  downloadLabel = "Download",
  creditsLeft = null,
  onBuyCredits,
  isBuyingCredits = false,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [hoveredChange, setHoveredChange] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderPositionRef = useRef(sliderPosition);

  // Keep ref in sync with state
  useEffect(() => {
    sliderPositionRef.current = sliderPosition;
  }, [sliderPosition]);

  // Hide confetti after initial reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-reveal animation on mount
  useEffect(() => {
    const revealAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Animate from 0 to 75
      let pos = 0;
      const animate = () => {
        pos += 2;
        if (pos <= 75) {
          setSliderPosition(pos);
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    revealAnimation();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    },
    [isDragging, updateSliderPosition],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.touches[0].clientX);
    },
    [isDragging, updateSliderPosition],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSliderPosition((prev) => Math.max(0, prev - 5));
      } else if (e.key === "ArrowRight") {
        setSliderPosition((prev) => Math.min(100, prev + 5));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const confettiColors = useMemo(
    () => [
      "#5E7361",
      "#b8965c",
      "#6b705c",
      "#C9A227",
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 md:p-8 text-black">
      <div className="relative z-10 max-w-5xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E7361]">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-800 md:text-3xl">
                Your Redesigned Space
              </h1>
              <p className="text-sm text-neutral-600">
                Drag to compare before & after
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(creditsLeft === null || creditsLeft <= 0) && onBuyCredits && (
              <button
                type="button"
                onClick={onBuyCredits}
                disabled={isBuyingCredits}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {isBuyingCredits ? "Loading..." : "Buy Credits"}
              </button>
            )}
            <div className="flex items-center gap-1 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600">
              <span>Credits:</span>
              <span className="font-semibold">
                {creditsLeft === null ? "-" : creditsLeft > 75 ? "Unlimited" : creditsLeft}
              </span>
            </div>
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                         bg-white border border-red-200
                         text-red-600 text-sm font-semibold
                         hover:bg-red-50 hover:border-red-300
                         transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{downloadLabel}</span>
            </button>
            <button
              type="button"
              onClick={onRedo}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                         bg-white border border-red-200
                         text-red-600 text-sm font-semibold
                         hover:bg-red-50 hover:border-red-300
                         transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>
        </div>

        {/* Main Slider Container */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xl">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {confettiParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-sm"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    backgroundColor: confettiColors[particle.colorIndex],
                    animation: `confetti ${particle.duration}s ease-out forwards`,
                    animationDelay: `${particle.delay}s`,
                    transform: `rotate(${particle.rotation}deg)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Slider Container */}
          <div
            ref={containerRef}
            className="relative h-[52vw] min-h-[280px] max-h-[620px] w-full cursor-ew-resize select-none touch-none bg-[#EAE6E1]"
            style={{ aspectRatio: "16 / 10" }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Before and after comparison slider"
            tabIndex={0}
          >
            {/* Before image */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforeImage}
                alt="Before"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                draggable={false}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              {/* Before Label */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-black text-sm font-medium">
                Before
              </div>
            </div>

            {/* After image: full-size layer masked by slider position */}
            <div
              className="absolute inset-0 z-[1] overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterImage}
                alt="After"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                draggable={false}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              {/* After Label */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-[#FAF9F6]/95 px-3 py-1.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#5E7361]" />
                After
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className={`
                absolute top-0 bottom-0 w-1 bg-white
                transform -translate-x-1/2 z-10
                transition-shadow duration-200
                ${isDragging ? "shadow-[0_0_30px_rgba(255,255,255,0.5)]" : "shadow-lg"}
              `}
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle Button */}
              <div
                className={`
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-12 h-12 rounded-full bg-white shadow-xl
                  flex items-center justify-center gap-0.5
                  transition-all duration-200
                  ${isDragging ? "scale-110" : "hover:scale-105"}
                `}
              >
                <ChevronLeft className="w-4 h-4 text-gray-900" />
                <ChevronRight className="w-4 h-4 text-gray-900" />
              </div>

              {/* Percentage indicator */}
              <div
                className={`
                  absolute -bottom-10 left-1/2 -translate-x-1/2
                  px-3 py-1 rounded-full bg-gray-900 text-black text-xs font-medium
                  transition-opacity duration-200
                  ${isDragging ? "opacity-100" : "opacity-0"}
                `}
              >
                {Math.round(sliderPosition)}%
              </div>
            </div>

            {/* Drag instruction (fades after interaction) */}
            <div
              className={`
                absolute bottom-4 left-1/2 -translate-x-1/2
                flex items-center gap-2 px-4 py-2 rounded-full
                bg-black/40 backdrop-blur-sm text-black text-sm
                transition-opacity duration-500
                ${isDragging ? "opacity-0" : "opacity-100"}
              `}
            >
              <ChevronLeft className="w-4 h-4 animate-pulse" />
              <span>Drag to compare</span>
              <ChevronRight className="w-4 h-4 animate-pulse" />
            </div>
          </div>

        </div>

        {/* Applied Changes Panel */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FAF9F6] shadow-sm">
          <div className="border-b border-stone-200/80 bg-[#FAF9F6] px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Check className="h-5 w-5 text-[#5E7361]" strokeWidth={2.5} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Applied Changes
              </h3>
              <span className="rounded-full bg-[#E3E8DE] px-2.5 py-0.5 text-xs font-semibold text-[#5E7361]">
                {appliedChanges.length} improvements
              </span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] px-4 py-4 sm:px-5 sm:py-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {appliedChanges.map((change, index) => (
                <article
                  key={change.id}
                  className={`
                    flex items-start gap-3 rounded-2xl border border-stone-200/60 p-4
                    transition-all duration-200
                    ${
                      hoveredChange === change.id
                        ? "bg-[#E0DBD4] shadow-sm"
                        : "bg-[#EAE6E1] hover:bg-[#E3DED7]"
                    }
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  onMouseEnter={() => setHoveredChange(change.id)}
                  onMouseLeave={() => setHoveredChange(null)}
                >
                  <div
                    className={`
                      flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-300/70
                      transition-colors duration-200
                      ${
                        hoveredChange === change.id
                          ? "bg-[#DEDAD4] text-[#4A4A4A]"
                          : "bg-[#DEDAD4] text-[#7B7B7B]"
                      }
                    `}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {change.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
