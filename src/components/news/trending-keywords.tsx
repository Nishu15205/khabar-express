"use client";

import { Flame, TrendingUp } from "lucide-react";

interface TrendingKeywordsProps {
  keywords: string[];
  onSelect: (keyword: string) => void;
}

/**
 * "आज के ट्रेंडिंग टॉपिक" — daily news से निकले auto SEO keywords।
 *
 * - Real <a href="/?q=…"> links: crawlers को keyword-rich anchor text मिलता
 *   है (SearchAction deep links), users को click पर header search खुलता है।
 * - हर 5 मिनट (ISR) में fresh topics — page हमेशा "जीता-जागता" लगता है।
 */
export function TrendingKeywords({ keywords, onSelect }: TrendingKeywordsProps) {
  if (!keywords.length) return null;

  return (
    <section
      aria-labelledby="trending-topics-heading"
      className="rounded-xl border bg-card/60 p-4"
    >
      <h2
        id="trending-topics-heading"
        className="mb-3 flex items-center gap-1.5 text-sm font-bold tracking-wide text-foreground"
      >
        <Flame
          className="h-4 w-4 text-orange-600 dark:text-orange-400"
          aria-hidden="true"
        />
        आज के ट्रेंडिंग टॉपिक
        <span className="sr-only">— आज की खबरों से चुने गए लोकप्रिय विषय</span>
      </h2>
      <ul className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <li key={kw}>
            <a
              href={`/?q=${encodeURIComponent(kw)}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(kw);
              }}
              className="inline-flex max-w-full items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              title={`${kw} की ताज़ा खबरें खोजें`}
            >
              <TrendingUp
                className="h-3 w-3 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">{kw}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
