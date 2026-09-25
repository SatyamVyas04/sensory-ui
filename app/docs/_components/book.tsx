"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BookProps {
  coverClassName?: string;
  description: string;
  footer: string;
  href: string;
  spineClassName?: string;
  title: string;
}

export function Book({
  href,
  title,
  description,
  footer,
  coverClassName,
  spineClassName,
}: BookProps) {
  return (
    <Link
      aria-label={title}
      className="group perspective-[900px] block w-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={href}
    >
      <div className="transform-3d transform-[rotateY(0deg)] group-hover:transform-[rotateY(-16deg)_translateY(-6px)] relative mx-auto aspect-5/7 w-full max-w-52 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]">
        {/* Back cover */}
        <div className="transform-[translateZ(-14px)] absolute inset-0 rounded-r-md rounded-l-sm bg-black/60" />
        {/* Page edges */}
        <div
          className="transform-[rotateY(12deg)_translateZ(0px)] absolute top-0.75 bottom-0.75 w-3.5 rounded-r-sm"
          style={{
            right: "-7px",
            backgroundImage:
              "repeating-linear-gradient(to right, #ffffff 0px, #ffffff 1px, #e4e4e7 1px, #e4e4e7 2px)",
          }}
        />
        {/* Front cover */}
        <div
          className={cn(
            "transform-[translateZ(14px)] absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-md rounded-l-[2px] p-4 text-white shadow-lg ring-1 ring-white/20 transition-shadow duration-200 group-hover:shadow-2xl",
            coverClassName
          )}
        >
          <p className="text-balance font-bold font-serif text-md leading-snug">
            {title}
          </p>
          <div>
            <p className="line-clamp-2 text-balance text-[10px] text-white/80 leading-relaxed">
              {description}
            </p>
            <p className="mt-2 text-right font-mono text-[8px] text-white/70 uppercase tracking-widest">
              {footer}
            </p>
          </div>
        </div>
        {/* Spine */}
        <div
          className={cn(
            "transform-[rotateY(-84deg)_translateX(-5px)] absolute top-0 bottom-0 left-0 w-2.5 origin-[left_center] rounded-l-sm brightness-[0.6]",
            spineClassName ?? coverClassName
          )}
        />
      </div>
    </Link>
  );
}

export function Bookshelf({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose grid grid-cols-2 gap-x-6 gap-y-10 py-8 md:grid-cols-3 lg:grid-cols-5">
      {children}
    </div>
  );
}
