"use client";

import { IconTrophy } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function HeroDemo() {
  return (
    <DemoCard
      description="Milestone and task completion sounds"
      icon={<IconTrophy className="size-4" />}
      title="Hero Moments"
    >
      <div className="flex flex-col gap-3">
        <SoundTrigger soundRole="hero.complete">
          <Button className="w-full" size="sm" sound="hero.complete">
            Complete Task
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="hero.milestone">
          <Button
            className="w-full"
            size="sm"
            sound="hero.milestone"
            variant="secondary"
          >
            Reach Milestone
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
