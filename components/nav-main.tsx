"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { IconChevronRight } from "@tabler/icons-react"

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  defaultOpen?: boolean
  items?: {
    title: string
    url: string
  }[]
}

const ALWAYS_OPEN = ["Getting Started", "Concepts", "Guides"]

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isAlwaysOpen = ALWAYS_OPEN.includes(item.title)
          const isExpanded = isAlwaysOpen || (item.items?.some((sub) => pathname === sub.url) ?? false)

          return (
            <Collapsible key={item.title} asChild defaultOpen={isExpanded}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <IconChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.url}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
