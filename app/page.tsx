import type { Metadata } from "next";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { Ideology } from "./_components/ideology";
import { Inspiration } from "./_components/inspiration";
import { Showcase } from "./_components/showcase";

export const metadata: Metadata = {
  title: {
    absolute: "sensory-ui - Semantic Sound for React & Next.js",
  },
};

async function getStars(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/SatyamVyas04/sensory-ui",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return 0;
    }
    const data = await res.json();
    return (data.stargazers_count as number) ?? 0;
  } catch {
    return 0;
  }
}

export default async function Page() {
  const stars = await getStars();

  return (
    <>
      <main id="main-content">
        <Hero stars={stars} />
        <Showcase />
        <Ideology />
        <Inspiration />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
