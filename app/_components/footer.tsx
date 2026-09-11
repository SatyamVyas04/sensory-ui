"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { ShaderBackground } from "@/components/ui/waves-shader";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground">
      {/* Waves shader background */}
      <div className="pointer-events-none absolute inset-0">
        <ShaderBackground className="h-full w-full dark:rotate-180" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="h-full w-full bg-gradient-to-b from-background via-background/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: conversational title + repo link */}
        <div className="flex flex-col gap-6 pt-16 sm:flex-row sm:items-start sm:justify-between sm:pt-20">
          <p className="max-w-sm font-pixel text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
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
            Let's collaborate
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Giant branding text */}
        <div className="mt-16 sm:mt-24">
          <p className="select-none text-right font-pixel text-[14vw] text-background leading-none tracking-tight sm:text-[12vw] dark:text-foreground">
            sensory-ui
          </p>
        </div>

        {/* Bottom: links + copyright */}
        <div className="flex flex-col items-start justify-between gap-4 border-background/15 border-t py-6 sm:flex-row sm:items-center dark:border-foreground/15">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-background/50 text-xs dark:text-foreground/50">
            <Link
              className="transition-colors hover:text-background dark:hover:text-foreground"
              href="https://github.com/SatyamVyas04/sensory-ui#readme"
              onClick={() =>
                posthog.capture("footer_link_clicked", { link: "docs" })
              }
            >
              Docs
            </Link>
            <Link
              className="transition-colors hover:text-background dark:hover:text-foreground"
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
              className="transition-colors hover:text-background dark:hover:text-foreground"
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
          <p className="text-background/30 text-xs dark:text-foreground/30">
            &copy; {new Date().getFullYear()} sensory-ui. Built by{" "}
            <a
              className="underline underline-offset-2 transition-colors hover:text-background dark:hover:text-foreground"
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
          </p>
        </div>
      </div>
    </footer>
  );
}
