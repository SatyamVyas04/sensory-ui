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
      <div className="flex flex-col gap-1">
        <Tabs defaultValue="preview" sound="navigation.switch">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
          </TabsList>
          <TabsContent
            className="mt-3 text-muted-foreground text-xs"
            value="preview"
          >
            Preview panel — switch tabs to trigger sound.
          </TabsContent>
          <TabsContent
            className="mt-3 text-muted-foreground text-xs"
            value="code"
          >
            Code panel — navigation.switch fired.
          </TabsContent>
          <TabsContent
            className="mt-3 text-muted-foreground text-xs"
            value="docs"
          >
            Docs panel — another switch transition.
          </TabsContent>
        </Tabs>
        <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
          navigation.switch
        </span>
      </div>
    </DemoCard>
  );
}
