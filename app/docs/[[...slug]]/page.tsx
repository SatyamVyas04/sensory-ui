import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/glass/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

const SITE_URL = "https://sensory-ui.com";

const SECTION_LABELS: Record<string, string> = {
  "getting-started": "Getting started",
  core: "Core",
  components: "Components",
  blocks: "Blocks",
  guides: "Guides",
};

function sectionLabel(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return "Docs";
  }
  return SECTION_LABELS[slug[0]] ?? "Docs";
}

function ogImageFor(
  file: string,
  title: string,
  description: string,
  badge: string
) {
  const params = new URLSearchParams({
    file,
    mode: "docs",
    badge,
    title,
    description,
  });
  return `/api/og?${params.toString()}`;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const url = `${SITE_URL}${page.url}`;
  // Docs landing: title only, no description line, tightened spacing.
  // Frontmatter description stays for SEO metadata + OG images.
  const isDocsHome = !params.slug || params.slug.length === 0;
  // Installation guide doubles as a HowTo so answer engines can quote
  // the setup steps directly.
  const isInstallPage =
    (params.slug ?? []).join("/") === "getting-started/installation";

  // Per-page structured data: article for search, breadcrumbs for
  // rich results. Kept textual, with no image dependencies.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: page.data.title,
        description: page.data.description,
        url,
        author: {
          "@type": "Person",
          name: "Satyam Vyas",
          url: "https://x.com/SatyamVyas04",
        },
        publisher: {
          "@type": "Organization",
          name: "sensory-ui",
          url: SITE_URL,
        },
        mainEntityOfPage: url,
      },
      ...(isInstallPage
        ? [
            {
              "@type": "HowTo",
              name: "How to install sensory-ui",
              description:
                "Install sensory-ui with the shadcn CLI, wrap your app in SensoryUIProvider, and pass a sound prop to any component.",
              totalTime: "PT10M",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Install one component",
                  text: "Run npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button. This pulls the core engine plus the Button.",
                },
                {
                  "@type": "HowToStep",
                  name: "Choose a sound pack",
                  text: "Pass a theme to the provider, for example config={{ theme: 'arcade' }}. The default pack is aero.",
                },
                {
                  "@type": "HowToStep",
                  name: "Wrap the app in SensoryUIProvider",
                  text: "Wrap the component tree in SensoryUIProvider so the AudioContext persists and playSound is available.",
                },
                {
                  "@type": "HowToStep",
                  name: "Pass a sound prop",
                  text: 'Use any component with a sound prop, for example <Button sound="interaction.tap">. All other props match shadcn/ui.',
                },
                {
                  "@type": "HowToStep",
                  name: "Verify installation",
                  text: "Click the component after a user gesture. Browsers suspend AudioContext until interaction; the engine resumes it on first playSound call.",
                },
              ],
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Docs",
            item: `${SITE_URL}/docs`,
          },
          ...(params.slug ?? []).map((segment, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name:
              index === 0
                ? (SECTION_LABELS[segment] ?? segment)
                : page.data.title,
            item:
              index === (params.slug?.length ?? 0) - 1
                ? url
                : `${SITE_URL}/docs/${(params.slug ?? []).slice(0, index + 1).join("/")}`,
          })),
        ],
      },
    ],
  };

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <DocsTitle className={isDocsHome ? "mb-4" : undefined}>
        {page.data.title}
      </DocsTitle>
      {isDocsHome ? null : (
        <DocsDescription>{page.data.description}</DocsDescription>
      )}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const url = `${SITE_URL}${page.url}`;
  const badge = sectionLabel(params.slug);
  // Single image URL per page: the route serves the checked-in static
  // preview when it exists, otherwise generates the card on the fly.
  const slug = params.slug ?? [];
  const file = `og-${slug.length === 0 ? "docs-index" : slug.join("-")}.png`;
  const ogImage = ogImageFor(
    file,
    page.data.title,
    page.data.description ?? "",
    badge
  );

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: `${page.data.title} - sensory-ui ${badge}`,
      description: page.data.description,
      siteName: "sensory-ui",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${page.data.title} - sensory-ui docs`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@SatyamVyas04",
      creator: "@SatyamVyas04",
      title: `${page.data.title} - sensory-ui ${badge}`,
      description: page.data.description,
      images: [
        {
          url: ogImage,
          alt: `${page.data.title} - sensory-ui docs`,
        },
      ],
    },
  };
}
