"use client";

import type { ReactNode } from "react";

type ToolPageShellProps = {
  titleBefore: string;
  titleAccent: string;
  subtitle: ReactNode;
  intro?: ReactNode;
  /** split: form + output row on large screens; stack: single column (e.g. tools index) */
  mainVariant?: "split" | "stack";
  children: ReactNode;
};

export function ToolPageShell({
  titleBefore,
  titleAccent,
  subtitle,
  intro,
  mainVariant = "split",
  children,
}: ToolPageShellProps) {
  const mainInner =
    mainVariant === "split"
      ? "mx-auto flex max-w-8xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-8"
      : "mx-auto max-w-6xl px-4 sm:px-6";

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-8 text-center sm:px-6 mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-6xl">
          {titleBefore}{" "}
          <span className="text-[#FF385C]">{titleAccent}</span>
        </h1>
        <h2 className="mx-auto mt-4 max-w-5xl text-base text-black sm:text-lg mb-4">
          {subtitle}
        </h2>
      </div>

      {intro ? (
        <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/90 p-5 text-left text-sm leading-relaxed text-gray-800 sm:p-6 sm:text-base">
            {intro}
          </div>
        </div>
      ) : null}

      <div className="border-t border-gray-200/80 bg-[#f6f6f7] pb-16 pt-8" id="generator">
        <div className={mainInner}>{children}</div>
      </div>
    </>
  );
}
