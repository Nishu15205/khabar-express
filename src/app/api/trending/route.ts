import { NextResponse } from "next/server";
import { getTrending } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await getTrending(8);
    return NextResponse.json({ ok: true, articles });
  } catch (e) {
    console.error("[api/trending]", e);
    return NextResponse.json(
      { ok: false, articles: [], error: "ट्रेंडिंग खबरें लोड नहीं हो पाईं" },
      { status: 500 }
    );
  }
}
