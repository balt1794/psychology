"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Pencil, Trash2, GripVertical, X } from "lucide-react";

export interface Suggestion {
  id: string;
  text: string;
  selected: boolean;
  zone?: string;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onHoverZone?: (zone: string | null) => void;
}

export default function SuggestionCard({
  suggestion,
  index,
  onToggle,
  onEdit,
  onDelete,
  onHoverZone,
}: SuggestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(suggestion.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(suggestion.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(suggestion.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(suggestion.id);
    }, 300);
  };

  return (
    <article
      className={`
        group relative
        animate-slide-in-right
        transition-all duration-300 ease-out
        ${isDeleting ? "opacity-0 scale-95 -translate-x-4" : "opacity-100 scale-100"}
      `}
      style={{
        animationDelay: `${index * 75}ms`,
        animationFillMode: "backwards",
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (suggestion.zone) onHoverZone?.(suggestion.zone);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverZone?.(null);
      }}
    >
      <div
          className={`
          relative flex items-start gap-3 p-4 rounded-2xl
          border transition-all duration-200
          ${
            suggestion.selected
              ? "border-[#5E7361]/40 bg-[#EAE6E1] shadow-sm"
              : "border-stone-200/70 bg-[#EAE6E1] hover:bg-[#E3DED7] hover:border-stone-300/80"
          }
          ${isHovered ? "shadow-md" : ""}
        `}
      >
        <div
          className={`
            shrink-0 pt-0.5 cursor-grab active:cursor-grabbing
            text-black opacity-100
            transition-opacity duration-200
          `}
          aria-hidden="true"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <button
          type="button"
          onClick={() => onToggle(suggestion.id)}
          aria-pressed={suggestion.selected}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
            suggestion.selected
              ? "border-[#5E7361]/60 bg-[#DEDAD4] text-[#4A4A4A]"
              : "border-stone-300/70 bg-[#FAF9F6]"
          }`}
        >
          {suggestion.selected ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input min-w-0 flex-1 py-2 text-sm !text-black"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 text-black transition-all duration-200 hover:bg-gray-300 hover:shadow-sm"
                aria-label="Save edit"
              >
                <Check className="h-4 w-4 text-black" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 text-black transition-all duration-200 hover:bg-gray-300 hover:shadow-sm"
                aria-label="Cancel edit"
              >
                <X className="h-4 w-4 text-black" />
              </button>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-black">
              {suggestion.text}
            </p>
          )}

          {suggestion.zone && !isEditing && (
            <span
                className={`
                inline-block mt-2 px-2 py-0.5 text-xs rounded-full
                transition-colors duration-200
                ${
                  isHovered
                    ? "bg-[#E3E8DE] text-[#5E7361]"
                    : "bg-[#FAF9F6] text-black border border-stone-200/70"
                }
              `}
            >
              {suggestion.zone}
            </span>
          )}
        </div>

        {!isEditing && (
          <div
            className={`
              flex items-center gap-1 shrink-0 pl-2
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200
            `}
          >
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-2 text-black transition-all duration-200 hover:bg-[#E3E8DE] hover:text-[#5E7361] hover:shadow-sm"
              aria-label="Edit suggestion"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg p-2 text-black transition-all duration-200 hover:bg-[#F1E3E3] hover:text-red-800 hover:shadow-sm"
              aria-label="Delete suggestion"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          className={`
            absolute left-0 top-3 bottom-3 w-1 rounded-r-full
            transition-all duration-300
            ${suggestion.selected ? "bg-[#5E7361]" : "bg-transparent"}
          `}
        />
      </div>
    </article>
  );
}
