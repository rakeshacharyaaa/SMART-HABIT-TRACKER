import { DashboardHeader } from "@/components/dashboard-header"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="w-full px-2 sm:px-4">
      <div className="max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Habit Calendar
          </h2>
        </div>

        <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
          <Button variant="outline" className="bg-white/5 backdrop-blur-xl border border-white/10 w-full sm:w-auto text-white">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-white" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">December 2024</h3>
          </div>
          <Button variant="outline" className="bg-white/5 backdrop-blur-xl border border-white/10 w-full sm:w-auto text-white">
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-muted-foreground p-1 sm:p-2 text-xs sm:text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 6 + 1
              const isCurrentMonth = day > 0 && day <= 31
              const hasHabits = isCurrentMonth && Math.random() > 0.3
              const completionRate = hasHabits ? Math.floor(Math.random() * 100) : 0

              return (
                <div
                  key={i}
                  className={`
                    aspect-square p-1 sm:p-2 rounded-lg border transition-all duration-200 hover:scale-105
                    ${
                      isCurrentMonth
                        ? "bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10"
                        : "bg-transparent border-transparent text-gray-500"
                    }
                    ${day === 18 ? "ring-2 ring-white" : ""}
                  `}
                >
                  {isCurrentMonth && (
                    <>
                      <div className="text-xs sm:text-sm font-medium mb-1 text-white">{day}</div>
                      {hasHabits && (
                        <div className="space-y-1">
                          <div
                            className={`
                            w-full h-1 rounded-full
                            ${
                              completionRate >= 80
                                ? "bg-white"
                                : completionRate >= 60
                                  ? "bg-gray-300"
                                  : completionRate >= 40
                                    ? "bg-gray-500"
                                    : "bg-gray-700"
                            }
                          `}
                          />
                          <div className="text-xs text-gray-400">{completionRate}%</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </GlassCard>

        <GlassCard className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-white" />
            <span className="text-xs sm:text-sm text-white">80-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-gray-300" />
            <span className="text-xs sm:text-sm text-white">60-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-gray-500" />
            <span className="text-xs sm:text-sm text-white">40-59%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-gray-700" />
            <span className="text-xs sm:text-sm text-white">0-39%</span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
