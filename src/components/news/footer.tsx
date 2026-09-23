"use client";

import Image from "next/image";
import { FileText, Rss, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/lib/feeds";
import type { InfoKey } from "@/components/news/info-modal";

const LEGAL_LINKS: Array<{ key: Exclude<InfoKey, null>; label: string }> = [
  { key: "about", label: "हमारे बारे में" },
  { key: "privacy", label: "गोपनीयता नीति" },
  { key: "terms", label: "उपयोग की शर्तें" },
  { key: "copyright", label: "कॉपीराइट / DMCA" },
  { key: "contact", label: "संपर्क करें" },
];

export function SiteFooter({
  onCategoryChange,
  onOpenInfo,
}: {
  onCategoryChange: (slug: string) => void;
  onOpenInfo: (key: Exclude<InfoKey, null>) => void;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-card" aria-label="फुटर">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-4 lg:grid-cols-4 lg:px-6">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="खबर एक्सप्रेस लोगो"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg"
            />
            <span className="font-headline text-lg font-black">खबर एक्सप्रेस</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें — हर
            पल अपडेट, सबसे तेज़।
          </p>
        </div>

        {/* Categories */}
        <nav aria-label="श्रेणियाँ" className="space-y-3">
          <h3 className="font-headline text-sm font-bold tracking-wide">श्रेणियाँ</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <button
                  onClick={() => onCategoryChange(c.slug)}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal pages — required for AdSense approval */}
        <nav aria-label="महत्वपूर्ण पृष्ठ" className="space-y-3">
          <h3 className="flex items-center gap-1.5 font-headline text-sm font-bold tracking-wide">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            महत्वपूर्ण पृष्ठ
          </h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.key}>
                <button
                  onClick={() => onOpenInfo(l.key)}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Info */}
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <h3 className="font-headline text-sm font-bold tracking-wide">सूचना</h3>
          <p className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <Rss className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            यह वेबसाइट प्रतिष्ठित समाचार स्रोतों की सार्वजनिक RSS फ़ीड के माध्यम से केवल
            शीर्षक व संक्षिप्त समाचार एकत्रित करती है। सभी खबरों के अधिकार संबंधित
            प्रकाशकों के पास सुरक्षित हैं — हर खबर में मूल स्रोत का लिंक दिया जाता है।
          </p>
          <p className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            इस साइट पर विज्ञापन Google AdSense के माध्यम से प्रदर्शित होते हैं।
          </p>
        </div>
      </div>

      <div className="border-t">
        <div
          className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-4 lg:px-6"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <span>© {year} खबर एक्सप्रेस · सर्वाधिकार सुरक्षित</span>
          <span>समाचार स्वचालित रूप से अपडेट होते हैं</span>
        </div>
      </div>
    </footer>
  );
}
