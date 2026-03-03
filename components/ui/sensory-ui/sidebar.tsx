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

const DEFAULT_SIDEBAR_OPEN_SOUND = "overlay.open" as const;
const DEFAULT_SIDEBAR_CLOSE_SOUND = "overlay.close" as const;

function SidebarProvider({
  openSound,
  closeSound,
  volume,
  onOpenChange,
  open: controlledOpen,
  defaultOpen = true,
  ...props
}: React.ComponentProps<typeof BaseSidebarProvider> & {
  /** Sound to play when the sidebar opens. Defaults to "overlay.open". Set to false to disable. */
  openSound?: SoundRole | false;
  /** Sound to play when the sidebar closes. Defaults to "overlay.close". Set to false to disable. */
  closeSound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
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
        if (nextOpen && openSound !== false) {
          void playSound(openSound ?? DEFAULT_SIDEBAR_OPEN_SOUND, { volume });
        } else if (!nextOpen && closeSound !== false) {
          void playSound(closeSound ?? DEFAULT_SIDEBAR_CLOSE_SOUND, { volume });
        }
        prevOpenRef.current = nextOpen;
      }
      onOpenChange?.(nextOpen);
    },
    [openSound, closeSound, volume, playSound, onOpenChange]
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
