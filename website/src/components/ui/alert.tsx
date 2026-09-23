import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, Lightbulb, TriangleAlert, OctagonAlert, CheckCircle2 } from "lucide-react"

import { cn } from "@site/src/lib/utils"

// Callout/Alert dùng thay cho admonition mặc định của Docusaurus khi viết
// trong file .mdx — xem docs/mentor/... (mdx) hoặc docs/README.mdx để có ví dụ.
const alertVariants = cva(
  "relative flex gap-3 rounded-lg border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        note: "border-border bg-muted/50 text-foreground [&>svg]:text-muted-foreground",
        tip: "border-emerald-500/30 bg-emerald-500/10 text-foreground [&>svg]:text-emerald-400",
        info: "border-sky-500/30 bg-sky-500/10 text-foreground [&>svg]:text-sky-400",
        warning: "border-amber-500/30 bg-amber-500/10 text-foreground [&>svg]:text-amber-400",
        danger: "border-destructive/30 bg-destructive/10 text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "note" },
  }
)

const ICONS = {
  note: Info,
  tip: Lightbulb,
  info: Info,
  warning: TriangleAlert,
  danger: OctagonAlert,
} as const

function Alert({
  className,
  variant = "note",
  title,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & { title?: string }) {
  const Icon = ICONS[variant ?? "note"]
  return (
    <div data-slot="alert" role="note" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon />
      <div className="flex flex-col gap-1">
        {title && <div className="font-semibold leading-none">{title}</div>}
        <div className="text-muted-foreground [&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}

export { Alert, alertVariants, CheckCircle2 }
