import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
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
  };
}
