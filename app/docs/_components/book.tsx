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
      className="group block w-full outline-none [perspective:900px] focus-visible:ring-2 focus-visible:ring-ring"
      href={href}
    >
      <div className="relative mx-auto aspect-[5/7] w-full max-w-52 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] [transform-style:preserve-3d] [transform:rotateY(0deg)] group-hover:[transform:rotateY(-16deg)_translateY(-6px)]">
        {/* Back cover */}
        <div className="absolute inset-0 rounded-r-md rounded-l-sm bg-black/60 [transform:translateZ(-14px)]" />
        {/* Page edges */}
        <div
          className="absolute top-[3px] bottom-[3px] w-[14px] rounded-r-sm [transform:rotateY(12deg)_translateZ(0px)]"
          style={{
            right: "-7px",
            backgroundImage:
              "repeating-linear-gradient(to right, #ffffff 0px, #ffffff 1px, #e4e4e7 1px, #e4e4e7 2px)",
          }}
        />
        {/* Front cover */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-md rounded-l-[2px] p-4 text-white shadow-lg ring-1 ring-white/20 transition-shadow duration-200 [transform:translateZ(14px)] group-hover:shadow-2xl",
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
            "absolute top-0 bottom-0 left-0 w-[10px] rounded-l-sm brightness-[0.6] [transform-origin:left_center] [transform:rotateY(-84deg)_translateX(-5px)]",
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
