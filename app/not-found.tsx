import Link from "next/link";
import { ShaderBackground } from "@/components/ui/waves-shader";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-foreground">
      <div className="pointer-events-none absolute inset-0">
        <ShaderBackground className="h-full w-full dark:rotate-180" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="h-full w-full bg-gradient-to-b from-background via-background/25 to-transparent dark:to-background/60" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <p className="select-none font-serif text-8xl text-white leading-none tracking-tight sm:text-9xl">
          404
        </p>
        <p className="max-w-sm font-serif text-2xl text-white/80 leading-snug sm:text-3xl">
          This page wandered off.
          <br />
          Let&apos;s get you back.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="border border-white/30 px-4 py-2 font-mono text-white text-xs uppercase tracking-wide transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            href="/"
          >
            Home
          </Link>
          <Link
            className="border border-white/30 px-4 py-2 font-mono text-white text-xs uppercase tracking-wide transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            href="/docs"
          >
            Docs
          </Link>
          <a
            className="border border-white/30 px-4 py-2 font-mono text-white text-xs uppercase tracking-wide transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            href="https://github.com/SatyamVyas04/sensory-ui"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            className="border border-white/30 px-4 py-2 font-mono text-white text-xs uppercase tracking-wide transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            href="https://x.com/SatyamVyas04"
            rel="noopener noreferrer"
            target="_blank"
          >
            X / Twitter
          </a>
        </div>

        <p className="mt-8 text-white/40 text-xs">
          &copy; {new Date().getFullYear()} sensory-ui
        </p>
      </div>
    </div>
  );
}
