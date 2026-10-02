import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          <Image
            alt="sensory-ui"
            className="size-6 rounded-full"
            height={24}
            src="/sensory-ui-logo-small.svg"
            style={{
              filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.35))",
            }}
            width={24}
          />
          sensory-ui
        </span>
      ),
    },
    githubUrl: "https://github.com/SatyamVyas04/sensory-ui",
  };
}
