import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/docs/concepts/:slug*",
      destination: "/docs/core/:slug*",
      permanent: true,
    },
    {
      source: "/docs/registry",
      destination: "/docs/core/registry",
      permanent: true,
    },
    {
      source: "/docs/testing",
      destination: "/docs/core/testing",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ],
};

const withMDX = createMDX();

const config = withMDX(nextConfig);

// fumadocs-mdx@15 injects `turbopack.rules` using `condition.query`, which
// Next 16.1's config validator rejects ("Unrecognized key(s) in object").
// This project builds and serves with webpack (see the `--webpack` flags in
// package.json scripts), so the turbopack section is inert — empty it to
// silence the warning. If those flags are ever removed, restore this:
// Turbopack needs those rules to load .mdx and meta .json/.yaml files.
config.turbopack = {};

export default config;
