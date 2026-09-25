"use client";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/sensory-ui/radio-group";

export function RadioGroupDocsDemo() {
  return (
    <div className="flex flex-col items-start gap-5">
      <RadioGroup
        className="flex flex-col items-start gap-3"
        defaultValue="comfortable"
      >
        <label
          className="flex cursor-pointer items-center gap-2.5 text-sm"
          htmlFor="demo-radio-default"
        >
          <RadioGroupItem id="demo-radio-default" value="default" />
          Default
        </label>
        <label
          className="flex cursor-pointer items-center gap-2.5 text-sm"
          htmlFor="demo-radio-comfortable"
        >
          <RadioGroupItem id="demo-radio-comfortable" value="comfortable" />
          Comfortable
        </label>
        <label
          className="flex cursor-pointer items-center gap-2.5 text-sm"
          htmlFor="demo-radio-compact"
        >
          <RadioGroupItem id="demo-radio-compact" value="compact" />
          Compact
        </label>
      </RadioGroup>
      <RadioGroup
        aria-label="Confirm style"
        className="flex items-center gap-4"
        defaultValue="yes"
        sound="interaction.confirm"
      >
        <label
          className="flex cursor-pointer items-center gap-2.5 text-sm"
          htmlFor="demo-radio-yes"
        >
          <RadioGroupItem id="demo-radio-yes" value="yes" />
          Yes
        </label>
        <label
          className="flex cursor-pointer items-center gap-2.5 text-sm"
          htmlFor="demo-radio-no"
        >
          <RadioGroupItem id="demo-radio-no" value="no" />
          No
        </label>
      </RadioGroup>
    </div>
  );
}
