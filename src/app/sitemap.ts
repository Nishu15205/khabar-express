import type { MetadataRoute } from "next";
import { ORIGINAL_ARTICLES } from "@/lib/original-articles";

/**
 * साइटमैप — होमपेज, legal pages और सभी मौलिक लेख।
 * (RSS खबरें प्रकाशकों की साइट पर जाती हैं, इसलिए वे यहाँ नहीं।)
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${base}/?page=privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/?page=about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/?page=contact`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = ORIGINAL_ARTICLES.map((a) => ({
    url: `${base}/?article=${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
