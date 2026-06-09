import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `output: "export"` — Vercel detects Next.js and handles the build
  // natively (static pages stay static; SSR/ISR available if ever needed).
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
