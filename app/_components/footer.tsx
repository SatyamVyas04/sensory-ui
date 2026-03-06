"use client";

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

export function Footer() {
  return (
    <footer className="border-border border-t bg-muted/20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              className="inline-flex items-center gap-2.5 font-semibold text-base transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="/"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="size-7 rounded-sm border border-border"
                height={256}
                src="/icon-256.png"
                width={256}
              />
              <span>sensory-ui</span>
            </Link>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Semantic audio feedback for shadcn/ui using a single prop.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation" className="lg:pl-12">
            <h3 className="font-semibold text-sm">Resources</h3>
            <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="https://github.com/SatyamVyas04/sensory-ui#readme"
                  onClick={() =>
                    posthog.capture("footer_link_clicked", { link: "docs" })
                  }
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="/components"
                  onClick={() =>
                    posthog.capture("footer_link_clicked", {
                      link: "components",
                    })
                  }
                >
                  Components
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-foreground"
                  href="/examples"
                  onClick={() =>
                    posthog.capture("footer_link_clicked", { link: "examples" })
                  }
                >
                  Examples
                </Link>
              </li>
            </ul>
          </nav>

          {/* Socials */}
          <div className="lg:pl-12">
            <h3 className="font-semibold text-sm">Connect</h3>
            <div className="mt-4 flex items-center gap-4">
              <a
                aria-label="GitHub"
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="https://github.com/SatyamVyas04/sensory-ui"
                onClick={() =>
                  posthog.capture("footer_link_clicked", { link: "github" })
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandGithub aria-hidden="true" className="size-5" />
              </a>
              <a
                aria-label="X (Twitter)"
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="https://x.com/SatyamVyas04"
                onClick={() =>
                  posthog.capture("footer_link_clicked", { link: "twitter" })
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandX aria-hidden="true" className="size-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-border border-t pt-8">
          <p className="text-muted-foreground text-xs">
            <span>&copy; {new Date().getFullYear()} sensory-ui. </span>
            <span>
              Built by{" "}
              <a
                className="underline underline-offset-2 transition-colors hover:text-foreground"
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
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
