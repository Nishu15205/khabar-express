/**
 * Post-build step: prepare the self-hosted "standalone" output.
 *
 * - VPS/Docker (output: "standalone"): copies static assets + public/ into
 *   .next/standalone so `bun .next/standalone/server.js` can serve everything.
 * - Vercel (native build, no standalone dir): skips silently.
 *
 * ⚠️ यह script कभी non-zero exit नहीं कर सकता — deployment की जान
 *    किसी cosmetic copy error पर नहीं गँनी चाहिए।
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";

try {
  const standaloneDir = ".next/standalone";

  if (existsSync(standaloneDir)) {
    mkdirSync(`${standaloneDir}/.next`, { recursive: true });
    cpSync(".next/static", `${standaloneDir}/.next/static`, { recursive: true });
    cpSync("public", `${standaloneDir}/public`, { recursive: true });
    console.log("[post-build] standalone output prepared ✓");
  } else {
    console.log(
      "[post-build] no standalone output detected (Vercel/native build) — skipping copy",
    );
  }
} catch (e) {
  console.error("[post-build] skipped due to error:", e);
}
