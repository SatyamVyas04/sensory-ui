"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// iOS-style easing for smooth, natural motion
const ease = [0.32, 0.72, 0, 1] as const;

interface DemoCardProps {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  soundRoles: string[];
  title: string;
}

export function DemoCard({
  title,
  description,
  icon,
  children,
  soundRoles,
}: DemoCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
      transition={{ duration: 0.2, ease }}
      viewport={{ once: true, margin: "-60px", amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="transition-[ring-color] duration-200 hover:ring-primary/50">
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
        <CardContent className="flex-1">{children}</CardContent>
        {soundRoles.length > 0 && (
          <CardFooter className="flex-wrap gap-1.5 p-1">
            {soundRoles.map((role) => (
              <span
                className="inline-flex items-center bg-muted px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground"
                key={role}
              >
                {role}
              </span>
            ))}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
