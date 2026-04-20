"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  highlightedZone: string | null;
}

export default function ImagePreview({
  imageUrl,
  highlightedZone,
}: ImagePreviewProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FAF9F6] shadow-sm text-black">
      <div className="flex items-center justify-between border-b border-stone-200/80 bg-[#FAF9F6] p-3">
        <span className="text-sm font-semibold text-neutral-800">
          Room Preview
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-[#E3E8DE] hover:text-[#5E7361] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="min-w-[3rem] px-2 text-center text-xs font-semibold text-neutral-600">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 2}
            className="rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-[#E3E8DE] hover:text-[#5E7361] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="mx-1 h-5 w-px bg-stone-200/80" />
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-[#E3E8DE] hover:text-[#5E7361]"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-[#EAE6E1]">
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt="Room preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {highlightedZone && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
                <div className="animate-fade-in absolute left-1/2 top-4 max-w-[min(520px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-stone-200/80 bg-[#FAF9F6]/95 px-4 py-2 text-center text-sm font-semibold text-neutral-800 shadow-lg backdrop-blur-sm">
                  {highlightedZone}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
