"use client";

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  stars: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar({ stars }: NavbarProps) {
  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-primary focus:px-3 focus:py-1.5 focus:font-medium focus:text-primary-foreground focus:text-xs focus-visible:ring-2 focus-visible:ring-ring"
        href="#main-content"
      >
        Skip to main content
      </a>

      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 right-0 left-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            className="flex items-center gap-2 font-medium text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-5 dark:invert"
              height={20}
              src="/icon-64.png"
              width={20}
            />
            <span>sensory-ui</span>
          </Link>

          <nav aria-label="Site links" className="flex items-center gap-2">
            <a
              className="flex items-center gap-1.5 rounded-none border border-border px-2.5 py-1 text-foreground/70 text-xs transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="https://github.com/SatyamVyas04/sensory-ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandGithub aria-hidden="true" className="size-3.5" />
              <span>GitHub</span>
              {stars > 0 && (
                <span className="text-muted-foreground tabular-nums">
                  {stars}
                </span>
              )}
            </a>

            <a
              aria-label="Twitter/X — @SatyamVyas04"
              className="flex size-8 items-center justify-center text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="https://x.com/SatyamVyas04"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandX aria-hidden="true" className="size-4" />
            </a>
          </nav>
        </div>
      </motion.header>
    </>
  );
}
