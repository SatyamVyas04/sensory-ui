import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-border border-t px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Image
            alt=""
            aria-hidden="true"
            className="size-5 dark:invert"
            height={20}
            src="/icon-64.png"
            width={20}
          />
          <span className="font-medium text-foreground">sensory-ui</span>
          <span className="text-muted-foreground">·</span>
          <span>
            by{" "}
            <a
              className="underline underline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="https://github.com/SatyamVyas04"
              rel="noopener noreferrer"
              target="_blank"
            >
              Satyam Vyas
            </a>
          </span>
        </div>

        <nav aria-label="Footer navigation" className="flex items-center gap-5">
          <a
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href="https://github.com/SatyamVyas04/sensory-ui"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandGithub aria-hidden="true" className="size-4.5" />
          </a>
          <a
            aria-label="X (Twitter)"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href="https://x.com/SatyamVyas04"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandX aria-hidden="true" className="size-4.5" />
          </a>
          <span className="text-muted-foreground text-xs">MIT License</span>
        </nav>
      </div>
    </footer>
  );
}
