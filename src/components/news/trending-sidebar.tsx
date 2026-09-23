"use client";

import { Flame, TrendingUp } from "lucide-react";
import { timeAgoHi } from "@/lib/time";
import type { NewsArticle } from "@/lib/types";

export function TrendingSidebar({
  articles,
  onSelect,
}: {
  articles: NewsArticle[];
  onSelect: (a: NewsArticle) => void;
}) {
  const list = articles.slice(0, 8);
  if (!list.length) return null;

  return (
    <section
      aria-label="ट्रेंडिंग खबरें"
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
        <Flame className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="font-headline text-sm font-bold tracking-wide">
          ट्रेंडिंग खबरें
        </h2>
        <TrendingUp className="ml-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      </div>
      <ol className="divide-y">
        {list.map((a, i) => (
          <li key={a.guid}>
            <button
              onClick={() => onSelect(a)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
            >
              <span className="w-6 shrink-0 font-headline text-xl font-black leading-none text-primary/70">
                {i + 1}
              </span>
              <span className="min-w-0 space-y-1">
                <span className="line-clamp-2 block text-sm font-medium leading-snug transition-colors hover:text-primary">
                  {a.title}
                </span>
                <span className="block text-[11px] text-muted-foreground" suppressHydrationWarning>
                  {a.source} · {timeAgoHi(a.publishedAt)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
