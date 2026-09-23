# Worklog

---
Task ID: 1
Agent: main (Z.ai Code)
Task: Hindi news portal website — RSS aggregation, SEO, AdSense-ready, zero-maintenance

Work Log:
- Tested 25+ Hindi news RSS feed URLs via curl; selected 9 reliable feeds: TV9 हिंदी (latest/india/world/sports/business/entertainment/technology) + BBC हिंदी + पंजाब केसरी
- Prisma: added Article model (guid unique, category/source/views indexes); pushed to SQLite
- Installed rss-parser@3.13.0
- Backend: src/lib/feeds.ts (feed config + Hindi keyword classifier), src/lib/news-service.ts (10-min auto-refresh with in-flight singleton, DB upsert dedupe, image extraction from media:*/content:encoded/enclosure, 30-day housekeeping, cold-DB ensureSeeded), src/lib/time.ts (Hindi time-ago/date formatters), src/lib/types.ts (NewsArticle DTO)
- APIs: /api/news (category/limit/offset), /api/trending, /api/search, /api/views (POST)
- SEO: layout metadata (hi_IN, OG, twitter, robots googleBot), JSON-LD NewsMediaOrganization + WebSite + SearchAction, ItemList on home, sitemap.ts, robots.ts, lang=hi, Mukta + Noto Serif Devanagari fonts, ISR revalidate=300
- AdSense: AdSlot component (env NEXT_PUBLIC_ADSENSE_CLIENT; placeholders when unset, real <ins> ads when set), adsbygoogle script in layout, slots: header/in-feed/sidebar/in-article/footer-area
- UI: sticky header (logo/search + theme toggle + category pills), breaking ticker (CSS marquee), hero featured + side list, news grid cards, article modal (share/copy/full-link/views tracking), trending sidebar numbered, footer with disclaimer, skeletons, dark mode
- Fixed lint errors (set-state-in-effect): CSS-based theme icons, rAF-deferred ?q= read
- Fixed stale Prisma client (regenerated; dev server restarted)
- Browser-verified via agent-browser: SSR render, ticker, category filter (खेल), article modal + share row, Hindi search dropdown, load-more pagination (30 articles), trending sidebar, mobile 375px responsive, sticky footer, dark mode, sitemap.xml, robots.txt, zero console errors

Stage Summary:
- Working Hindi news portal at "/" — news auto-updates every 10 min from RSS, DB fallback keeps site alive if feeds fail, zero daily maintenance
- Deployment env vars: NEXT_PUBLIC_SITE_URL (canonical/sitemap), NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-… enables live ads; then add public/ads.txt)
- Key files: prisma/schema.prisma, src/lib/{feeds,news-service,time,types}.ts, src/app/api/{news,trending,search,views}/route.ts, src/components/news/*, src/components/ads/ad-slot.tsx, src/app/{layout,page}.tsx, sitemap.ts, robots.ts
