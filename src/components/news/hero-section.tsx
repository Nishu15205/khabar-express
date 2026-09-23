"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CompactCard, CategoryChip, SourceMeta } from "@/components/news/news-card";
import { categoryImage, categoryLabel } from "@/lib/feeds";
import type { NewsArticle } from "@/lib/types";

/**
 * Hero: featured story (2/3) + top side stories (1/3).
 * Images are copyright-safe AI-generated category artwork.
 */
export function HeroSection({
  articles,
  onSelect,
}: {
  articles: NewsArticle[];
  onSelect: (a: NewsArticle) => void;
}) {
  if (!articles.length) return null;
  const [featured, ...rest] = articles;
  const side = rest.slice(0, 5);

  return (
    <section aria-label="मुख्य खबरें" className="grid gap-5 lg:grid-cols-3">
      <article
        onClick={() => onSelect(featured)}
        className="group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring lg:col-span-2"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={categoryImage(featured.category)}
            alt={`${categoryLabel(featured.category)} — मुख्य खबर`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3">
            <CategoryChip category={featured.category} />
          </div>
        </div>
        <div className="space-y-2 p-4 sm:p-5">
          {/* Page-level h1 — the top featured headline carries the primary
              keywords (ताज़ा खबर / ब्रेकिंग न्यूज़) for search engines. */}
          <h1 className="font-headline text-xl font-bold leading-snug transition-colors group-hover:text-primary sm:text-2xl">
            {featured.title}
          </h1>
          {featured.description && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:text-[15px]">
              {featured.description}
            </p>
          )}
          <SourceMeta article={featured} className="pt-1" />
        </div>
      </article>

      <div className="flex flex-col rounded-xl border bg-card p-2 shadow-sm sm:flex-row sm:flex-wrap lg:flex-col lg:flex-nowrap">
        <div className="flex items-center justify-between px-2 pb-1 pt-2">
          <h2 className="font-headline text-sm font-bold tracking-wide">
            बड़ी खबरें
          </h2>
          <Badge variant="secondary" className="text-[10px]">
            ताज़ा
          </Badge>
        </div>
        <div className="flex flex-1 flex-col divide-y sm:w-1/2 lg:w-auto">
          {side.slice(0, Math.ceil(side.length / 2)).map((a) => (
            <CompactCard key={a.guid} article={a} onSelect={onSelect} showImage={false} />
          ))}
        </div>
        <div className="flex flex-1 flex-col divide-y sm:w-1/2 lg:w-auto">
          {side.slice(Math.ceil(side.length / 2)).map((a) => (
            <CompactCard key={a.guid} article={a} onSelect={onSelect} showImage={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
