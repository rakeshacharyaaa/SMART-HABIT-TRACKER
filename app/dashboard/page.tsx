import { HabitGrid } from "@/components/habit-grid"
import { StatsOverview } from "@/components/stats-overview"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <StatsOverview />
      <HabitGrid />
    </div>
  )
}
