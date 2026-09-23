import Parser from "rss-parser";
import { db } from "@/lib/db";
import {
  FEEDS,
  classifyCategory,
  type FeedSource,
} from "@/lib/feeds";
import type { CategorySlug } from "@/lib/feeds";
import type { NewsArticle } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Schema bootstrap (self-healing)                                     */
/* ------------------------------------------------------------------ */

const gSchema = globalThis as unknown as { __khabarSchemaReady?: Promise<void> };

/**
 * Creates the Article table if it is missing.
 *
 * Needed for hosts with an ephemeral filesystem (e.g. Vercel, where the DB
 * lives at file:/tmp/… and every cold start begins with an empty database).
 * The feed refiller then repopulates it automatically. Also self-heals a
 * locally deleted/corrupted DB file, so the site can never hard-crash.
 */
export function ensureSchema(): Promise<void> {
  if (!gSchema.__khabarSchemaReady) {
    gSchema.__khabarSchemaReady = (async () => {
      await db.$executeRawUnsafe(
        `CREATE TABLE IF NOT EXISTS "Article" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "guid" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "link" TEXT NOT NULL,
  "image" TEXT,
  "category" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`
      );
      await db.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "Article_guid_key" ON "Article"("guid")`
      );
      await db.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Article_category_publishedAt_idx" ON "Article"("category", "publishedAt")`
      );
      await db.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Article_views_idx" ON "Article"("views")`
      );
      await db.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Article_publishedAt_idx" ON "Article"("publishedAt")`
      );
    })().catch((e) => {
      // Don't cache the failure — allow the next call to retry.
      gSchema.__khabarSchemaReady = undefined;
      console.error("[news] schema bootstrap failed", e);
    });
  }
  return gSchema.__khabarSchemaReady;
}

/* ------------------------------------------------------------------ */
/* RSS parsing                                                         */
/* ------------------------------------------------------------------ */

const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
    ],
  },
});

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 KhabarBot/1.0";

function cleanText(html: string, max = 220): string {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&hellip;/gi, "…")
    .replace(/&laquo;|&raquo;/gi, "")
    // numeric HTML entities (e.g. &#8216; &#x2018;) → real characters
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => {
      try {
        return String.fromCodePoint(parseInt(h, 16));
      } catch {
        return " ";
      }
    })
    .replace(/&#(\d+);/g, (_, d: string) => {
      try {
        return String.fromCodePoint(parseInt(d, 10));
      } catch {
        return " ";
      }
    })
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function pickMediaUrl(media: unknown): string | null {
  if (!media) return null;
  const arr = Array.isArray(media) ? media : [media];
  for (const el of arr) {
    const anyEl = el as { $?: { url?: string }; url?: string };
    const url = anyEl?.$?.url ?? anyEl?.url;
    if (url && /^https?:\/\//.test(url)) return url;
  }
  return null;
}

function extractImage(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as
    | { url?: string }
    | Array<{ $?: { url?: string }; url?: string }>
    | undefined;
  if (enclosure) {
    if (!Array.isArray(enclosure) && enclosure.url) return enclosure.url;
    if (Array.isArray(enclosure)) {
      const u = pickMediaUrl(enclosure);
      if (u) return u;
    }
  }
  const fromMedia =
    pickMediaUrl(item.mediaContent) ?? pickMediaUrl(item.mediaThumbnail);
  if (fromMedia) return fromMedia;

  const html =
    (item.contentEncoded as string) ??
    (item["content:encoded"] as string) ??
    (item.content as string) ??
    (item.description as string) ??
    "";
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  if (match?.[1] && /^https?:\/\//.test(match[1])) return match[1];
  return null;
}

/** Normalized dedupe key: link without query/hash/trailing slash. */
function normalizeGuid(link: string): string {
  try {
    const u = new URL(link);
    u.search = "";
    u.hash = "";
    let s = u.toString();
    if (s.endsWith("/")) s = s.slice(0, -1);
    return s;
  } catch {
    return link.split("?")[0];
  }
}

interface RawFeedItem extends Record<string, unknown> {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  description?: string;
  content?: string;
}

async function fetchFeed(feed: FeedSource): Promise<number> {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
    signal: AbortSignal.timeout(9000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Feed ${feed.url} → HTTP ${res.status}`);
  const xml = await res.text();
  const parsed = await parser.parseString(xml);
  const items = (parsed.items ?? []).slice(0, 30) as RawFeedItem[];
  let saved = 0;

  for (const item of items) {
    const link = item.link?.trim();
    const title = cleanText(item.title ?? "", 220);
    if (!link || !title) continue;

    const guid = normalizeGuid(link);
    const rawDesc =
      (item.contentEncoded as string) ??
      (item["content:encoded"] as string) ??
      item.content ??
      item.description ??
      "";
    // Copyright-safe: store only a short snippet (~220 chars), never full text.
    const description = cleanText(rawDesc, 220);
    const image = extractImage(item as Record<string, unknown>);
    const pubRaw = item.isoDate ?? item.pubDate;
    const pubDate = pubRaw ? new Date(pubRaw) : new Date();
    const publishedAt = Number.isNaN(pubDate.getTime()) ? new Date() : pubDate;
    const category = feed.mixed
      ? classifyCategory(`${title} ${description}`, feed.category)
      : feed.category;

    await db.article.upsert({
      where: { guid },
      create: { guid, title, description, link, image, category, source: feed.name, publishedAt },
      // Do NOT overwrite category/views on update — user stats stay intact.
      update: { title, description, image },
    });
    saved++;
  }
  return saved;
}

/* ------------------------------------------------------------------ */
/* Refresh scheduling (in-memory, zero-config)                         */
/* ------------------------------------------------------------------ */

const REFRESH_MS = 10 * 60 * 1000; // refresh feeds every 10 minutes
const RETAIN_DAYS = 30;

let lastRefreshAt = 0;
let inFlight: Promise<void> | null = null;

/** Kick off a feed refresh at most once every REFRESH_MS (never throws). */
export function ensureFresh(force = false): Promise<void> {
  if (inFlight) return inFlight;
  if (!force && Date.now() - lastRefreshAt < REFRESH_MS) return Promise.resolve();
  lastRefreshAt = Date.now();

  inFlight = (async () => {
    await ensureSchema();
    const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f)));
    const okCount = results.filter((r) => r.status === "fulfilled").length;
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[news] feed failed: ${FEEDS[i].url}`, r.reason?.message);
      }
    });
    if (okCount > 0) {
      try {
        // Housekeeping: drop articles older than RETAIN_DAYS to keep DB small.
        await db.article.deleteMany({
          where: { publishedAt: { lt: new Date(Date.now() - RETAIN_DAYS * 864e5) } },
        });
      } catch (e) {
        console.error("[news] housekeeping failed", e);
      }
    }
  })()
    .catch((e) => console.error("[news] refresh failed", e))
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Await only on a cold/empty DB so the very first page render has news. */
export async function ensureSeeded(): Promise<void> {
  try {
    await ensureSchema();
    const count = await db.article.count();
    if (count < 30) {
      // Cap the wait so serverless functions never hit their time limit —
      // partial data renders, the rest arrives via background refresh +
      // client-side refetch.
      await Promise.race([
        ensureFresh(true),
        new Promise((r) => setTimeout(r, 8000)),
      ]);
    }
  } catch (e) {
    console.error("[news] ensureSeeded failed", e);
  }
}

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

