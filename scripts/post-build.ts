/**
 * Post-build step: prepare the self-hosted "standalone" output.
 *
 * - VPS/Docker (output: "standalone"): copies static assets + public/ into
 *   .next/standalone so `bun .next/standalone/server.js` can serve everything.
 * - Vercel (native build, no standalone dir): skips silently so the build
 *   never fails there.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";

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
