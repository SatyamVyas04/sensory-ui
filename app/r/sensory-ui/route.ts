import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

const SENSORY_UI_DIR = join(
  process.cwd(),
  "components",
  "ui",
  "sensory-ui"
);

/** Registry file entry with type metadata */
interface RegistryFile {
  path: string;
  type: "registry:ui" | "registry:lib";
  target: string;
}

/** All files included in the sensory-ui registry */
const REGISTRY_FILES: RegistryFile[] = [
  // Config layer
  { path: "config/engine.ts", type: "registry:lib", target: "components/ui/sensory-ui/config/engine.ts" },
  { path: "config/provider.tsx", type: "registry:lib", target: "components/ui/sensory-ui/config/provider.tsx" },
  { path: "config/config.ts", type: "registry:lib", target: "components/ui/sensory-ui/config/config.ts" },
  { path: "config/sound-roles.ts", type: "registry:lib", target: "components/ui/sensory-ui/config/sound-roles.ts" },
  { path: "config/registry.ts", type: "registry:lib", target: "components/ui/sensory-ui/config/registry.ts" },
  { path: "config/use-play-sound.ts", type: "registry:lib", target: "components/ui/sensory-ui/config/use-play-sound.ts" },

  // Sound system
  { path: "sounds/index.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/index.ts" },
  { path: "sounds/packs.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/packs.ts" },
  { path: "sounds/core/index.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/core/index.ts" },
  { path: "sounds/core/tunes.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/core/tunes.ts" },
  { path: "sounds/core/instruments.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/core/instruments.ts" },
  { path: "sounds/core/factory.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/core/factory.ts" },
  { path: "sounds/core/pack-generator.ts", type: "registry:lib", target: "components/ui/sensory-ui/sounds/core/pack-generator.ts" },

  // UI Components
  { path: "accordion.tsx", type: "registry:ui", target: "components/ui/sensory-ui/accordion.tsx" },
  { path: "alert-dialog.tsx", type: "registry:ui", target: "components/ui/sensory-ui/alert-dialog.tsx" },
  { path: "button.tsx", type: "registry:ui", target: "components/ui/sensory-ui/button.tsx" },
  { path: "carousel.tsx", type: "registry:ui", target: "components/ui/sensory-ui/carousel.tsx" },
  { path: "checkbox.tsx", type: "registry:ui", target: "components/ui/sensory-ui/checkbox.tsx" },
  { path: "collapsible.tsx", type: "registry:ui", target: "components/ui/sensory-ui/collapsible.tsx" },
  { path: "command.tsx", type: "registry:ui", target: "components/ui/sensory-ui/command.tsx" },
  { path: "context-menu.tsx", type: "registry:ui", target: "components/ui/sensory-ui/context-menu.tsx" },
  { path: "dialog.tsx", type: "registry:ui", target: "components/ui/sensory-ui/dialog.tsx" },
  { path: "drawer.tsx", type: "registry:ui", target: "components/ui/sensory-ui/drawer.tsx" },
  { path: "dropdown-menu.tsx", type: "registry:ui", target: "components/ui/sensory-ui/dropdown-menu.tsx" },
  { path: "menubar.tsx", type: "registry:ui", target: "components/ui/sensory-ui/menubar.tsx" },
  { path: "navigation-menu.tsx", type: "registry:ui", target: "components/ui/sensory-ui/navigation-menu.tsx" },
  { path: "pagination.tsx", type: "registry:ui", target: "components/ui/sensory-ui/pagination.tsx" },
  { path: "popover.tsx", type: "registry:ui", target: "components/ui/sensory-ui/popover.tsx" },
  { path: "radio-group.tsx", type: "registry:ui", target: "components/ui/sensory-ui/radio-group.tsx" },
  { path: "select.tsx", type: "registry:ui", target: "components/ui/sensory-ui/select.tsx" },
  { path: "sheet.tsx", type: "registry:ui", target: "components/ui/sensory-ui/sheet.tsx" },
  { path: "sidebar.tsx", type: "registry:ui", target: "components/ui/sensory-ui/sidebar.tsx" },
  { path: "slider.tsx", type: "registry:ui", target: "components/ui/sensory-ui/slider.tsx" },
  { path: "switch.tsx", type: "registry:ui", target: "components/ui/sensory-ui/switch.tsx" },
  { path: "tabs.tsx", type: "registry:ui", target: "components/ui/sensory-ui/tabs.tsx" },
  { path: "toggle-group.tsx", type: "registry:ui", target: "components/ui/sensory-ui/toggle-group.tsx" },
  { path: "toggle.tsx", type: "registry:ui", target: "components/ui/sensory-ui/toggle.tsx" },
];

export function GET() {
  const files = REGISTRY_FILES.map((entry) => ({
    path: entry.target,
    content: readFileSync(join(SENSORY_UI_DIR, entry.path), "utf-8"),
    type: entry.type,
    target: entry.target,
  }));

  const registry = {
    name: "sensory-ui",
    type: "registry:ui",
    description:
      "Semantic, opt-in sound layer for shadcn/ui components. 19 sound roles, 9 sound packs, zero dependencies.",
    files,
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
  };

  return NextResponse.json(registry);
}
