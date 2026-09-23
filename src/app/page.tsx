import type { Metadata } from "next";
import { NewsPortal } from "@/components/news/news-portal";
import { QueryProvider } from "@/components/query-provider";
import { getInitialData } from "@/lib/news-service";
import { BASE_KEYWORDS, getDailyKeywords } from "@/lib/seo-keywords";
import {
  getOriginalArticle,
  ORIGINAL_ARTICLES,
} from "@/lib/original-articles";
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
} from "@/components/pages/legal-pages";
import {
  OriginalArticlePage,
} from "@/components/pages/original-article-page";
import type { NewsArticle } from "@/lib/types";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const EMPTY_DATA: { top: NewsArticle[]; trending: NewsArticle[] } = {
  top: [],
  trending: [],
};

type SearchParams = { page?: string; article?: string };

/**
 * डायनामिक SEO metadata — हर 5 मिनट में आज की trending खबरों के
 * असली keywords इस page के <head> में inject हो जाते हैं।
 * स्टैंडअलोन पृष्ठों (privacy/about/contact/article) का अपना
 * title/description/canonical बनता है।
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { page, article } = await searchParams;

  // ----- स्टैंडअलोन पृष्ठ -----
  if (page === "privacy") {
    return {
      title: "गोपनीयता नीति (Privacy Policy)",
      description:
        "खबर एक्सप्रेस की गोपनीयता नीति — कौन-सी जानकारी एकत्र होती है, कुकीज़ और Google AdSense (DART) का उपयोग, और आपके अधिकार।",
      alternates: { canonical: "/?page=privacy" },
    };
  }
  if (page === "about") {
    return {
      title: "हमारे बारे में (About Us)",
      description:
        "खबर एक्सप्रेस — स्वतंत्र हिंदी न्यूज़ पोर्टल। जानिए हम RSS स्रोतों के साथ पारदर्शी रूप से कैसे काम करते हैं और मौलिक लेख कैसे लिखते हैं।",
      alternates: { canonical: "/?page=about" },
    };
  }
  if (page === "contact") {
    return {
      title: "संपर्क करें (Contact Us)",
      description:
        "खबर एक्सप्रेस से संपर्क — ईमेल और ऑनलाइन फॉर्म। खबर में सुधार, कॉपीराइट/DMCA और साझेदारी के लिए 24-48 घंटों में जवाब।",
      alternates: { canonical: "/?page=contact" },
    };
  }

  // ----- मौलिक लेख -----
  if (article) {
    const a = getOriginalArticle(article);
    if (a) {
      return {
        title: a.title,
        description: a.excerpt,
        keywords: a.tags,
        alternates: { canonical: `/?article=${a.slug}` },
        openGraph: {
          type: "article",
          locale: "hi_IN",
          url: `${siteUrl}/?article=${a.slug}`,
          siteName: "खबर एक्सप्रेस",
          title: a.title,
          description: a.excerpt,
          publishedTime: a.publishedAt,
          authors: ["खबर एक्सप्रेस टीम"],
          images: [{ url: "/og-banner.png", width: 1200, height: 630 }],
        },
        twitter: {
          card: "summary_large_image",
          title: a.title,
          description: a.excerpt,
          images: ["/og-banner.png"],
        },
        other: { news_keywords: a.tags.join(", ") },
      };
    }
  }

  // ----- होमपेज (डायनामिक डेली keywords) -----
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
    title,
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
      news_keywords: daily.join(", "),
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, article } = await searchParams;

  // ----- स्टैंडअलोन पृष्ठ (AdSense के लिए ज़रूरी legal pages) -----
  if (page === "privacy") return <PrivacyPage />;
  if (page === "about") return <AboutPage />;
  if (page === "contact") return <ContactPage />;

  // ----- मौलिक लेख (original content pages) -----
  if (article) {
    const a = getOriginalArticle(article);
    if (a) return <OriginalArticlePage article={a} siteUrl={siteUrl} />;
  }

  // ----- होमपेज -----
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
    hasPart: ORIGINAL_ARTICLES.map((a) => ({
      "@type": "NewsArticle",
      headline: a.title,
      url: `${siteUrl}/?article=${a.slug}`,
      datePublished: a.publishedAt,
      author: { "@type": "Organization", name: "खबर एक्सप्रेस टीम" },
    })),
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
          originalArticles={ORIGINAL_ARTICLES}
        />
      </QueryProvider>
    </>
  );
}
