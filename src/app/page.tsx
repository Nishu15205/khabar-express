import { NewsPortal } from "@/components/news/news-portal";
import { QueryProvider } from "@/components/query-provider";
import { getInitialData } from "@/lib/news-service";
import type { NewsArticle } from "@/lib/types";

// ISR: regenerate the homepage at most every 5 minutes.
// Combined with the feed refresher, news stays fresh with zero manual work.
export const revalidate = 300;

const EMPTY_DATA: { top: NewsArticle[]; trending: NewsArticle[] } = {
  top: [],
  trending: [],
};

export default async function Home() {
  // Never let a cold/missing database crash the page (e.g. fresh serverless
  // deploy) — the UI refetches client-side while the DB self-heals + reseeds.
  const { top, trending } = await getInitialData().catch((e) => {
    console.error("[home] initial data failed, rendering empty shell", e);
    return EMPTY_DATA;
  });

  // JSON-LD ItemList — helps Google understand the latest headlines.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: top.slice(0, 10).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: a.link,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <QueryProvider>
        <NewsPortal initialTop={top} initialTrending={trending} />
      </QueryProvider>
    </>
  );
}
