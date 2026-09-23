"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/news/news-card";
import { NewsGridSkeleton } from "@/components/news/skeletons";
import { AdSlot } from "@/components/ads/ad-slot";
import { CATEGORIES, categoryLabel } from "@/lib/feeds";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

const PAGE_SIZE = 12;

interface CategorySectionProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  onSelectArticle: (a: NewsArticle) => void;
  initialTop: NewsArticle[];
}

/**
 * Tabbed news feed with infinite pagination ("और खबरें").
 * Uses the same query key as the API contract: ["news", category].
 */
export function CategorySection({
  activeCategory,
  onCategoryChange,
  onSelectArticle,
  initialTop,
}: CategorySectionProps) {
  const query = useInfiniteQuery({
    queryKey: ["news", activeCategory],
    queryFn: async ({ pageParam }): Promise<NewsArticle[]> => {
      const res = await fetch(
        `/api/news?category=${encodeURIComponent(activeCategory)}&limit=${PAGE_SIZE}&offset=${pageParam}`
      );
      const json = (await res.json()) as { ok: boolean; articles: NewsArticle[] };
      if (!json.ok) throw new Error(json.error ?? "खबरें लोड नहीं हो पाईं");
      return json.articles ?? [];
    },
    initialPageParam: 0,
    getNextPageParam: (last, allPages) =>
      last.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
    initialData:
      activeCategory === "top"
        ? { pages: [initialTop], pageParams: [0] }
        : undefined,
    refetchInterval: activeCategory === "top" ? 5 * 60 * 1000 : false,
  });

  const articles = useMemo(
    () => query.data?.pages.flat() ?? [],
    [query.data]
  );

  return (
    <section id="khabrein" aria-label="खबरें" className="scroll-mt-32 space-y-5">
      {/* Heading + tabs */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2.5 font-headline text-xl font-black tracking-tight sm:text-2xl">
          <span className="h-6 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {categoryLabel(activeCategory)}
        </h2>
        <div
          role="tablist"
          aria-label="श्रेणी चुनें"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
        >
          {CATEGORIES.map((c) => {
            const active = c.slug === activeCategory;
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={active}
                onClick={() => onCategoryChange(c.slug)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground/75 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed */}
      {query.isLoading ? (
        <NewsGridSkeleton count={6} />
      ) : query.isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive/70" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            खबरें लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> पुनः प्रयास
          </Button>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-dashed py-14 text-center text-sm text-muted-foreground">
          इस समय इस श्रेणी में कोई खबर उपलब्ध नहीं है। कुछ ही मिनट में नई खबरें आ जाएँगी।
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((a, i) => (
              <div key={a.guid} className="contents">
                <NewsCard article={a} onSelect={onSelectArticle} />
                {/* In-feed ad after the 6th and 18th card */}
                {(i === 5 || i === 17) && (
                  <AdSlot
                    minHeight={110}
                    className="sm:col-span-2 xl:col-span-3"
                    label="फ़ीड विज्ञापन"
                  />
                )}
              </div>
            ))}
          </div>

          {query.hasNextPage && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="lg"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
                className="gap-2 rounded-full px-8"
              >
                {query.isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> लोड हो रहा है…
                  </>
                ) : (
                  "और खबरें देखें"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
