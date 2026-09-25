"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/sensory-ui/pagination";

export function PaginationDocsDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
