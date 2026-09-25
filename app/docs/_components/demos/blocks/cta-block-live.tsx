"use client";

import { IconArrowRight, IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";

export function CtaBlockLive() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button sound="interaction.subtle" variant="outline">
          Learn more
        </Button>
        <Button className="gap-2" sound="interaction.confirm">
          Get started
          <IconArrowRight className="size-4" />
        </Button>
      </div>
      <Button className="gap-2" sound="interaction.tap" variant="ghost">
        <IconDownload className="size-4" />
        Download
      </Button>
    </div>
  );
}
