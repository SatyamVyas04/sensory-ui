"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/sensory-ui/menubar";

export function MenubarDocsDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New file</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarSeparator />
          <MenubarItem sound="notification.warning">Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger sound="navigation.tab">View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom in</MenubarItem>
          <MenubarItem>Zoom out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
