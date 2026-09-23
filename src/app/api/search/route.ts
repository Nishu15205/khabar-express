import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const articles = await searchNews(q, 20);
    return NextResponse.json({ ok: true, articles });
  } catch (e) {
    console.error("[api/search]", e);
    return NextResponse.json(
      { ok: false, articles: [], error: "खोज में समस्या हुई" },
      { status: 500 }
    );
  }
}
