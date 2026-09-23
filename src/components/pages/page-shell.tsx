import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/**
 * स्टैंडअलोन पृष्ठों (Privacy/About/Contact/Article) के लिए साझा शैल —
 * ब्रांड हेडर + कंटेंट + वापस होम लिंक। Server component।
 */
export function PageShell({
  children,
  title,
  subtitle,
  updated,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  updated?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* हल्का ब्रांड हेडर */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            aria-label="खबर एक्सप्रेस होमपेज"
          >
            <Image
              src="/logo.png"
              alt="खबर एक्सप्रेस लोगो"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg"
            />
            <span className="font-headline text-lg font-black">खबर एक्सप्रेस</span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            होमपेज
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <article className="rounded-2xl border bg-card p-5 sm:p-8">
          <h1 className="font-headline text-2xl font-black leading-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          ) : null}
          {updated ? (
            <p className="mt-1 text-xs text-muted-foreground/80">
              अंतिम अपडेट: {updated}
            </p>
          ) : null}
          <div className="mt-6 space-y-6 leading-relaxed">{children}</div>
        </article>
      </main>

      {/* स्टिकी फुटर */}
      <footer className="mt-auto border-t bg-card">
        <div
          className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <span>© {new Date().getFullYear()} खबर एक्सप्रेस · सर्वाधिकार सुरक्षित</span>
          <nav aria-label="फुटर पृष्ठ" className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="/?page=privacy" className="transition-colors hover:text-primary">
              गोपनीयता नीति
            </a>
            <a href="/?page=about" className="transition-colors hover:text-primary">
              हमारे बारे में
            </a>
            <a href="/?page=contact" className="transition-colors hover:text-primary">
              संपर्क करें
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/** लेखन खंड — h2 शीर्षक + पैराग्राफ़ */
export function ProseSection({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      {heading ? (
        <h2 className="font-headline text-lg font-bold sm:text-xl">{heading}</h2>
      ) : null}
      {children}
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-foreground/90">{children}</p>;
}

/** बुलेट सूची */
export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/90">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
