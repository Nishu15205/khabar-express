import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/news-service";
import { isCategorySlug } from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const categoryParam = sp.get("category") ?? "top";
    const category = isCategorySlug(categoryParam) ? categoryParam : "top";
    const limit = Math.min(parseInt(sp.get("limit") ?? "12", 10) || 12, 50);
    const offset = Math.max(parseInt(sp.get("offset") ?? "0", 10) || 0, 0);
    const articles = await getNews({ category, limit, offset });
    return NextResponse.json({ ok: true, articles });
  } catch (e) {
    console.error("[api/news]", e);
    return NextResponse.json(
      { ok: false, articles: [], error: "खबरें लोड करने में समस्या हुई" },
      { status: 500 }
    );
  }
}
