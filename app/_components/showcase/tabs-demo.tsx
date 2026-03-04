"use client";

import { IconLayoutGrid } from "@tabler/icons-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/sensory-ui/tabs";
import { DemoCard } from "./demo-card";

export function TabsDemo() {
  return (
    <DemoCard
      description="Switch tabs to hear navigation cues"
      icon={<IconLayoutGrid className="size-4" />}
      title="Tabs"
    >
      <Tabs defaultValue="preview" sound="navigation.tab">
        <TabsList className="w-full">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
        <TabsContent
          className="mt-1 text-muted-foreground text-xs"
          value="preview"
        >
          Preview - switch tabs to trigger sound.
        </TabsContent>
        <TabsContent
          className="mt-1 text-muted-foreground text-xs"
          value="code"
        >
          Code panel - navigation.tab fired.
        </TabsContent>
        <TabsContent
          className="mt-1 text-muted-foreground text-xs"
          value="docs"
        >
          Docs panel - another switch transition.
        </TabsContent>
      </Tabs>
    </DemoCard>
  );
}
