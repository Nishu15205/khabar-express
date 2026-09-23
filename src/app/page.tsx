import { NewsPortal } from "@/components/news/news-portal";
import { QueryProvider } from "@/components/query-provider";
import { getInitialData } from "@/lib/news-service";

// ISR: regenerate the homepage at most every 5 minutes.
// Combined with the feed refresher, news stays fresh with zero manual work.
export const revalidate = 300;

export default async function Home() {
  const { top, trending } = await getInitialData();

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
