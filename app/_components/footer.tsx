"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import posthog from "posthog-js";
import { ShaderBackground } from "@/components/ui/waves-shader";

const THEMES = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "System" },
] as const;

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Sun"
      className={className}
      fill="none"
      role="img"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Moon"
      className={className}
      fill="none"
      role="img"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="System"
      className={className}
      fill="none"
      role="img"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

const ICONS = [SunIcon, MoonIcon, SystemIcon] as const;

export function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="relative max-h-225 bg-foreground">
      {/* Waves shader background */}
      <div className="pointer-events-none absolute inset-0">
        <ShaderBackground className="h-full w-full dark:rotate-180" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="h-full w-full bg-gradient-to-b from-background via-background/25 to-transparent dark:to-background/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: conversational title + repo link */}
        <div className="flex flex-col gap-6 pt-16 sm:flex-row sm:items-start sm:justify-between sm:pt-20">
          <p className="max-w-sm font-serif text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
            Ready to make
            <br />
            some noise?
          </p>
          <Link
            className="inline-flex w-fit items-center gap-1.5 border border-foreground/30 px-3 py-1.5 font-mono text-foreground text-xs uppercase tracking-wide transition-colors hover:bg-foreground/10 sm:text-sm"
            href="https://github.com/SatyamVyas04/sensory-ui"
            onClick={() =>
              posthog.capture("footer_link_clicked", { link: "github" })
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            Let&apos;s collaborate
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Giant branding text */}
        <div className="mt-16 sm:mt-24">
          <p className="select-none text-right font-serif text-7xl text-white leading-none tracking-tight sm:text-8xl md:text-9xl lg:text-[200px]">
            sensory-ui
          </p>
        </div>

        {/* Bottom: links + theme toggle + copyright */}
        <div className="flex flex-col items-start justify-between gap-4 border-white/15 border-t py-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/60 text-xs">
            <Link
              className="transition-colors hover:text-white"
              href="https://github.com/SatyamVyas04/sensory-ui#readme"
              onClick={() =>
                posthog.capture("footer_link_clicked", { link: "docs" })
              }
            >
              Docs
            </Link>
            <Link
              className="transition-colors hover:text-white"
              href="https://github.com/SatyamVyas04/sensory-ui"
              onClick={() =>
                posthog.capture("footer_link_clicked", { link: "github" })
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
            <a
              className="transition-colors hover:text-white"
              href="https://x.com/SatyamVyas04"
              onClick={() =>
                posthog.capture("footer_link_clicked", { link: "twitter" })
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              X / Twitter
            </a>
          </div>

          <p className="flex items-center gap-2 text-white/40 text-xs">
            &copy; {new Date().getFullYear()} sensory-ui. Built by{" "}
            <a
              className="-translate-x-1 underline underline-offset-2 transition-colors hover:text-white"
              href="https://github.com/SatyamVyas04"
              onClick={() =>
                posthog.capture("footer_brand_clicked", {
                  link: "author_github",
                })
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              Satyam
            </a>
            {/* Theme toggle pill */}
            <div className="group flex items-center gap-0 rounded-full border border-white/20 bg-white/5 p-1 transition-all hover:border-white/30 hover:bg-white/10">
              {THEMES.map((t, i) => {
                const Icon = ICONS[i];
                const isActive = theme === t.value;
                return (
                  <button
                    aria-label={`Switch to ${t.label} mode`}
                    className={`relative z-0 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                      isActive
                        ? "z-10 scale-110 bg-white text-black"
                        : "text-white/50 hover:text-white/80 group-hover:scale-100"
                    } ${isActive ? "" : "group-hover:scale-90"}`}
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    style={{
                      marginLeft: i > 0 ? "-1px" : undefined,
                    }}
                    type="button"
                  >
                    <Icon className="h-3 w-3" />
                  </button>
                );
              })}
            </div>
          </p>
        </div>
      </div>
    </footer>
  );
}
