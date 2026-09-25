"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/sensory-ui/select";

export function SelectDocsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Select>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>
      <Select closeSound="interaction.subtle">
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Soft close" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
