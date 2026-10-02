import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "sensory-ui - Semantic Sound for shadcn/ui",
    short_name: "sensory-ui",
    description:
      "Sound-enabled shadcn/ui components. Add meaningful audio feedback with a single prop.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a10",
    theme_color: "#0b0a10",
    icons: [
      {
        src: "/sensory-ui-logo-small.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/sensory-ui-logo-large.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
