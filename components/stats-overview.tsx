"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Target, Flame, Calendar } from "lucide-react"
import { getHabitStats, subscribeToHabitStats } from "../supabase/database"
import { supabase } from "../supabase/client"

export function StatsOverview() {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    todayProgress: 0,
    averageStreak: 0,
    longestStreak: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const userStats = await getHabitStats(user.id)
      setStats(userStats)
      setLoading(false)

      // Set up realtime subscription
      const subscription = subscribeToHabitStats(user.id, (updatedStats) => {
        setStats(updatedStats)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    loadStats()
  }, [])

  const displayStats = [
    {
      title: "Today's Progress",
      value: `${stats.completedToday}/${stats.totalHabits}`,
      percentage: stats.todayProgress,
      icon: Target,
    },
    {
      title: "Current Streak",
      value: `${stats.averageStreak} days`,
      percentage: Math.min((stats.averageStreak / 30) * 100, 100),
      icon: Flame,
    },
    {
      title: "Total Habits",
      value: stats.totalHabits.toString(),
      percentage: 100,
      icon: Calendar,
    },
    {
      title: "Longest Streak",
      value: `${stats.longestStreak} days`,
      percentage: Math.min((stats.longestStreak / 100) * 100, 100),
      icon: TrendingUp,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-secondary rounded mb-2"></div>
              <div className="h-8 bg-secondary rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => (
        <div key={index} className="card p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-secondary">
              <stat.icon className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground text-responsive-lg">{stat.value}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground text-responsive">{stat.title}</span>
              <span className="font-medium text-foreground">{stat.percentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-foreground h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}