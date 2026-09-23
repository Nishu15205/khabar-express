"use client";

import type { NewsArticle } from "@/lib/types";

/**
 * ब्रेकिंग न्यूज़ ticker — seamless CSS marquee (pauses on hover).
 * Content is duplicated once; translateX(-50%) creates the infinite loop.
 */
export function BreakingTicker({
  items,
  onSelect,
}: {
  items: NewsArticle[];
  onSelect: (a: NewsArticle) => void;
}) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div
      className="ticker-hover-pause flex items-stretch overflow-hidden border-y border-primary/30 bg-primary text-primary-foreground"
      role="marquee"
      aria-label="ब्रेकिंग न्यूज़"
    >
      <div className="z-10 flex shrink-0 items-center gap-2 bg-black/25 px-3 py-2 text-xs font-bold tracking-wide sm:px-4 sm:text-sm">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        ब्रेकिंग
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-ticker flex w-max items-center gap-10 py-2 pl-10">
          {doubled.map((a, i) => (
            <button
              key={`${a.guid}-${i}`}
              onClick={() => onSelect(a)}
              className="whitespace-nowrap text-xs font-medium underline-offset-4 hover:underline sm:text-sm"
            >
              {a.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
