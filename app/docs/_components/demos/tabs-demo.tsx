"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/sensory-ui/tabs";

export function TabsDocsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent
          className="pt-3 text-center text-muted-foreground text-sm"
          value="account"
        >
          Tab switch plays `navigation.tab`.
        </TabsContent>
        <TabsContent
          className="pt-3 text-center text-muted-foreground text-sm"
          value="password"
        >
          Same tab sound, every switch.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="one" sound={false}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent
          className="pt-3 text-center text-muted-foreground text-sm"
          value="one"
        >
          This group switches silently.
        </TabsContent>
        <TabsContent
          className="pt-3 text-center text-muted-foreground text-sm"
          value="two"
        >
          No sound on either tab.
        </TabsContent>
      </Tabs>
    </div>
  );
}
