import { IconBrandGithub, IconBrandX, IconHeart } from "@tabler/icons-react";

export function Footer() {
  return (
    <footer className="border-border border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span className="font-mono text-primary">◉</span>
          <span>sensory-ui</span>
          <span>·</span>
          <span>
            built with{" "}
            <IconHeart
              aria-label="love"
              className="inline size-3 fill-current text-primary"
            />{" "}
            by{" "}
            <a
              className="underline underline-offset-2 hover:text-foreground"
              href="https://github.com/SatyamVyas04"
              rel="noopener noreferrer"
              target="_blank"
            >
              Satyam Vyas
            </a>
          </span>
        </div>

        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <a
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
            href="https://github.com/SatyamVyas04/sensory-ui"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandGithub aria-hidden="true" className="size-4" />
          </a>
          <a
            aria-label="X (Twitter)"
            className="text-muted-foreground transition-colors hover:text-foreground"
            href="https://x.com/SatyamVyas04"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandX aria-hidden="true" className="size-4" />
          </a>
          <span className="text-muted-foreground/60 text-xs">MIT License</span>
        </nav>
      </div>
    </footer>
  );
}
