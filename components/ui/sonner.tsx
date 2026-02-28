"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconLoader,
} from "@tabler/icons-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-4 text-emerald-500" />,
        info: <IconInfoCircle className="size-4 text-blue-500" />,
        warning: <IconAlertTriangle className="size-4 text-amber-500" />,
        error: <IconAlertOctagon className="size-4 text-red-500" />,
        loading: <IconLoader className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast border border-border bg-card text-card-foreground shadow-lg",
          title: "text-sm font-medium",
          description: "text-xs text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5",
          cancelButton:
            "bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5",
          success: "border-emerald-500/20 bg-emerald-500/5",
          error: "border-red-500/20 bg-red-500/5",
          warning: "border-amber-500/20 bg-amber-500/5",
          info: "border-blue-500/20 bg-blue-500/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
