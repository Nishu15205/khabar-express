import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

// Google AdSense publisher ID — env var override के साथ sane default।
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5021487228942605";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "खबर एक्सप्रेस — देश, दुनिया, खेल, बिज़नेस की ताज़ा हिंदी खबरें",
    template: "%s | खबर एक्सप्रेस",
  },
  description:
    "खबर एक्सप्रेस — देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें। ब्रेकिंग न्यूज़, आज की बड़ी खबरें और लाइव अपडेट सबसे पहले, हर पल अपडेट।",
  keywords: [
    // Hindi — high-volume news queries
    "हिंदी न्यूज़",
    "ताज़ा खबर",
    "ताज़ा हिंदी खबरें",
    "ब्रेकिंग न्यूज़",
    "ब्रेकिंग न्यूज़ हिंदी में",
    "आज की ताज़ा खबर",
    "आज की बड़ी खबरें",
    "हिंदी समाचार",
    "समाचार हिंदी में",
    "देश की खबर",
    "दुनिया की खबर",
    "खेल समाचार",
    "क्रिकेट न्यूज़ हिंदी",
    "बिज़नेस न्यूज़ हिंदी",
    "मनोरंजन की खबरें",
    "बॉलीवुड न्यूज़",
    "टेक्नोलॉजी न्यूज़ हिंदी",
    // English — India news search patterns
    "hindi news",
    "hindi news today",
    "latest hindi news",
    "breaking news hindi",
    "aaj ke samachar",
    "top news in hindi",
    "live hindi news",
    "india news in hindi",
    "world news in hindi",
    "sports news in hindi",
    "business news in hindi",
    "bollywood news hindi",
    "tech news in hindi",
    // Brand
    "khabar express",
    "खबर एक्सप्रेस",
    "khabar express hindi news",
  ],
  applicationName: "खबर एक्सप्रेस",
  authors: [{ name: "खबर एक्सप्रेस" }],
  creator: "खबर एक्सप्रेस",
  publisher: "खबर एक्सप्रेस",
  category: "news",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: siteUrl,
    siteName: "खबर एक्सप्रेस",
    title: "खबर एक्सप्रेस — देश-दुनिया की ताज़ा हिंदी खबरें",
    description:
      "देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें — ब्रेकिंग न्यूज़ और लाइव अपडेट हर पल।",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "खबर एक्सप्रेस — ताज़ा हिंदी खबरें",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "खबर एक्सप्रेस — देश-दुनिया की ताज़ा हिंदी खबरें",
    description:
      "देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें — ब्रेकिंग न्यूज़ और लाइव अपडेट हर पल।",
    images: ["/og-banner.png"],
  },
  // Google News style keyword signal + AdSense site association
  other: {
    news_keywords:
      "हिंदी न्यूज़, ताज़ा खबर, ब्रेकिंग न्यूज़, हिंदी समाचार, देश, दुनिया, खेल, बिज़नेस, मनोरंजन, टेक्नोलॉजी",
    "google-adsense-account": ADSENSE_CLIENT,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c0282b" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "खबर एक्सप्रेस",
      alternateName: "Khabar Express",
      slogan: "ताज़ा हिंदी खबरें — हर पल, सबसे तेज़",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      image: `${siteUrl}/og-banner.png`,
      knowsLanguage: ["hi", "en"],
      areaServed: { "@type": "Country", name: "India" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "खबर एक्सप्रेस",
      description: "देश-दुनिया की ताज़ा हिंदी खबरें",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "hi-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        {/*
          Fonts via CDN <link> — React 19 इन्हें <head> में hoist करता है।
          जान-बूझकर next/font/google नहीं: वो build के समय Google Fonts
          download करता है, और Vercel build IPs पर वह fetch कभी-कभी
          fail होकर पूरा build गिरा देता है। CDN link runtime-only है।
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          precedence="default"
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700;800&family=Noto+Serif+Devanagari:wght@400;700;900&display=swap"
        />

        {/*
          AdSense — strategy="beforeInteractive" के साथ यह <head> में
          inject होता है (Google का standard header placement)।
        */}
        <Script
          id="adsbygoogle-init"
          async
          strategy="beforeInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
