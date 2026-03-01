/**
 * sensory-ui Registry Route Handler
 *
 * Serves shadcn-compatible registry-item manifests for each sensory-ui component.
 *
 * Routes:
 *   /r/sensory-ui          → meta-block that references all components
 *   /r/sensory-ui-core     → core sound engine, provider, config, and sound packs
 *   /r/sensory-ui-button   → button wrapper (depends on sensory-ui-core + button)
 *   /r/sensory-ui-dialog   → dialog wrapper (depends on sensory-ui-core + dialog)
 *   ... etc for all 24 components
 *
 * Install via:
 *   npx shadcn@latest add https://sensory-ui.com/r/sensory-ui          # everything
 *   npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-core     # core only
 *   npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-button   # single component
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

const SENSORY_UI_DIR = join(process.cwd(), "components", "ui", "sensory-ui");
const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all .ts/.tsx files from a directory. */
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

/** Map a relative path to a registry file type. */
function registryType(
  relPath: string
): "registry:ui" | "registry:lib" | "registry:hook" {
  if (relPath === "config/use-play-sound.ts") {
    return "registry:hook";
  }
  if (relPath.startsWith("config/") || relPath.startsWith("sounds/")) {
    return "registry:lib";
  }
  return "registry:ui";
}

// ---------------------------------------------------------------------------
// Precompute all files at module scope (build time)
// ---------------------------------------------------------------------------

const allFiles = collectFiles(SENSORY_UI_DIR).map((abs) => {
  const relPath = relative(SENSORY_UI_DIR, abs).replace(/\\/g, "/");
  const target = `components/ui/sensory-ui/${relPath}`;
  return {
    path: target,
    content: readFileSync(abs, "utf-8"),
    type: registryType(relPath),
    target,
    relPath,
  };
});

/* Core files: config/ and sounds/ */
const coreFiles = allFiles
  .filter(
    (f) => f.relPath.startsWith("config/") || f.relPath.startsWith("sounds/")
  )
  .map(({ relPath: _, ...rest }) => rest);

/** UI component files (top-level .tsx files, not in config/ or sounds/) */
const componentFileMap = new Map<string, (typeof allFiles)[number]>();
for (const f of allFiles) {
  if (!f.relPath.includes("/") && f.relPath.endsWith(".tsx")) {
    // e.g. "button.tsx" → "button"
    const name = f.relPath.replace(/\.tsx$/, "");
    componentFileMap.set(name, f);
  }
}

/** All component names */
const componentNames = Array.from(componentFileMap.keys());

// ---------------------------------------------------------------------------
// Registry item builders
// ---------------------------------------------------------------------------

function buildCoreItem() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "sensory-ui-core",
    type: "registry:block",
    title: "sensory-ui-core",
    description:
      "Core sound engine, provider, config, and sound packs for sensory-ui.",
    files: coreFiles,
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
  };
}

function buildComponentItem(componentName: string) {
  const file = componentFileMap.get(componentName);
  if (!file) {
    return null;
  }

  const { relPath: _, ...fileData } = file;
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `sensory-ui-${componentName}`,
    type: "registry:ui",
    title: `Sensory ${componentName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    description: `${componentName.replace(/-/g, " ")} with sound support.`,
    files: [fileData],
    registryDependencies: ["sensory-ui-core", componentName],
  };
}

function buildMetaItem() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "sensory-ui",
    type: "registry:block",
    title: "sensory-ui",
    description:
      "Install all sensory-ui components at once. Semantic, opt-in sound layer for shadcn/ui.",
    files: [],
    dependencies: [],
    devDependencies: [],
    registryDependencies: [
      "sensory-ui-core",
      ...componentNames.map((n) => `sensory-ui-${n}`),
    ],
  };
}

// ---------------------------------------------------------------------------
// Pre-build all items at module scope (build time)
// ---------------------------------------------------------------------------

const registryItems = new Map<string, object>();

// Meta-block: /r/sensory-ui
registryItems.set("sensory-ui", buildMetaItem());

// Core: /r/sensory-ui-core
registryItems.set("sensory-ui-core", buildCoreItem());

// Individual components: /r/sensory-ui-button, /r/sensory-ui-dialog, etc.
for (const name of componentNames) {
  const item = buildComponentItem(name);
  if (item) {
    registryItems.set(item.name, item);
  }
}

// ---------------------------------------------------------------------------
// Static params + request handler
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Array.from(registryItems.keys()).map((name) => ({ name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const item = registryItems.get(name);
  if (!item) {
    return NextResponse.json(
      { error: `Registry item "${name}" not found` },
      { status: 404 }
    );
  }
  return NextResponse.json(item);
}