const SELECT = {
  guid: true,
  title: true,
  description: true,
  link: true,
  category: true,
  source: true,
  views: true,
  publishedAt: true,
} as const;

type DbArticle = {
  guid: string;
  title: string;
  description: string;
  link: string;
  category: string;
  source: string;
  views: number;
  publishedAt: Date;
};

/**
 * Copyright-safe DTO:
 * - publisher image URLs are never exposed (no hotlinking)
 * - descriptions are defensively capped at 220 chars even for legacy rows
 */
function toDTO(a: DbArticle): NewsArticle {
  const { image: _image, ...rest } = a as DbArticle & { image?: string | null };
  return {
    ...rest,
    description:
      rest.description.length > 221
        ? rest.description.slice(0, 220).trimEnd() + "…"
        : rest.description,
    publishedAt: rest.publishedAt.toISOString(),
  };
}

export async function getNews(opts: {
  category?: CategorySlug;
  limit?: number;
  offset?: number;
}): Promise<NewsArticle[]> {
  const { category = "top", limit = 12, offset = 0 } = opts;
  await ensureSchema();
  // Background refresh — never blocks the response (except cold DB).
  void ensureFresh().catch(() => {});
  const rows = await db.article.findMany({
    where: category === "top" ? {} : { category },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: Math.min(Math.max(limit, 1), 50),
    skip: Math.max(offset, 0),
    select: SELECT,
  });
  return rows.map(toDTO);
}

export async function getTrending(limit = 8): Promise<NewsArticle[]> {
  await ensureSchema();
  void ensureFresh().catch(() => {});
  const rows = await db.article.findMany({
    orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: SELECT,
  });
  return rows.map(toDTO);
}

export async function searchNews(q: string, limit = 20): Promise<NewsArticle[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  await ensureSchema();
  void ensureFresh().catch(() => {});
  const rows = await db.article.findMany({
    where: {
      OR: [{ title: { contains: query } }, { description: { contains: query } }],
    },
    orderBy: [{ publishedAt: "desc" }],
    take: limit,
    select: SELECT,
  });
  return rows.map(toDTO);
}

export async function incrementView(guid: string): Promise<void> {
  try {
    await db.article.update({ where: { guid }, data: { views: { increment: 1 } } });
  } catch (e) {
    console.error("[news] view increment failed", e);
  }
}

export async function getInitialData(): Promise<{
  top: NewsArticle[];
  trending: NewsArticle[];
}> {
  await ensureSeeded();
  const [top, trending] = await Promise.all([
    getNews({ category: "top", limit: 24 }),
    getTrending(8),
  ]);
  return { top, trending };
}
