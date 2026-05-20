import * as React from "react"
import { cn } from "@/lib/utils"

// 1. Extend the types to explicitly support maxRows
export interface TextareaProps extends React.ComponentProps<"textarea"> {
  maxRows?: number
}

function Textarea({ className, maxRows, style, ...props }: TextareaProps) {
  // 2. Calculate max-height dynamically based on rows if provided
  // Assuming a standard line-height (~1.5) + vertical padding (1.5rem total for py-3)
  const dynamicStyle = maxRows
    ? {
        maxHeight: `calc(${maxRows} * 1.5em + 1.5rem)`,
        overflowY: "auto" as const,
        ...style,
      }
    : style

  return (
    <textarea
      data-slot="textarea"
      style={dynamicStyle}
      className={cn(
        "bg-input/50 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 w-full min-w-72 resize-none rounded-2xl border border-transparent px-3 py-3 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
