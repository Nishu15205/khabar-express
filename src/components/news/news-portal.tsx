"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/news/header";
import { SiteFooter } from "@/components/news/footer";
import { InfoModal, type InfoKey } from "@/components/news/info-modal";
import { BreakingTicker } from "@/components/news/breaking-ticker";
import { HeroSection } from "@/components/news/hero-section";
import { CategorySection } from "@/components/news/category-section";
import { TrendingSidebar } from "@/components/news/trending-sidebar";
import { ArticleModal } from "@/components/news/article-modal";
import { AdSlot } from "@/components/ads/ad-slot";
import type { NewsArticle } from "@/lib/types";

interface NewsPortalProps {
  initialTop: NewsArticle[];
  initialTrending: NewsArticle[];
}

export function NewsPortal({ initialTop, initialTrending }: NewsPortalProps) {
  const [activeCategory, setActiveCategory] = useState("top");
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [search, setSearch] = useState("");
  const [infoKey, setInfoKey] = useState<InfoKey>(null);

  // Support ?q= deep links (Google SearchAction / shared search URLs)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (!q) return;
    window.history.replaceState({}, "", "/");
    // Defer state update out of the effect body (avoids cascading render).
    const raf = requestAnimationFrame(() => setSearch(q));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Trending refreshes automatically every 5 minutes
  const trendingQuery = useQuery({
    queryKey: ["trending"],
    queryFn: async (): Promise<NewsArticle[]> => {
      const res = await fetch("/api/trending");
      const json = (await res.json()) as { ok: boolean; articles: NewsArticle[] };
      return json.articles ?? [];
    },
    initialData: initialTrending,
    refetchInterval: 5 * 60 * 1000,
  });

  const trending = useMemo(() => trendingQuery.data ?? [], [trendingQuery.data]);

  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug);
    requestAnimationFrame(() => {
      document.getElementById("khabrein")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const tickerItems = useMemo(() => initialTop.slice(0, 10), [initialTop]);
  const heroItems = useMemo(() => initialTop.slice(0, 6), [initialTop]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onSelectArticle={setSelected}
        search={search}
        onSearchChange={setSearch}
      />

      <BreakingTicker items={tickerItems} onSelect={setSelected} />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-3 py-5 sm:px-4 sm:py-6 lg:px-6">
        <HeroSection articles={heroItems} onSelect={setSelected} />

        {/* Top leaderboard ad */}
        <AdSlot minHeight={120} className="rounded-lg" label="हेडर विज्ञापन" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <CategorySection
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onSelectArticle={setSelected}
            initialTop={initialTop}
          />

          <aside className="hidden lg:block" aria-label="साइडबार">
            <div className="sticky top-36 space-y-6">
              <TrendingSidebar articles={trending} onSelect={setSelected} />
              <AdSlot minHeight={420} label="साइडबार विज्ञापन" />
            </div>
          </aside>
        </div>

        {/* Mobile trending */}
        <div className="space-y-5 lg:hidden">
          <TrendingSidebar articles={trending} onSelect={setSelected} />
          <AdSlot minHeight={120} label="विज्ञापन" />
        </div>
      </main>

      <SiteFooter onCategoryChange={handleCategoryChange} onOpenInfo={setInfoKey} />

      <ArticleModal article={selected} onClose={() => setSelected(null)} />
      <InfoModal openKey={infoKey} onOpenChange={setInfoKey} />
    </div>
  );
}
