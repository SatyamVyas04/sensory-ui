"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/sensory-ui/tabs";

export function TabBarBlockLive() {
  return (
    <Tabs className="w-full max-w-md" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent
        className="pt-3 text-center text-muted-foreground text-sm"
        value="overview"
      >
        Overview section.
      </TabsContent>
      <TabsContent
        className="pt-3 text-center text-muted-foreground text-sm"
        value="features"
      >
        Features section.
      </TabsContent>
      <TabsContent
        className="pt-3 text-center text-muted-foreground text-sm"
        value="pricing"
      >
        Pricing section.
      </TabsContent>
      <TabsContent
        className="pt-3 text-center text-muted-foreground text-sm"
        value="reviews"
      >
        Reviews section.
      </TabsContent>
    </Tabs>
  );
}
