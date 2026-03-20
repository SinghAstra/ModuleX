import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ["@repo/common", "@repo/db"],
};

export default nextConfig;
