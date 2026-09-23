import type { Metadata } from "next";
import { NewsPortal } from "@/components/news/news-portal";
import { QueryProvider } from "@/components/query-provider";
import { getInitialData } from "@/lib/news-service";
import { BASE_KEYWORDS, getDailyKeywords } from "@/lib/seo-keywords";
import type { NewsArticle } from "@/lib/types";

// ISR: regenerate the homepage at most every 5 minutes.
// Combined with the feed refresher, news stays fresh with zero manual work.
export const revalidate = 300;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const EMPTY_DATA: { top: NewsArticle[]; trending: NewsArticle[] } = {
  top: [],
  trending: [],
};

/**
 * डायनामिक SEO metadata — हर 5 मिनट में आज की trending खबरों के
 * असली keywords इस page के <head> में inject हो जाते हैं।
 * जैसे-जैसे न्यूज़ बदलेगी, Google को नए topical signals मिलते रहेंगे।
 */
export async function generateMetadata(): Promise<Metadata> {
  const daily = await getDailyKeywords(20);
  const hot = daily.slice(0, 4);

  const baseTitle =
    "खबर एक्सप्रेस — देश, दुनिया, खेल, बिज़नेस की ताज़ा हिंदी खबरें";
  const baseDescription =
    "खबर एक्सप्रेस — देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें। ब्रेकिंग न्यूज़, आज की बड़ी खबरें और लाइव अपडेट सबसे पहले, हर पल अपडेट।";

  const title = hot.length
    ? `आज की ताज़ा खबरें: ${hot.slice(0, 3).join(", ")} | खबर एक्सप्रेस`
    : baseTitle;
  const description = hot.length
    ? `${baseDescription.slice(0, -1)} इस समय चर्चा में: ${hot.join(", ")}।`
    : baseDescription;

  return {
    title, // absolute — layout के default को override करता है
    description,
    keywords: [...BASE_KEYWORDS, ...daily],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "hi_IN",
      url: siteUrl,
      siteName: "खबर एक्सप्रेस",
      title,
      description,
      images: [
        {
          url: "/og-banner.png",
          width: 1200,
          height: 630,
          alt: "खबर एक्सप्रेस — ताज़ा हिंदी खबरें",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-banner.png"],
    },
    other: {
      // Google News topical signal — रोज़ अपने-आप बदलता है
      news_keywords: daily.join(", "),
    },
  };
}

export default async function Home() {
  // Never let a cold/missing database crash the page (e.g. fresh serverless
  // deploy) — the UI refetches client-side while the DB self-heals + reseeds.
  const [{ top, trending }, keywords] = await Promise.all([
    getInitialData().catch((e) => {
      console.error("[home] initial data failed, rendering empty shell", e);
      return EMPTY_DATA;
    }),
    getDailyKeywords(20),
  ]);

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

  // JSON-LD CollectionPage with TODAY's auto-extracted keywords —
  // fresh topical signal for Google on every revalidate.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/#homepage`,
    url: siteUrl,
    name: "खबर एक्सप्रेस — ताज़ा हिंदी खबरें",
    inLanguage: "hi-IN",
    isPartOf: { "@id": `${siteUrl}/#website` },
    keywords: keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <QueryProvider>
        <NewsPortal
          initialTop={top}
          initialTrending={trending}
          keywords={keywords.slice(0, 14)}
        />
      </QueryProvider>
    </>
  );
}
