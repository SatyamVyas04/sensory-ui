import type { Metadata } from "next";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { Ideology } from "./_components/ideology";
import { Inspiration } from "./_components/inspiration";
import { Showcase } from "./_components/showcase";
import { WhySound } from "./_components/why-sound";

export const metadata: Metadata = {
  title: {
    absolute: "sensory-ui - Semantic Sound for shadcn/ui",
  },
  description:
    "Sound-enabled shadcn/ui components. Add meaningful audio feedback with a single prop - no audio files required.",
  keywords: [
    "sensory-ui",
    "shadcn sounds",
    "shadcn audio",
    "semantic sound",
    "ui sound effects",
    "react sound components",
    "web audio api react",
  ],
  alternates: {
    canonical: "https://sensory-ui.com",
  },
  openGraph: {
    type: "website",
    url: "https://sensory-ui.com",
    siteName: "sensory-ui",
    title: "sensory-ui - Semantic Sound for shadcn/ui",
    description:
      "Sound-enabled shadcn/ui components. Add meaningful audio feedback with a single prop - no audio files required.",
    images: [
      {
        url: "/api/og?mode=home",
        width: 1200,
        height: 630,
        alt: "sensory-ui - semantic audio feedback for shadcn/ui React components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SatyamVyas04",
    creator: "@SatyamVyas04",
    title: "sensory-ui - Semantic Sound for shadcn/ui",
    description:
      "Sound-enabled shadcn/ui components. Add meaningful audio feedback with a single prop - no audio files required.",
    images: [
      {
        url: "/api/og?mode=home",
        alt: "sensory-ui - semantic audio feedback for shadcn/ui React components",
      },
    ],
  },
};

// Structured data graph: app + publisher + site + FAQ answers so search
// engines and answer engines can quote the project directly.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://sensory-ui.com/#app",
      name: "sensory-ui",
      description:
        "Sound-enabled shadcn/ui components for React and Next.js. Add meaningful audio feedback with a single prop - no audio files required. Web Audio API powered.",
      url: "https://sensory-ui.com",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: { "@id": "https://sensory-ui.com/#person" },
      keywords:
        "sensory-ui, shadcn sounds, shadcn audio, sound react, react audio, ui sound, sound ui, web audio api, semantic sound, audio feedback",
    },
    {
      "@type": "Person",
      "@id": "https://sensory-ui.com/#person",
      name: "Satyam Vyas",
      url: "https://x.com/SatyamVyas04",
    },
    {
      "@type": "WebSite",
      "@id": "https://sensory-ui.com/#website",
      name: "sensory-ui",
      url: "https://sensory-ui.com",
      publisher: { "@id": "https://sensory-ui.com/#person" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://sensory-ui.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is sensory-ui?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "sensory-ui is a set of sound-enabled shadcn/ui components for React and Next.js. Every cue maps to an interaction type across 17 sound roles and 5 categories, synthesized live with the Web Audio API. Zero audio files.",
          },
        },
        {
          "@type": "Question",
          name: "How do I add sound to a shadcn/ui component?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Install a component with the shadcn CLI (npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button), wrap your app in SensoryUIProvider, then pass a sound prop such as sound="interaction.tap". All other props behave exactly like shadcn/ui.',
          },
        },
        {
          "@type": "Question",
          name: "Does sensory-ui need audio files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All sounds are synthesized programmatically with the Web Audio API across 9 sound packs (soft, aero, arcade, organic, glass, industrial, minimal, retro, crisp). Nothing is served from public/ and there are no base64 blobs.",
          },
        },
        {
          "@type": "Question",
          name: "Is sensory-ui accessible?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Sound is opt-in and accessibility-first: per-category kill-switches, volume control, and prefers-reduced-motion support are built in. See the accessibility guide at sensory-ui.com/docs/guides/accessibility.",
          },
        },
      ],
    },
  ],
};

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/SatyamVyas04/sensory-ui",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return (data.stargazers_count as number) ?? 0;
  } catch {
    return null;
  }
}

export default async function Page() {
  const stars = await getStars();

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <main id="main-content">
        <Hero stars={stars} />
        <Showcase />
        <Ideology />
        <WhySound />
        <Inspiration />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
