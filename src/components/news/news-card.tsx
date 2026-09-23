"use client";

import Image from "next/image";
import { Clock, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timeAgoHi } from "@/lib/time";
import { categoryLabel } from "@/lib/feeds";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

function CategoryChip({ category }: { category: string }) {
  return (
    <Badge className="border-0 bg-primary text-[10px] font-semibold text-primary-foreground hover:bg-primary">
      {categoryLabel(category)}
    </Badge>
  );
}

function SourceMeta({ article, className }: { article: NewsArticle; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground", className)}>
      <span className="font-medium text-foreground/70">{article.source}</span>
      <span className="flex items-center gap-1" suppressHydrationWarning>
        <Clock className="h-3 w-3" aria-hidden="true" />
        {timeAgoHi(article.publishedAt)}
      </span>
    </div>
  );
}

export function FallbackThumb({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5">
      <Newspaper className="h-10 w-10 text-primary/25" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </div>
  );
}

/* ------------------------------ Grid card ------------------------------ */

export function NewsCard({
  article,
  onSelect,
}: {
  article: NewsArticle;
  onSelect: (a: NewsArticle) => void;
}) {
  return (
    <article
      onClick={() => onSelect(article)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <FallbackThumb title={article.title} />
        )}
        <div className="absolute left-2.5 top-2.5">
          <CategoryChip category={article.category} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-headline text-[15px] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {article.description}
          </p>
        )}
        <SourceMeta article={article} className="mt-auto pt-1" />
      </div>
    </article>
  );
}

/* --------------------------- Compact card ------------------------------ */

export function CompactCard({
  article,
  onSelect,
  showImage = true,
}: {
  article: NewsArticle;
  onSelect: (a: NewsArticle) => void;
  showImage?: boolean;
}) {
  return (
    <article
      onClick={() => onSelect(article)}
      className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60 focus-within:bg-muted/60"
    >
      {showImage && (
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <FallbackThumb title={article.title} />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-headline text-sm font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <SourceMeta article={article} />
      </div>
    </article>
  );
}

export { CategoryChip, SourceMeta };
