"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Sparkles, Palette, Lamp, Sofa, Flower2 } from "lucide-react";

interface ProcessingViewProps {
  imageUrl: string;
  suggestions: string[];
  onComplete: () => void;
  isComplete?: boolean;
}

const processingSteps = [
  { id: "analyze", icon: Sparkles, text: "Analyzing selected improvements..." },
  { id: "color", icon: Palette, text: "Adjusting color palette..." },
  { id: "lighting", icon: Lamp, text: "Optimizing lighting..." },
  { id: "furniture", icon: Sofa, text: "Rendering furniture changes..." },
  { id: "decor", icon: Flower2, text: "Applying decoration updates..." },
];

const floatingParticles = [
  { id: "p1", left: 15, top: 20 },
  { id: "p2", left: 30, top: 45 },
  { id: "p3", left: 45, top: 70 },
  { id: "p4", left: 60, top: 35 },
  { id: "p5", left: 75, top: 60 },
  { id: "p6", left: 90, top: 25 },
];

export default function ProcessingView({
  imageUrl,
  suggestions,
  onComplete,
  isComplete = false,
}: ProcessingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  useEffect(() => {
    if (isComplete) return;
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % processingSteps.length);
    }, 2000);
    return () => clearInterval(stepInterval);
  }, [isComplete]);

  useEffect(() => {
    if (suggestions.length === 0) return;
    const suggestionInterval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 1500);
    return () => clearInterval(suggestionInterval);
  }, [suggestions.length]);

  useEffect(() => {
    if (isComplete) return;
    const scanInterval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(scanInterval);
  }, [isComplete]);

  const CurrentIcon = processingSteps[currentStep]?.icon || Sparkles;

  const suggestionsWithKeys = useMemo(
    () =>
      suggestions.map((text, index) => ({
        id: `suggestion-${index}-${text.slice(0, 20)}`,
        text,
        index,
      })),
    [suggestions],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] p-6 text-black">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-[#FAF9F6] shadow-lg">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE6E1]">
            <Image src={imageUrl} alt="Processing room" fill className="object-cover" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

            {!isComplete && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5E7361] to-transparent opacity-80"
                  style={{
                    top: `${scanPosition}%`,
                    boxShadow: "0 0 20px 8px rgba(94, 115, 97, 0.35)",
                    transition: "top 0.03s linear",
                  }}
                />
              </div>
            )}

            <div className="absolute inset-4">
              <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-[#5E7361]/70 animate-pulse-subtle" />
              <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-[#5E7361]/70 animate-pulse-subtle" style={{ animationDelay: "200ms" }} />
              <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-[#5E7361]/70 animate-pulse-subtle" style={{ animationDelay: "400ms" }} />
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-[#5E7361]/70 animate-pulse-subtle" style={{ animationDelay: "600ms" }} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {floatingParticles.map((particle, i) => (
                <div
                  key={particle.id}
                  className="absolute h-1 w-1 rounded-full bg-[#5E7361]/60 animate-float opacity-60"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    animationDelay: `${i * 300}ms`,
                    animationDuration: `${2 + (i % 2)}s`,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -m-2 h-24 w-24 animate-ping rounded-full border-2 border-[#5E7361]/25" />
                <div
                  className="absolute inset-0 h-20 w-20 rounded-full border border-[#5E7361]/40"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-stone-200/80 bg-[#FAF9F6]/90 shadow-xl backdrop-blur-sm">
                  <CurrentIcon className="h-8 w-8 animate-pulse-subtle text-[#5E7361]" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200/80 bg-[#FAF9F6] p-6">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-semibold text-neutral-800">
                {isComplete
                  ? "Improvements complete!"
                  : "Applying your improvements..."}
              </h2>
              <p className="h-5 text-sm text-neutral-700 transition-all duration-300">
                {isComplete
                  ? "Your redesigned space is ready"
                  : suggestions.length > 0
                    ? `"${suggestions[currentSuggestion]}"`
                    : processingSteps[currentStep]?.text}
              </p>
            </div>

            <div className="relative">
              <div className="progress-bar h-2 overflow-hidden">
                {isComplete ? (
                  <div
                    className="progress-fill transition-all duration-500"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-100">
                    <div
                      className="h-full bg-gradient-to-r from-transparent via-[#5E7361] to-transparent"
                      style={{
                        animation: "indeterminate 1.5s ease-in-out infinite",
                        width: "40%",
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-neutral-500">
                <span>Processing</span>
                <span className="font-semibold text-[#5E7361]">
                  {isComplete ? "Done!" : "Working..."}
                </span>
                <span>Complete</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {processingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCurrent = index === currentStep && !isComplete;
                const isAllComplete = isComplete;
                return (
                  <div
                    key={step.id}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all duration-300
                      ${
                        isAllComplete
                          ? "bg-[#E3E8DE] text-[#5E7361]"
                          : isCurrent
                            ? "scale-110 bg-[#5E7361] text-white shadow-md"
                            : "bg-[#EAE6E1] text-neutral-500"
                      }
                    `}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                );
              })}
            </div>

            {suggestions.length > 0 && (
              <div className="mt-6 animate-fade-in rounded-2xl border border-stone-200/80 bg-[#EAE6E1] p-4">
                <p className="mb-2 text-xs font-semibold text-neutral-600">
                  {isComplete ? "Applied changes:" : "Changes being applied:"}
                </p>
                <div className="space-y-2">
                  {suggestionsWithKeys.map((suggestion) => {
                    const isApplying =
                      suggestion.index === currentSuggestion && !isComplete;
                    return (
                      <div
                        key={suggestion.id}
                        className={`
                          flex items-center gap-2 text-sm
                          transition-all duration-300
                          ${
                            isComplete
                              ? "font-medium text-[#5E7361]"
                              : isApplying
                                ? "font-semibold text-neutral-800"
                                : "text-neutral-500"
                          }
                        `}
                      >
                        <span
                          className={`
                          flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold
                          ${
                            isComplete
                              ? "border border-[#5E7361]/40 bg-[#DEDAD4] text-[#4A4A4A]"
                              : isApplying
                                ? "animate-pulse border border-[#5E7361]/50 bg-[#5E7361] text-white"
                                : "border border-stone-300/70 bg-[#DEDAD4] text-neutral-600"
                          }
                        `}
                        >
                          {isComplete ? "✓" : suggestion.index + 1}
                        </span>
                        <span className="truncate">{suggestion.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 animate-pulse-subtle text-center text-sm text-neutral-500">
          {isComplete
            ? "Preparing your reveal..."
            : "This may take a moment... creating something beautiful ✨"}
        </p>
      </div>

      <style jsx>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(350%);
          }
        }
      `}</style>
    </div>
  );
}
