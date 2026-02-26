"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

interface DemoCardProps {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
}

/**
 * Wraps a single interactive element and annotates it with its sound role.
 * Place inside a DemoCard to label each trigger inline.
 */
export function SoundTrigger({
  soundRole,
  children,
}: {
  soundRole: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      {children}
      <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
        {soundRole}
      </span>
    </div>
  );
}

export function DemoCard({
  title,
  description,
  icon,
  children,
}: DemoCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col border border-border bg-card p-5 transition-shadow"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      transition={{ duration: 0.3, ease }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: prefersReduced ? 0 : -2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span aria-hidden="true" className="text-primary">
          {icon}
        </span>
        <span className="font-medium text-foreground text-xs">{title}</span>
      </div>
      <p className="mb-5 font-mono text-[11px] text-muted-foreground">
        {description}
      </p>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
