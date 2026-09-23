"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  /** AdSense ad-unit slot ID (leave "auto" to use responsive auto ads). */
  slot?: string;
  className?: string;
  /** Minimum height reserved for the ad (prevents layout shift / CLS). */
  minHeight?: number;
  format?: string;
  label?: string;
}

// Publisher ID — env override उपलब्ध है, वरना यही default चलेगा।
const ADSENSE_CLIENT_DEFAULT = "ca-pub-5021487228942605";

/**
 * Google AdSense slot.
 * - Auto ads render live with the default publisher ID (env var can override).
 * - Auto ads: the <ins> with slot="auto" relies on AdSense Auto Ads placement;
 *   before approval nothing is served and the reserved space keeps CLS at zero.
 */
export function AdSlot({
  slot = "auto",
  className,
  minHeight = 110,
  format = "auto",
  label = "विज्ञापन",
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ADSENSE_CLIENT_DEFAULT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // AdSense not ready yet — safe to ignore.
    }
  }, [client]);

  if (!client) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex select-none items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/40 text-muted-foreground/70",
          className
        )}
        style={{ minHeight }}
      >
        <span className="text-[11px] font-medium tracking-widest uppercase">
          {label} · AdSense
        </span>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden", className)} style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
