// News feed configuration — leading Hindi publishers' RSS feeds.
// Adding a new source later = just add one line here. No other code change needed.

export type CategorySlug =
  | "top"
  | "desh"
  | "duniya"
  | "khel"
  | "business"
  | "entertainment"
  | "tech";

export interface CategoryDef {
  slug: CategorySlug;
  label: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "top", label: "ताज़ा खबर" },
  { slug: "desh", label: "देश" },
  { slug: "duniya", label: "दुनिया" },
  { slug: "khel", label: "खेल" },
  { slug: "business", label: "बिज़नेस" },
  { slug: "entertainment", label: "मनोरंजन" },
  { slug: "tech", label: "टेक्नोलॉजी" },
];

export function isCategorySlug(v: string): v is CategorySlug {
  return CATEGORIES.some((c) => c.slug === v);
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? "खबर";
}

export interface FeedSource {
  /** Publisher name shown on cards, e.g. "TV9 हिंदी" */
  name: string;
  /** RSS feed URL */
  url: string;
  /** Category assigned to every item of this feed */
  category: Exclude<CategorySlug, "top">;
  /**
   * Mixed feeds contain news of many topics (homepage feeds).
   * Items are auto-classified with keyword matching; `category` is the fallback.
   */
  mixed?: boolean;
}

export const FEEDS: FeedSource[] = [
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/feed",
    category: "desh",
    mixed: true,
  },
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/category/india/feed",
    category: "desh",
  },
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/category/world/feed",
    category: "duniya",
  },
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/category/sports/feed",
    category: "khel",
  },
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/category/business/feed",
    category: "business",
  },
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/category/entertainment/feed",
    category: "entertainment",
  },
  {
    name: "TV9 हिंदी",
    url: "https://www.tv9hindi.com/category/technology/feed",
    category: "tech",
  },
  {
    name: "BBC हिंदी",
    url: "https://feeds.bbci.co.uk/hindi/rss.xml",
    category: "desh",
    mixed: true,
  },
  {
    name: "पंजाब केसरी",
    url: "https://www.punjabkesari.com/feed",
    category: "desh",
    mixed: true,
  },
];

const KEYWORD_RULES: Array<{
  category: Exclude<CategorySlug, "top">;
  terms: string[];
}> = [
  {
    category: "khel",
    terms: [
      "क्रिकेट", "मैच", "टीम", "खेल", "टूर्नामेंट", "खिलाड़ी", "विश्व कप",
      "हॉकी", "फुटबॉल", "बैडमिंटन", "आइपीएल", "टेस्ट मैच", "वनडे", "टी20",
      "स्पोर्ट्स", "ipl", "cricket", "football", "fifa", "olympic", "hockey",
      "badminton", "wwe", "कबड्डी",
    ],
  },
  {
    category: "tech",
    terms: [
      "स्मार्टफोन", "तकनीक", "गैजेट", "एप्पल", "सैमसंग", "एआई", "टेक्नोलॉजी",
      "इंटरनेट", "सोशल मीडिया", "व्हाट्सएप", "लैपटॉप", "मोबाइल", "ऐप",
      "ai", "iphone", "android", "5g", "instagram", "youtube", "whatsapp",
      "gadget", "smartphone", "chatgpt", "टेक",
    ],
  },
  {
    category: "entertainment",
    terms: [
      "फिल्म", "बॉलीवुड", "अभिनेता", "अभिनेत्री", "मूवी", "ट्रेलर", "सीरियल",
      "रियलिटी शो", "बिग बॉस", "एंटरटेनमेंट", "बॉक्स ऑफिस", "गाना", "डांस",
      "ओटीटी", "actor", "actress", "bollywood", "movie", "trailer",
      "web series", "box office", "kapoor", "khana", "सिनेमा",
    ],
  },
  {
    category: "business",
    terms: [
      "बाजार", "रुपये", "महंगाई", "शेयर", "आरबीआई", "जीडीपी", "बैंक",
      "निवेश", "बजट", "सोना", "चांदी", "पेट्रोल", "डीजल", "मुद्रा", "आर्थिक",
      "कर ", "टैक्स", "gdp", "economy", "market", "bank", "sensex",
      "nifty", "inflation", "business", "अर्थव्यवस्था", "नौकरी",
    ],
  },
  {
    category: "duniya",
    terms: [
      "अमेरिका", "रूस", "चीन", "पाकिस्तान", "यूक्रेन", "इजराइल", "गाजा",
      "ईरान", "ब्रिटेन", "जापान", "यूरोप", "संयुक्त राष्ट्र", "विदेश",
      "ट्रंप", "पुतिन", "नेपाल", "बांग्लादेश", "श्रीलंका", "ऑस्ट्रेलिया",
      "world", "israel", "gaza", "ukraine", "russia", "china", "trump",
    ],
  },
  {
    category: "desh",
    terms: [
      "मोदी", "सरकार", "दिल्ली", "उत्तर प्रदेश", "बिहार", "मुंबई",
      "कोलकाता", "चुनाव", "सुप्रीम कोर्ट", "हाईकोर्ट", "पुलिस", "मुख्यमंत्री",
      "राज्यपाल", "संसद", "मंत्री", "भारत", "योगी", "कांग्रेस", "भाजपा",
      "india", "delhi", "महाराष्ट्र", "मध्य प्रदेश", "राजस्थान", "पंजाब",
    ],
  },
];

/** Keyword-based topic classifier for mixed (homepage) feeds. */
export function classifyCategory(
  text: string,
  fallback: Exclude<CategorySlug, "top">
): Exclude<CategorySlug, "top"> {
  const t = text.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    for (const term of rule.terms) {
      if (t.includes(term.toLowerCase())) return rule.category;
    }
  }
  return fallback;
}
