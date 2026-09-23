"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, ExternalLink, Eye, Link2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ads/ad-slot";
import { useToast } from "@/hooks/use-toast";
import { formatDateHi, timeAgoHi } from "@/lib/time";
import { categoryImage, categoryLabel } from "@/lib/feeds";
import type { NewsArticle } from "@/lib/types";

/**
 * Full-screen reading overlay for a single news article (SPA — no page change).
 *
 * Copyright-safe by design:
 * - shows ONLY the headline + short RSS snippet (fair-use style summary)
 * - always attributes the source publisher
 * - sends the reader to the original article for the full text
 */
export function ArticleModal({
  article,
  onClose,
}: {
  article: NewsArticle | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!article) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guid: article.guid }),
    }).catch(() => {});

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [article, onClose]);

  const handleShare = async () => {
    if (!article || sharing) return;
    setSharing(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: article.title, url: article.link });
      } else {
        await navigator.clipboard.writeText(article.link);
        toast({ title: "लिंक कॉपी हो गया ✓" });
      }
    } catch {
      // user cancelled share — nothing to do
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    if (!article) return;
    try {
      await navigator.clipboard.writeText(article.link);
      toast({ title: "लिंक कॉपी हो गया ✓" });
    } catch {
      toast({ title: "लिंक कॉपी नहीं हो सका", variant: "destructive" });
    }
  };

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          key="article-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={article.title}
        >
          <motion.article
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto my-0 min-h-full w-full max-w-3xl border bg-background shadow-2xl sm:my-8 sm:min-h-0 sm:rounded-xl"
          >
            {/* Sticky top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/90 px-4 py-2.5 backdrop-blur sm:rounded-t-xl sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <Badge className="border-0 bg-primary text-[10px] font-semibold text-primary-foreground hover:bg-primary">
                  {categoryLabel(article.category)}
                </Badge>
                <span className="truncate text-xs text-muted-foreground">
                  स्रोत: {article.source}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="बंद करें"
                className="shrink-0 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Copyright-safe category artwork */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted sm:rounded-t-none">
              <Image
                src={categoryImage(article.category)}
                alt={`${categoryLabel(article.category)} — समाचार चित्र`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <h1 className="font-headline text-2xl font-bold leading-snug sm:text-[28px]">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5" suppressHydrationWarning>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDateHi(article.publishedAt)} · {timeAgoHi(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  {article.views + 1} बार पढ़ी गई
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button size="sm" onClick={handleShare} disabled={sharing}>
                  {sharing ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  शेयर करें
                </Button>
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Link2 className="mr-1.5 h-3.5 w-3.5" />
                  लिंक कॉपी
                </Button>
              </div>

              <AdSlot minHeight={110} className="rounded-lg" label="आर्टिकल विज्ञापन" />

              {/* Short snippet only — full story stays with the publisher */}
              {article.description && (
                <p className="text-[16px] leading-8 text-foreground/90 sm:text-[17px]">
                  {article.description}
                </p>
              )}

              <div className="rounded-lg border border-primary/25 bg-primary/5 p-4 sm:p-5">
                <p className="text-sm font-semibold text-foreground">
                  यह खबर मूल रूप से <span className="text-primary">{article.source}</span> द्वारा
                  प्रकाशित है।
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  हम केवल शीर्षक और संक्षिप्त जानकारी दिखाते हैं। पूरी खबर पढ़ने के लिए मूल
                  स्रोत पर जाएँ — वहीं सभी अधिकार सुरक्षित हैं।
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-3 inline-block"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    पूरी खबर {article.source} पर पढ़ें
                    <ExternalLink className="ml-1.5 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
