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

function ogImageFor(title: string, description: string, badge: string) {
  const params = new URLSearchParams({
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
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
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
  const ogImage = ogImageFor(
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
