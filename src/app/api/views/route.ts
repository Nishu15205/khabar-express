import { NextRequest, NextResponse } from "next/server";
import { incrementView } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { guid?: string } | null;
    const guid = body?.guid?.trim();
    if (!guid) {
      return NextResponse.json({ ok: false, error: "guid आवश्यक है" }, { status: 400 });
    }
    await incrementView(guid);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/views]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
