import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // The OG image URL serves the static preview when present and
        // generates on miss, so crawlers must reach /api/og even though
        // the rest of /api/ is closed.
        allow: ["/", "/api/og"],
        disallow: ["/r/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/r/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/r/"],
      },
    ],
    sitemap: "https://sensory-ui.com/sitemap.xml",
    host: "https://sensory-ui.com",
  };
}
