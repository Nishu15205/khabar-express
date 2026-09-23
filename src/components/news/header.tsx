"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/feeds";
import { timeAgoHi } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

interface SiteHeaderProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  onSelectArticle: (a: NewsArticle) => void;
  search: string;
  onSearchChange: (q: string) => void;
}

export function SiteHeader({
  activeCategory,
  onCategoryChange,
  onSelectArticle,
  search,
  onSearchChange,
}: SiteHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [debounced, setDebounced] = useState(search);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const searchEnabled = debounced.trim().length >= 2;

  const searchQuery = useQuery({
    queryKey: ["search", debounced],
    queryFn: async (): Promise<NewsArticle[]> => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`);
      const json = (await res.json()) as { ok: boolean; articles: NewsArticle[] };
      return json.articles ?? [];
    },
    enabled: searchEnabled,
    staleTime: 30_000,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = searchEnabled ? (searchQuery.data ?? []) : [];
  const showDropdown = searchFocused && searchEnabled;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      {/* Row 1: brand + search + theme */}
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-3 sm:px-4 md:h-16 lg:px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="खबर एक्सप्रेस — होम"
        >
          <Image
            src="/logo.png"
            alt="खबर एक्सप्रेस लोगो"
            width={40}
            height={40}
            className="h-9 w-9 rounded-lg sm:h-10 sm:w-10"
            priority
          />
          <span className="text-left leading-tight">
            <span className="block font-headline text-lg font-black tracking-tight sm:text-xl">
              खबर एक्सप्रेस
            </span>
            <span className="hidden text-[11px] text-muted-foreground md:block">
              देश-दुनिया की हर खबर, सबसे तेज़
            </span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div ref={searchWrapRef} className="relative">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="site-search"
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchFocused(false);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                placeholder="खबर खोजें…"
                aria-label="खबर खोजें"
                className="h-9 w-36 pl-8 pr-8 text-sm transition-all duration-300 sm:w-48 sm:focus:w-64 lg:w-56"
              />
              {search && (
                <button
                  onClick={() => onSearchChange("")}
                  aria-label="खोज साफ़ करें"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,26rem)] overflow-hidden rounded-xl border bg-popover shadow-xl">
                {searchQuery.isFetching && !results.length ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> खोज रहे हैं…
                  </div>
                ) : results.length ? (
                  <ul className="max-h-80 divide-y overflow-y-auto scrollbar-slim">
                    {results.map((a) => (
                      <li key={a.guid}>
                        <button
                          onClick={() => {
                            onSelectArticle(a);
                            setSearchFocused(false);
                            onSearchChange("");
                          }}
                          className="w-full px-4 py-2.5 text-left transition-colors hover:bg-muted/70"
                        >
                          <span className="line-clamp-2 block text-sm font-medium leading-snug">
                            {a.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground" suppressHydrationWarning>
                            {a.source} · {timeAgoHi(a.publishedAt)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    &ldquo;{debounced}&rdquo; के लिए कोई खबर नहीं मिली
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="थीम बदलें"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4.5 w-4.5 dark:hidden" />
            <Moon className="hidden h-4.5 w-4.5 dark:block" />
          </Button>
        </div>
      </div>

      {/* Row 2: category nav */}
      <nav
        aria-label="समाचार श्रेणियाँ"
        className="border-t bg-card/60"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-3 py-1.5 scrollbar-hide sm:px-4 lg:px-6">
          {CATEGORIES.map((c) => {
            const active = c.slug === activeCategory;
            return (
              <button
                key={c.slug}
                onClick={() => onCategoryChange(c.slug)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
