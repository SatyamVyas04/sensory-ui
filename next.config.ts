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

export default withMDX(nextConfig);
