import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const baseUrl = "https://sensory-ui.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docsUrls: MetadataRoute.Sitemap = pages.map((page) => {
    const depth = page.slugs.length;
    return {
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      // Section indexes rank above leaf pages.
      priority: (depth <= 1 ? 0.8 : 0.7) as 0.8 | 0.7,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docsUrls,
  ];
}
