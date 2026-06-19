"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheck,
  Info,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4 shrink-0 text-emerald-500" />,
        info: <Info className="size-4 shrink-0 text-blue-500" />,
        warning: <AlertTriangle className="size-4 shrink-0 text-amber-500" />,
        error: <XCircle className="text-destructive size-4 shrink-0" />,
        loading: (
          <Loader2 className="text-muted-foreground size-4 shrink-0 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: [
            "group toast",
            "flex items-center gap-3 w-full p-4 rounded-xl border font-sans text-sm shadow-lg backdrop-blur-md transition-all duration-300",
            "bg-background/95 text-foreground border-border",
            // Hiệu ứng hover nhẹ
            "hover:scale-[1.02] hover:shadow-xl",
          ].join(" "),
          title: "font-semibold tracking-tight text-foreground",
          description: "text-muted-foreground text-xs leading-relaxed",
          actionButton: [
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
          ].join(" "),
          cancelButton: [
            "bg-muted text-muted-foreground hover:bg-muted/80",
            "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
          ].join(" "),
          // Custom style riêng cho từng loại nếu bạn muốn đổi màu nền (Optional)
          success:
            "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10",
          error:
            "border-destructive/20 bg-destructive/5 dark:bg-destructive/10",
          warning: "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10",
          info: "border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
