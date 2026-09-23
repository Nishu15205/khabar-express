import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * POST /api/contact — संपर्क पृष्ठ के फॉर्म से संदेश सहेजता है।
 *
 * Vercel पर /tmp DB हर cold-start पर नई बनती है, इसलिए Feedback टेबल
 * यहाँ self-heal की जाती है (ensureSchema जैसा ही pattern)।
 */

const FeedbackInput = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(2000),
});

const gFeedbackSchema = globalThis as unknown as {
  __khabarFeedbackReady?: Promise<void>;
};

function ensureFeedbackTable(): Promise<void> {
  gFeedbackSchema.__khabarFeedbackReady ??= (async () => {
    await db.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Feedback" (
         "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
         "name" TEXT NOT NULL,
         "email" TEXT NOT NULL,
         "message" TEXT NOT NULL,
         "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`,
    );
  })().catch((e) => {
    // अगली बार retry हो सके
    gFeedbackSchema.__khabarFeedbackReady = undefined;
    throw e;
  });
  return gFeedbackSchema.__khabarFeedbackReady;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = FeedbackInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "कृपया सही नाम, ईमेल और कम से कम 10 अक्षर का संदेश भरें।",
        },
        { status: 400 },
      );
    }

    await ensureFeedbackTable();
    await db.feedback.create({ data: parsed.data });

    return NextResponse.json({
      ok: true,
      message:
        "आपका संदेश प्राप्त हो गया है। हम 24-48 घंटों में जवाब देने की कोशिश करेंगे।",
    });
  } catch (e) {
    console.error("[contact] submission failed", e);
    return NextResponse.json(
      { ok: false, error: "कुछ तकनीकी समस्या हुई। कृपया थोड़ी देर बाद कोशिश करें।" },
      { status: 500 },
    );
  }
}
