"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/sensory-ui/pagination";
import { Separator } from "@/components/ui/separator";
import { DemoCard } from "./demo-card";

export function NavigationControlsDemo() {
  return (
    <DemoCard
      description="Directional movement & pagination sounds"
      icon={<IconArrowsLeftRight className="size-4" />}
      title="Navigation Controls"
    >
      <div className="flex flex-col gap-4">
        {/* Direction buttons */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Direction
          </span>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="sm"
              sound="navigation.backward"
              variant="outline"
            >
              <IconArrowLeft className="size-3.5" />
              Back
            </Button>
            <Button
              className="flex-1"
              size="sm"
              sound="navigation.forward"
              variant="outline"
            >
              Forward
              <IconArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Pagination */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Pagination
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => e.preventDefault()}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  onClick={(e) => e.preventDefault()}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </DemoCard>
  );
}
