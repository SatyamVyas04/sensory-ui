const SITE_URL = "https://sensory-ui.com";

const INTRO = `sensory-ui: semantic sound for shadcn/ui components.

Sound-enabled React components: pass a single "sound" prop to play a
meaningful audio cue. 17 sound roles across 5 categories, 9 sound packs,
24 components. Synthesized live with the Web Audio API. Zero audio files.
Accessibility-first: opt-in sounds, per-category kill-switches, volume
control, prefers-reduced-motion support.

Install: npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button
Docs: ${SITE_URL}/docs
GitHub: https://github.com/SatyamVyas04/sensory-ui`;

/**
 * Plain-text site map for answer engines and LLM crawlers (GEO/AEO).
 * Served at /llms.txt, the one route every AI agent is taught to read.
 */
export async function GET() {
  const { source } = await import("@/lib/source");
  const pages = source.getPages();

  const lines = pages.map((page) => {
    const description = page.data.description?.trim() || page.data.title;
    return `- [${page.data.title}](${SITE_URL}${page.url}): ${description}`;
  });

  const body = `${INTRO}\n\n## Docs\n\n${lines.join("\n")}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
