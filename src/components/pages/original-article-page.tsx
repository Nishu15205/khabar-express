import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { PageShell } from "@/components/pages/page-shell";
import type { OriginalArticle } from "@/lib/original-articles";

const DATE_FMT = new Intl.DateTimeFormat("hi-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * ORIGINAL लेख का पूरा पृष्ठ — server-rendered, NewsArticle JSON-LD सहित।
 */
export function OriginalArticlePage({
  article,
  siteUrl,
}: {
  article: OriginalArticle;
  siteUrl: string;
}) {
  const url = `${siteUrl}/?article=${article.slug}`;
  const published = new Date(article.publishedAt);

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    inLanguage: "hi-IN",
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "खबर एक्सप्रेस टीम",
      url: siteUrl,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "खबर एक्सप्रेस",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: article.categoryLabel,
    keywords: article.tags.join(", "),
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <PageShell
        title={article.title}
        subtitle={article.excerpt}
        updated={DATE_FMT.format(published)}
      >
        {/* byline */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border bg-background px-4 py-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            खबर एक्सप्रेस टीम
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {DATE_FMT.format(published)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readTime} पढ़ाई
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
            {article.categoryLabel}
          </span>
        </div>

        {/* लेख का मुख्य भाग */}
        {article.sections.map((sec, i) => (
          <section key={i} className="space-y-3">
            {sec.heading ? (
              <h2 className="font-headline text-lg font-bold sm:text-xl">
                {sec.heading}
              </h2>
            ) : null}
            {sec.paragraphs.map((p, j) => (
              <p key={j} className="text-[16px] leading-8 text-foreground/90">
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* टैग */}
        <div className="flex flex-wrap items-center gap-2 border-t pt-5">
          <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {article.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
            >
              #{t}
            </span>
          ))}
        </div>

        <p className="rounded-xl border border-dashed bg-background p-4 text-xs leading-relaxed text-muted-foreground">
          यह लेख खबर एक्सप्रेस टीम द्वारा लिखा गया मौलिक (original) पीस है —
          इसे बिना अनुमति और बिना स्रोत के कॉपी नहीं किया जा सकता। अधिक
          समझाऊ लेखों के लिए{" "}
          <a className="text-primary underline underline-offset-2" href="/">
            होमपेज
          </a>{" "}
          पर बने रहें।
        </p>
      </PageShell>
    </>
  );
}
