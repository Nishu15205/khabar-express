"use client";

import { Sparkles, Clock, ArrowRight } from "lucide-react";
import type { OriginalArticle } from "@/lib/original-articles";

/**
 * "खबर एक्सप्रेस ओरिजिनल" — site के मौलिक लेखों का सेक्शन।
 * यह original content AdSense review के लिए अहम है — हर card
 * /?article=<slug> पूरे पृष्ठ पर ले जाता है।
 */
export function ExclusiveSection({
  articles,
}: {
  articles: OriginalArticle[];
}) {
  if (!articles.length) return null;

  return (
    <section
      aria-labelledby="exclusive-heading"
      className="rounded-xl border bg-card/60 p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          id="exclusive-heading"
          className="flex items-center gap-1.5 text-base font-bold tracking-wide text-foreground sm:text-lg"
        >
          <Sparkles
            className="h-4 w-4 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          खबर एक्सप्रेस ओरिजिनल
          <span className="sr-only">— हमारी टीम के लिखे मौलिक लेख</span>
        </h2>
        <span className="hidden rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 sm:inline-block">
          मौलिक लेख
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <a
            key={a.slug}
            href={`/?article=${a.slug}`}
            className="group flex flex-col rounded-xl border bg-background p-4 transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="mb-2 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {a.categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {a.readTime}
              </span>
            </div>
            <h3 className="mb-2 line-clamp-3 font-headline text-[15px] font-bold leading-snug transition-colors group-hover:text-primary">
              {a.title}
            </h3>
            <p className="mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {a.excerpt}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              पूरा लेख पढ़ें
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
