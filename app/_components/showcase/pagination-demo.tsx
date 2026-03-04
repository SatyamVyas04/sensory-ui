"use client";

import { IconArrowsLeftRight } from "@tabler/icons-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/sensory-ui/pagination";
import { DemoCard } from "./demo-card";

export function PaginationDemo() {
  return (
    <DemoCard
      description="Navigate pages with directional sounds"
      icon={<IconArrowsLeftRight className="size-4" />}
      soundRoles={[
        "navigation.backward",
        "navigation.tab",
        "navigation.forward",
      ]}
      title="Pagination"
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DemoCard>
  );
}
