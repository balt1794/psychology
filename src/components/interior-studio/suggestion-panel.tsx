"use client";

import { useState } from "react";
import { Plus, Lightbulb, Check, Loader2 } from "lucide-react";
import SuggestionCard, { type Suggestion } from "./suggestion-card";

interface SuggestionPanelProps {
  suggestions: Suggestion[];
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onAdd: (text: string, zone?: string) => void;
  onHoverZone?: (zone: string | null) => void;
  onGenerate: () => void;
  onBuyCredits?: () => void;
  isGenerating?: boolean;
  isLoading?: boolean;
  isOutOfCredits?: boolean;
  isBuyingCredits?: boolean;
}

const quickChips = ["Better lighting", "Add plants", "Modern furniture", "Add artwork", "Declutter"];

export default function SuggestionPanel({
  suggestions,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onHoverZone,
  onGenerate,
  onBuyCredits,
  isGenerating = false,
  isLoading = false,
  isOutOfCredits = false,
  isBuyingCredits = false,
}: SuggestionPanelProps) {
  const [newSuggestion, setNewSuggestion] = useState("");

  const selectedCount = suggestions.filter((s) => s.selected).length;
  const isMainButtonDisabled = isOutOfCredits
    ? isBuyingCredits
    : selectedCount === 0 || isGenerating;
  /** Red (brand) styling whenever the CTA is meaningful: buy credits, or user has selections (including while generating). */
  const isMainButtonPrimary =
    (isOutOfCredits && !isBuyingCredits) || selectedCount > 0;

  const handleAddSuggestion = () => {
    if (newSuggestion.trim()) {
      onAdd(newSuggestion.trim());
      setNewSuggestion("");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FAF9F6] text-black shadow-sm">
      <div className="border-b border-stone-200/80 bg-[#FAF9F6] p-5">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-[#5E7361]" strokeWidth={2.5} />
            <h2 className="text-lg font-semibold text-black">AI Suggestions</h2>
          </div>

        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[#FAF9F6] p-4">
        {isLoading ? (
          <p className="text-sm text-black">Analyzing your space...</p>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb className="mb-2 h-8 w-8 text-neutral-500" />
            <p className="text-black">No suggestions yet</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onHoverZone={onHoverZone}
            />
          ))
        )}
      </div>

      <div className="border-t border-stone-200/80 bg-[#FAF9F6] p-4">
        <div className="flex items-center gap-2 rounded-2xl border border-stone-300/70 bg-[#FAF9F6] p-2">
          <Plus className="w-4 h-4 text-black" />
          <input
            type="text"
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSuggestion()}
            placeholder="Add your own idea..."
            className="flex-1 border-none bg-transparent text-sm text-black outline-none placeholder:text-gray-500"
          />
          {newSuggestion && (
            <button
              type="button"
              onClick={handleAddSuggestion}
              className="rounded-lg border border-red-500 bg-[#FF385C] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-red-50 hover:border-red-600"
            >
              Add
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickChips.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => onAdd(chip)}
              className="rounded-full border border-stone-300/70 bg-[#EAE6E1] px-3 py-1.5 text-xs text-black transition-all duration-200 hover:bg-[#E3DED7] hover:border-stone-400/80 hover:shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200/80 bg-[#EAE6E1] p-4">
        <div className="mb-3 flex items-center justify-between text-sm text-black">
          <span>Selected: <span className="font-medium text-black">{selectedCount}</span> of {suggestions.length}</span>
        </div>
        <button
          type="button"
          onClick={isOutOfCredits ? onBuyCredits : onGenerate}
          disabled={isMainButtonDisabled}
          aria-busy={isOutOfCredits ? isBuyingCredits : isGenerating}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 font-semibold transition-all duration-200 ${
            isMainButtonPrimary
              ? "hover:opacity-95 hover:shadow-md"
              : "cursor-not-allowed"
          }`}
          style={{
            backgroundColor: isMainButtonPrimary ? "#FF385C" : "#DEDAD4",
            borderColor: isMainButtonPrimary ? "#d72d55" : "#cfc8be",
            color: isMainButtonPrimary ? "#ffffff" : "#374151",
          }}
        >
          {isOutOfCredits && isBuyingCredits ? (
            <Loader2
              className={`h-5 w-5 shrink-0 animate-spin ${isMainButtonPrimary ? "text-white" : "text-neutral-700"}`}
            />
          ) : !isOutOfCredits && isGenerating ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white" />
          ) : (
            <Check
              className={`h-5 w-5 shrink-0 ${isMainButtonPrimary ? "text-white" : "text-neutral-700"}`}
              strokeWidth={2.5}
            />
          )}
          <span className={isMainButtonPrimary ? "text-white" : "text-neutral-700"}>
            {isOutOfCredits
              ? isBuyingCredits
                ? "Loading..."
                : "Buy Credits"
              : isGenerating
                ? "Working on your redesign..."
                : "Generate Improvements"}
          </span>
        </button>
      </div>
    </div>
  );
}
