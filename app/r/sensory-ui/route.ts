import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

const SENSORY_UI_DIR = join(
  process.cwd(),
  "components",
  "ui",
  "sensory-ui"
);

const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx"]);

/** Recursively collect all .ts/.tsx files from a directory */
function collectFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full));
    } else if (ALLOWED_EXTENSIONS.has(entry.slice(entry.lastIndexOf(".")))) {
      results.push(full);
    }
  }
  return results;
}

/** Determine registry type from relative path */
function registryType(relPath: string): "registry:ui" | "registry:lib" {
  if (relPath.startsWith("config/") || relPath.startsWith("sounds/")) {
    return "registry:lib";
  }
  return "registry:ui";
}

/** Precompute registry files at module scope — read once, serve on every request */
const files = collectFiles(SENSORY_UI_DIR).map((abs) => {
  const relPath = relative(SENSORY_UI_DIR, abs);
  const target = `components/ui/sensory-ui/${relPath}`;
  return {
    path: target,
    content: readFileSync(abs, "utf-8"),
    type: registryType(relPath),
    target,
  };
});

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

export function GET() {
  return NextResponse.json(registry);
}
