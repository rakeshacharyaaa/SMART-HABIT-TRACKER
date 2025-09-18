import { DashboardHeader } from "@/components/dashboard-header"
import { HabitGrid } from "@/components/habit-grid"
import { AddHabitButton } from "@/components/add-habit-button"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Filter, Search, SortAsc } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HabitsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader />

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Manage Your Habits
          </h2>
          <AddHabitButton />
        </div>

        <GlassCard className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search habits..."
              className="pl-10 bg-white/5 backdrop-blur-xl border border-white/10"
            />
          </div>
          <Button variant="outline" className="bg-white/5 backdrop-blur-xl border border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-white/5 backdrop-blur-xl border border-white/10">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </GlassCard>

        <HabitGrid />
      </div>
    </div>
  )
}
