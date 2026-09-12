import type { MetadataRoute } from "next";

const baseUrl = "https://sensory-ui.com";

const docsPages = [
  "getting-started/installation",
  "getting-started/configuration",
  "concepts/overview",
  "concepts/sound-roles",
  "concepts/sound-packs",
  "concepts/engine",
  "concepts/provider",
  "components",
  "guides/custom-sounds",
  "guides/accessibility",
  "registry",
  "testing",
];

const componentPages = [
  "accordion",
  "alert-dialog",
  "button",
  "carousel",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "radio-group",
  "select",
  "sheet",
  "sidebar",
  "slider",
  "switch",
  "tabs",
  "toggle",
  "toggle-group",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const docsUrls = docsPages.map((page) => ({
    url: `${baseUrl}/docs/${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const componentUrls = componentPages.map((page) => ({
    url: `${baseUrl}/docs/components/${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docsUrls,
    ...componentUrls,
  ];
}
