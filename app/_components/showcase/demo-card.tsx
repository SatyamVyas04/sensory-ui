"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// iOS-style easing for smooth, natural motion
const ease = [0.32, 0.72, 0, 1] as const;

interface DemoCardProps {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
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
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      transition={{ duration: 0.25, ease }}
      viewport={{ once: true, margin: "-80px", amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="max-h-96 overflow-hidden transition-[box-shadow,ring-color] duration-200 hover:ring-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xs">
            <span aria-hidden="true" className="text-primary">
              {icon}
            </span>
            {title}
          </CardTitle>
          <CardDescription className="font-mono text-[11px]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="mask-[linear-gradient(to_bottom,black_90%,transparent)] relative flex-1">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
