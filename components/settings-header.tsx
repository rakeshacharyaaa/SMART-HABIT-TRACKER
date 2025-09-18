import { GlassCard } from "@/components/glass-card"
import { Settings } from "lucide-react"

export function SettingsHeader() {
  return (
    <GlassCard>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your account and app preferences</p>
        </div>
      </div>
    </GlassCard>
  )
}
