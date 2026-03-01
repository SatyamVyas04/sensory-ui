"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider as BaseSidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function SidebarProvider({
  openSound,
  closeSound,
  onOpenChange,
  open: controlledOpen,
  defaultOpen = true,
  ...props
}: React.ComponentProps<typeof BaseSidebarProvider> & {
  /** Sound to play when the sidebar opens. */
  openSound?: SoundRole;
  /** Sound to play when the sidebar closes. Defaults to "system.close". */
  closeSound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();
  const prevOpenRef = React.useRef(controlledOpen ?? defaultOpen);

  // Keep ref in sync with controlled open prop
  React.useEffect(() => {
    if (controlledOpen !== undefined) {
      prevOpenRef.current = controlledOpen;
    }
  }, [controlledOpen]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen !== prevOpenRef.current) {
        if (nextOpen && openSound) {
          void playSound(openSound);
        } else if (!nextOpen && (closeSound ?? openSound)) {
          void playSound(closeSound ?? "system.close");
        }
        prevOpenRef.current = nextOpen;
      }
      onOpenChange?.(nextOpen);
    },
    [openSound, closeSound, playSound, onOpenChange]
  );

  return (
    <BaseSidebarProvider
      open={controlledOpen}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
