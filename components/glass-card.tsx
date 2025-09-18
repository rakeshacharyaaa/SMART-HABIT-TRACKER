import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "hover" | "glow"
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "card transition-all duration-300",
        variant === "hover" && "hover:scale-[1.01]",
        variant === "glow" && "shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
