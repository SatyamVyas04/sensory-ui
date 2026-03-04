# sensory-ui

A semantic, opt-in sound layer for React and Next.js apps. Add meaningful audio feedback to UI interactions with 17 sound roles across 24 components — built for [shadcn/ui](https://ui.shadcn.com).

## Quick Install

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui
```

Or install individual pieces:

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-core    # core engine only
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-button   # single component
```

## Setup

Wrap your app with `SensoryUIProvider`:

```tsx
// app/layout.tsx
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SensoryUIProvider>
          {children}
        </SensoryUIProvider>
      </body>
    </html>
  );
}
```

Use the sound-enabled components:

```tsx
import { Button } from "@/components/ui/sensory-ui/button";

export function SaveButton() {
  return <Button sound="interaction.tap">Save</Button>;
}
```

## Project Structure

```
sensory-ui/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout (providers, metadata, fonts)
│   ├── page.tsx                    # Landing page (server component)
│   ├── globals.css                 # Global styles (Tailwind v4)
│   ├── r/[name]/route.ts           # Registry API (serves component manifests)
│   └── _components/                # Landing page sections
│       ├── hero.tsx                # Hero with install command
│       ├── showcase.tsx            # Interactive component demos
│       ├── ideology.tsx            # Design philosophy
│       ├── inspiration.tsx         # Sound role explorer
│       ├── cta.tsx                 # Call-to-action
│       └── footer.tsx              # Site footer (server component)
├── components/
│   ├── theme-provider.tsx          # next-themes wrapper
│   └── ui/
│       ├── sensory-ui/             # Sound-enabled components
│       │   ├── config/             # Core engine layer
│       │   │   ├── engine.ts       # Web Audio API engine (singleton AudioContext)
│       │   │   ├── provider.tsx    # SensoryUIProvider (React context)
│       │   │   ├── config.ts       # Config types, defaults, mergeConfig, resolveRole
│       │   │   ├── sound-roles.ts  # 17 sound role type definitions
│       │   │   ├── registry.ts     # Pack name → SoundPack mapping
│       │   │   └── use-play-sound.ts # usePlaySound() hook
│       │   ├── sounds/             # Audio synthesis
│       │   │   ├── core/           # Tune + instrument → synthesizer system
│       │   │   │   ├── tunes.ts        # Musical content (frequencies, durations)
│       │   │   │   ├── instruments.ts  # 9 instrument configs (oscillator, filter, envelope)
│       │   │   │   ├── factory.ts      # Combines tunes + instruments → synthesizers
│       │   │   │   └── pack-generator.ts # Generates full packs from instruments
│       │   │   └── packs.ts        # All 9 sound packs + custom hero sounds
│       │   └── *.tsx               # 24 patched components (button, dialog, tabs…)
│       └── *.tsx                   # Base shadcn/ui components (unmodified)
├── hooks/
│   └── use-mobile.ts               # Mobile breakpoint hook
├── lib/
│   └── utils.ts                    # cn() utility (clsx + tailwind-merge)
├── plan/                           # Architecture documentation
│   ├── overview.md                 # Project overview and file structure
│   ├── engine.md                   # Web Audio engine spec
│   ├── provider.md                 # React provider architecture
│   ├── sound-roles.md              # Sound categories and roles
│   ├── components.md               # Component API and sound prop usage
│   ├── config.md                   # Configuration system
│   ├── registry.md                 # shadcn registry distribution
│   ├── sound-packs.md              # Per-pack sound design
│   ├── installation.md             # Installation flow
│   └── testing.md                  # Testing guide
└── public/                         # Static assets (icons, images)
```

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Framework |
| [React 19](https://react.dev) | UI library |
| [TypeScript 5.9](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) | Base components |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Sound synthesis (no audio files) |
| [Motion](https://motion.dev) (Framer Motion) | Animations |
| [Geist](https://vercel.com/font) | Typography |
| [Biome](https://biomejs.dev) / [Ultracite](https://github.com/haydenbleasel/ultracite) | Linting and formatting |

## Sound System

**17 semantic roles** across 5 categories:

| Category | Roles | Use Case |
|---|---|---|
| `interaction` | `tap`, `subtle`, `toggle`, `confirm` | Direct user actions |
| `overlay` | `open`, `close`, `expand`, `collapse` | Surface state changes |
| `navigation` | `forward`, `backward`, `tab` | Spatial movement |
| `notification` | `info`, `success`, `warning`, `error` | System messages |
| `hero` | `complete`, `milestone` | Celebratory moments (disabled by default) |

**9 sound packs:** `soft`, `aero` (default), `arcade`, `organic`, `glass`, `industrial`, `minimal`, `retro`, `crisp`

All sounds are synthesized at runtime via the Web Audio API — no audio files, no base64 blobs, no network requests.

## Configuration

```tsx
<SensoryUIProvider config={{
  theme: "arcade",           // Sound pack
  volume: 0.5,               // Master volume (0–1)
  categories: {
    interaction: true,
    notification: true,
    hero: false,              // Disabled by default
  },
  reducedMotion: "inherit",   // Respects prefers-reduced-motion
}}>
```

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run check     # Lint and format check (Biome/Ultracite)
npm run fix       # Auto-fix lint and format issues
```

## Accessibility

- Respects `prefers-reduced-motion` (suppresses sounds when enabled)
- Global kill-switch via `enabled: false` config
- Per-category toggles to disable sound groups
- Every audio cue has a visual equivalent — sound enhances, never replaces
- `sound={false}` on any component to opt out

## License

MIT
