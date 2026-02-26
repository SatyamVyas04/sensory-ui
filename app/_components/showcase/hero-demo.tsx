"use client";

import { IconTrophy } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function HeroDemo() {
  return (
    <DemoCard
      description="Milestone and task completion celebrations"
      icon={<IconTrophy className="size-4" />}
      title="Hero Moments"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        <SoundTrigger soundRole="hero.complete">
          <Button size="sm" sound="hero.complete">
            Complete
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="hero.milestone">
          <Button size="sm" sound="hero.milestone" variant="secondary">
            Milestone
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
