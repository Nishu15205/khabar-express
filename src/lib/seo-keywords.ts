/**
 * डेली SEO कीवर्ड इंजन 📈
 *
 * हर दिन की ताज़ा हेडलाइन्स से असली trending शब्द निकालकर:
 *  1. <meta name="keywords"> में inject होते हैं
 *  2. <meta name="news_keywords"> (Google News signal) में जाते हैं
 *  3. JSON-LD CollectionPage.keywords में जाते हैं
 *  4. Homepage पर "आज के ट्रेंडिंग टॉपिक" chips बनकर render होते हैं
 *     (keyword-rich internal links = crawlable anchor text)
 *
 * नतीजा: जैसे-जैसे नई खबरें आएँगी, site के SEO keywords अपने-आप
 * अपडेट होते रहेंगे — बिना किसी manual काम के।
 *
 * Extraction logic:
 *  - titles को tokenize करो (Devanagari + Latin, unicode-aware)
 *  - stopwords (हिंदी + English) हटाओ
 *  - frequency count (title में एक ही शब्द एक बार गिना जाता है,
 *    ताकि एक article एक ही शब्द को spam न करे)
 *  - जो शब्द कम से कम 2 अलग खबरों में आया = trending topic
 *  - 30 min cache (ISR के साथ sync रहता है)
 */

import { getNews } from "@/lib/news-service";
import type { NewsArticle } from "@/lib/types";

/** Static foundation keywords — हमेशा metadata में रहते हैं। */
export const BASE_KEYWORDS = [
  "हिंदी न्यूज़",
  "ताज़ा खबर",
  "ताज़ा हिंदी खबरें",
  "ब्रेकिंग न्यूज़",
  "आज की ताज़ा खबर",
  "हिंदी समाचार",
  "देश की खबर",
  "दुनिया की खबर",
  "खेल समाचार",
  "क्रिकेट न्यूज़",
  "बिज़नेस न्यूज़",
  "मनोरंजन की खबरें",
  "बॉलीवुड न्यूज़",
  "टेक्नोलॉजी न्यूज़",
  "hindi news",
  "hindi news today",
  "latest hindi news",
  "breaking news hindi",
  "aaj ki taza khabar",
  "khabar express",
  "खबर एक्सप्रेस",
];

/** DB खाली हो (cold start) तब generic high-volume topics। */
const FALLBACK_TRENDING = [
  "क्रिकेट",
  "बॉलीवुड",
  "भारत",
  "इलेक्शन",
  "अर्थव्यवस्था",
  "मौसम",
  "शेयर बाज़ार",
  "इस्रो",
  "प्रधानमंत्री",
  "इंडिया",
  "दिल्ली",
  "मुंबई",
];

