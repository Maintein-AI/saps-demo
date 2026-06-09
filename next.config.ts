import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint is not installed in this project; skip it during builds so
    // `next build` doesn't emit the "ESLint must be installed" notice.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
