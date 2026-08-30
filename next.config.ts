import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — the repo sits inside a home dir that has its own
  // lockfile, which Turbopack would otherwise pick up.
  turbopack: { root: __dirname },
};

export default nextConfig;