/** Hindi + English stopwords — ये शब्द keywords नहीं बन सकते। */
const STOPWORDS = new Set([
  // हिंदी function words
  "के", "का", "की", "को", "में", "से", "पर", "और", "यह", "ये", "वह", "वो",
  "है", "हैं", "था", "थे", "थी", "हुआ", "हुई", "हुए", "हो", "होगा", "होगी",
  "होते", "होती", "होता", "कर", "करने", "करना", "किया", "करें", "करेगा",
  "करेगी", "किसे", "किसी", "इस", "उस", "इसे", "उसे", "इन", "उन", "उनके",
  "इनके", "अपने", "अपनी", "लिए", "साथ", "बाद", "पहले", "लेकिन", "या", "भी",
  "नहीं", "ही", "तो", "अब", "आज", "कल", "जब", "तब", "क्या", "कौन", "कहा",
  "गया", "गई", "गए", "जा", "जाएगा", "जाएगी", "रहा", "रही", "रहे", "सकता",
  "सकती", "चाहिए", "वाले", "वाली", "वाला", "नए", "नई", "सभी", "कई",
  "बताया", "मिले", "मिली", "मिला", "दिया", "दी", "लिया", "एक", "दो",
  "तीन", "चार", "पांच", "तक", "बीच", "सामने", "खिलाफ", "दौरान", "फिर",
  "बड़ी", "बड़े", "बड़ा", "नया", "बना", "बनी", "बने", "हुईं", "हुए",
  "रखे", "लगे", "आए", "आई", "आया", "दे", "ले", "ज्यादा", "कम",
  "आएगा", "आएगी", "आएंगे", "रहने", "सकते", "सकता", "सके", "करते",
  "करता", "करती", "करके", "किए", "रखा", "पहला", "पहली", "पहले",
  "कहा", "कहकर", "बोला", "बताई", "बताए", "पाए", "मिले", "कहना",
  "क्यों", "लेकर", "शुरू", "जीता", "जीती", "जीते", "हार", "सवाल",
  "सवालों", "रूप", "नाम", "क्योंकि", "बाद", "आज", "बतौर", "लेकिन",
  // Generic news words (किसी भी headline में होते हैं, topic नहीं)
  "खबर", "खबरें", "न्यूज़", "न्यूज", "समाचार", "अपडेट", "वीडियो", "फोटो",
  "तस्वीरें", "लाइव", "मामला", "मामले", "ताजा", "ताज़ा", "ब्रेकिंग",
  "जानिए", "देखें", "पढ़ें", "शेयर", "रिपोर्ट", "रिपोर्ट", "बयान",
  // English function words
  "the", "and", "for", "with", "from", "this", "that", "have", "has",
  "had", "will", "would", "can", "could", "are", "was", "were", "been",
  "not", "but", "all", "out", "into", "over", "after", "before", "about",
  "amid", "says", "said", "new", "news", "update", "updates", "live",
  "video", "top", "big", "day", "his", "her", "their", "its", "who",
  "what", "why", "how", "when", "where", "vs", "get", "more", "than",
]);

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes — ISR (5 min) के साथ sync
const CACHE_KEY = "__khabarSeoKeywords";

const gCache = globalThis as unknown as {
  [CACHE_KEY]?: { at: number; words: string[] };
};

/** Unicode-aware tokenizer — Devanagari + Latin दोनों।
 * ⚠️ \p{M} ज़रूरी है: हिंदी की मात्राएँ (ा, े, ी, ो…) combining marks हैं,
 * letters नहीं — इनके बिना "खतरा" → "खतर" जैसे अधूरे शब्द बनते हैं। */
function tokenize(text: string): string[] {
  const raw =
    text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*(-[\p{L}\p{N}\p{M}]+)*/gu) ?? [];
  return raw
    .map((w) => (/[a-z]/i.test(w) ? w.toLowerCase() : w))
    .filter((w) => {
      if (STOPWORDS.has(w)) return false;
      if (/^\d+$/.test(w)) return false; // pure numbers
      const letters = w.replace(/[\p{N}]/gu, "");
      if (letters.length < 3) return false; // बहुत छोटे शब्द
      return true;
    });
}

/**
 * आज की latest 150 खबरों से top trending शब्द निकालो।
 * कभी throw नहीं करता — हमेशा string[] देता है।
 */
export async function getDailyKeywords(limit = 20): Promise<string[]> {
  const cached = gCache[CACHE_KEY];
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.words;

  try {
    // getNews take को 50 पर cap करता है — 3 pages मिलाकर 150 titles
    const pages = await Promise.all([
      getNews({ category: "top", limit: 50 }),
      getNews({ category: "top", limit: 50, offset: 50 }),
      getNews({ category: "top", limit: 50, offset: 100 }),
    ]);
    const articles: NewsArticle[] = pages.flat();

    const freq = new Map<string, number>();
    for (const a of articles) {
      const seen = new Set<string>();
      for (const w of tokenize(a.title)) {
        if (seen.has(w)) continue; // एक title में एक ही बार गिनो
        seen.add(w);
        freq.set(w, (freq.get(w) ?? 0) + 1);
      }
    }

    const words = [...freq.entries()]
      .filter(([, n]) => n >= 2) // कम से कम 2 खबरों में = trending
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .slice(0, limit)
      .map(([w]) => w);

    if (words.length) {
      gCache[CACHE_KEY] = { at: Date.now(), words };
      return words;
    }
    return FALLBACK_TRENDING; // cold DB — cache नहीं, अगली बार retry
  } catch (e) {
    console.error("[seo] daily keyword extraction failed", e);
    return FALLBACK_TRENDING;
  }
}
