import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — the repo sits inside a home dir that has its own
  // lockfile, which Turbopack would otherwise pick up.
  turbopack: { root: __dirname },

  // Everything the brand importer writes carries a content hash in its
  // filename, so a given URL can never change. Cache it forever: a repeat
  // visitor pays nothing to open an image, and this applies to any project
  // added later without further thought.
  async headers() {
    return [
      {
        source: "/work/marketing-assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
