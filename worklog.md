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

---
Task ID: 2
Agent: main (Z.ai Code)
Task: Copyright-safe banaya — AdSense approval + DMCA protection ke liye

Work Log:
- Copyright audit kiya: 3 HIGH risks mile — (1) publisher images hotlinking (images.tv9hindi.com/BBC CDN), (2) 420-char full descriptions republishing, (3) AdSense-required legal pages missing
- 7 copyright-safe AI-generated category images banaye (public/categories/: top, desh, duniya, khel, business, entertainment, tech) — sab site ki apni sampatti
- news-service.ts: descriptions ab 220-char snippets par capped (store + serve dono), DTO se image field hata diya (publisher URLs kabhi client ko nahi jaate), numeric HTML entity decoding add kiya (&#8216; etc.)
- feeds.ts: categoryImage() helper add kiya
- news-card/hero/article-modal: publisher images ki jagah category artwork, modal ab snippet + attribution box + "पूरी खबर {source} पर पढ़ें" CTA dikhata hai
- info-modal.tsx banaya: About, Privacy Policy (AdSense DART cookies + opt-out links ke saath), Terms & Conditions, Copyright/DMCA policy (48-hour takedown), Contact — footer "महत्वपूर्ण पृष्ठ" section se khulte hain
- footer.tsx: legal links + stronger RSS disclaimer
- public/ads.txt template banaya (comments ke saath — user sirf pub-ID bhare)
- Browser-verified: cards with AI images, snippet modal, Privacy + DMCA modals render, zero console errors, lint clean

Stage Summary:
- Site ab Google News-style aggregator model par hai: headline + short snippet + attribution + outbound link = AdSense-safe
- Deploy se pehle user ko sirf 2 cheezein badalni hain: SITE_EMAIL (info-modal.tsx) aur ads.txt mein apni pub-ID
- Agar koi publisher DMCA bheje, uski feed feeds.ts se ek line hatakar 100% compliant ho jayega

---
Task ID: 3
Agent: main (Z.ai Code)
Task: AdSense signup support — Vercel-proof deployment (ephemeral DB fix) + AdSense form guidance

Work Log:
- User AdSense signup form par pahunch gaya; "Your site" ke liye live URL chahiye — deployment blocker identify kiya
- CRITICAL fix: Vercel/read-only-FS par SQLite fail hota — news-service.ts mein `ensureSchema()` self-healing bootstrap add kiya (CREATE TABLE IF NOT EXISTS + 4 indexes via $executeRawUnsafe, globalThis-memoized, failure par retry)
- ensureSeeded: Promise.race with 8s cap (serverless function timeout protection)
- getNews/getTrending/searchNews/ensureFresh: sab queries se pehle ensureSchema() await
- page.tsx: getInitialData().catch() fallback — cold/missing DB par bhi homepage kabhi 500 nahi karega (client-side refetch recover karta hai)
- package.json: `postinstall: prisma generate` (Vercel build ke liye zaroori)
- next.config.ts: output standalone sirf self-hosting ke liye; VERCEL env par undefined (native Vercel build)
- .gitignore: db/*.db add kiya (fresh clone self-heal karega)
- info-modal.tsx: contact modal se visible "example email" note hataya (AdSense review-safe)
- Self-heal TEST kiya: DB file delete → server restart → schema auto-created, feeds re-seeded, APIs + SSR sab working (Vercel cold-start simulation passed)
- Dev server spawn pattern discover kiya: `( bun run dev & )` subshell double-fork hi cross-call survive karta hai (nohup/setsid SIGKILL ho jate hain)
- Browser-verified: homepage 30 articles, Privacy modal (AdSense+DART clause), DMCA modal (48-hour takedown), zero console errors, lint clean

Stage Summary:
- Site ab Vercel first-try deploy ke liye ready: DATABASE_URL=file:/tmp/khabar.db env + auto schema heal + feed reseed
- DB ab poori tarah disposable cache hai — delete/corrupt hone par bhi site khud recover karti hai
- AdSense flow: deploy → custom domain (vercel.app se approval mushkil) → form me URL → signup → ca-pub ID → NEXT_PUBLIC_ADSENSE_CLIENT + ads.txt
