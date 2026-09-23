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

/**
 * Google AdSense slot.
 * - Set NEXT_PUBLIC_ADSENSE_CLIENT (e.g. "ca-pub-XXXXXXXXXXXXXXXX") and the
 *   ad renders live. No code change needed.
 * - Without it, a clean "विज्ञापन" placeholder is shown so layout/CLS stays stable.
 */
export function AdSlot({
  slot = "auto",
  className,
  minHeight = 110,
  format = "auto",
  label = "विज्ञापन",
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
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
