"use client";

import {
  IconArrowRight,
  IconBrandGithub,
  IconFileText,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/sensory-ui/button";

const ease = [0.32, 0.72, 0, 1] as const;

export function CTA() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="cta-heading"
      className="border-border border-t py-24"
      id="cta"
    >
      <div className="relative mx-auto max-w-7xl border border-border px-4 sm:px-6">
        <Image
          alt="CTA Background"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-15"
          fill
          src="/dither/cta-dither.png"
        />
        <motion.div
          className="relative z-10 p-12 text-center sm:p-16"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          transition={{ duration: 0.25, ease }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Get started
          </span>
          <h2
            className="mt-3 text-balance font-pixel text-3xl sm:text-4xl"
            id="cta-heading"
          >
            Give your UI a <span className="text-primary">voice.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground text-sm/relaxed">
            Add sensory-ui to your Next.js project in under 5 minutes. <br />
            Configure. Wire. Ship.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="gap-2"
              size="default"
              sound="interaction.tap"
            >
              <Link
                href="https://github.com/SatyamVyas04/sensory-ui"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconBrandGithub aria-hidden="true" className="size-4" />
                View on GitHub
              </Link>
            </Button>

            <Button
              asChild
              className="gap-2"
              size="default"
              sound="navigation.forward"
              variant="outline"
            >
              <Link href="/docs">
                <IconFileText aria-hidden="true" className="size-4" />
                Read the docs
                <IconArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-muted-foreground text-sm">
            MIT License · Open source forever
          </p>
        </motion.div>
      </div>
    </section>
  );
}
