import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { GlassCard } from "@/components/glass-card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, BarChart3, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader />

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Analytics & Insights
          </h2>
        </div>

        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Weekly Progress</h3>
            </div>
            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <Progress value={[85, 92, 78, 95, 88, 76, 90][index]} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-12">{[85, 92, 78, 95, 88, 76, 90][index]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <PieChart className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Habit Categories</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: "Health & Fitness", percentage: 35, color: "bg-primary" },
                { name: "Learning", percentage: 25, color: "bg-secondary" },
                { name: "Mindfulness", percentage: 20, color: "bg-accent" },
                { name: "Productivity", percentage: 20, color: "bg-green-400" },
              ].map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Monthly Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Total Completions</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-secondary">23</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent">87%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-400">6</div>
              <div className="text-sm text-muted-foreground">Active Habits</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
