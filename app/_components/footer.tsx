import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border border-t py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Link
              className="inline-flex items-center gap-2.5 font-semibold text-base transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="/"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="size-8 rounded-sm border border-border"
                height={256}
                src="/icon-256.png"
                width={256}
              />
              <span>sensory-ui</span>
            </Link>
            <p className="mt-2 text-muted-foreground text-sm">
              Semantic audio feedback for shadcn/ui. <br />
              Using a single prop.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="mb-4 font-bold">Resources</h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li className="hover:text-foreground">
                <Link href="/docs">Documentation</Link>
              </li>
              <li className="hover:text-foreground">
                <Link href="/components">Components</Link>
              </li>
              <li className="hover:text-foreground">
                <Link href="/examples">Examples</Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="mb-4 font-bold">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  href="https://github.com/SatyamVyas04/sensory-ui"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconBrandGithub aria-hidden="true" className="size-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  href="https://x.com/SatyamVyas04"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconBrandX aria-hidden="true" className="size-4" />
                  <span>X (Twitter)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
