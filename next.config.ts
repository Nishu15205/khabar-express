import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" only for self-hosting (Docker/VPS). On Vercel its native
  // build pipeline is used, so let it fall back to the default output there.
  output: process.env.VERCEL ? undefined : "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    // News images come from many different publisher CDNs — serve them
    // directly for maximum reliability (no optimizer single-point-of-failure).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
