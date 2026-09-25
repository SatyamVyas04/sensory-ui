"use client";

import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";

const steps = ["Account", "Profile", "Preferences", "Complete"];

function dotClass(index: number, current: number) {
  if (index < current) {
    return "bg-primary text-primary-foreground";
  }
  if (index === current) {
    return "border-2 border-primary text-primary";
  }
  return "border border-muted-foreground/30 text-muted-foreground";
}

export function MultistepBlockLive() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div
            className={`flex size-8 items-center justify-center rounded-full font-medium text-xs ${dotClass(i, currentStep)}`}
            key={step}
          >
            {i < currentStep ? <IconCheck className="size-4" /> : i + 1}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-sm">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </p>
      <div className="flex gap-3">
        <Button
          className="gap-2"
          disabled={currentStep === 0}
          onClick={handlePrev}
          sound="navigation.backward"
          variant="outline"
        >
          <IconArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          className="gap-2"
          disabled={currentStep === steps.length - 1}
          onClick={handleNext}
          sound={
            currentStep === steps.length - 1
              ? "hero.complete"
              : "navigation.forward"
          }
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
          {currentStep < steps.length - 1 && (
            <IconArrowRight className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
