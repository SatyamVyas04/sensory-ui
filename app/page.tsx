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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "sensory-ui",
  description:
    "Sound-enabled shadcn/ui components for React and Next.js. Add meaningful audio feedback with a single prop - no audio files required. Web Audio API powered.",
  url: "https://sensory-ui.com",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Satyam Vyas",
    url: "https://x.com/SatyamVyas04",
  },
  keywords:
    "sensory-ui, shadcn sounds, shadcn audio, sound react, react audio, ui sound, sound ui, web audio api, semantic sound, audio feedback",
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
