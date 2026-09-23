import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Mukta, Noto_Serif_Devanagari } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const mukta = Mukta({
  variable: "--font-hindi",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const hindiSerif = Noto_Serif_Devanagari({
  variable: "--font-hindi-serif",
  subsets: ["devanagari"],
  weight: ["400", "700", "900"],
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "खबर एक्सप्रेस — देश, दुनिया, खेल, बिज़नेस की ताज़ा हिंदी खबरें",
    template: "%s | खबर एक्सप्रेस",
  },
  description:
    "खबर एक्सप्रेस — देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें। हर पल अपडेट, सच्ची और तेज़ खबरें सबसे पहले।",
  keywords: [
    "हिंदी न्यूज़",
    "ताज़ा खबर",
    "ब्रेकिंग न्यूज़",
    "हिंदी समाचार",
    "देश",
    "दुनिया",
    "खेल समाचार",
    "बिज़नेस न्यूज़",
    "बॉलीवुड",
    "टेक्नोलॉजी न्यूज़",
    "hindi news",
    "latest hindi news",
    "breaking news hindi",
    "khabar express",
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
      "देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें — हर पल अपडेट।",
  },
  twitter: {
    card: "summary_large_image",
    title: "खबर एक्सप्रेस — देश-दुनिया की ताज़ा हिंदी खबरें",
    description:
      "देश, दुनिया, खेल, बिज़नेस, मनोरंजन और टेक्नोलॉजी की ताज़ा हिंदी खबरें — हर पल अपडेट।",
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

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "खबर एक्सप्रेस",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
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
      <body
        className={`${mukta.variable} ${hindiSerif.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {adsenseClient ? (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
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
