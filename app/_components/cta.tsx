"use client";

import {
  IconArrowRight,
  IconBrandGithub,
  IconFileText,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function CTA() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="cta-heading"
      className="border-border border-t py-24"
      id="cta"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          className="border border-border p-10 text-center sm:p-16"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          transition={{ duration: 0.55, ease }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Get started
          </span>
          <h2
            className="mt-3 text-balance font-semibold text-3xl sm:text-4xl"
            id="cta-heading"
          >
            Ready to design <span className="text-primary">with sound?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground text-sm/relaxed">
            Add sensory-ui to your Next.js project in under five minutes.
            Configure roles, wire sounds, ship.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <motion.a
              className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
              href="https://github.com/SatyamVyas04/sensory-ui"
              rel="noopener noreferrer"
              target="_blank"
              transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
            >
              <IconBrandGithub aria-hidden="true" className="size-4" />
              View on GitHub
            </motion.a>

            <motion.a
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 font-medium text-sm transition-colors hover:bg-muted/50"
              href="/docs"
              transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
            >
              <IconFileText aria-hidden="true" className="size-4" />
              Read the docs
              <IconArrowRight aria-hidden="true" className="size-3.5" />
            </motion.a>
          </div>

          <p className="mt-6 text-muted-foreground text-xs">
            MIT License · Open source forever
          </p>
        </motion.div>
      </div>
    </section>
  );
}
