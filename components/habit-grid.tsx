"use client"

import { useState, useEffect } from "react"
import { HabitCard } from "@/components/habit-card"
import { AddHabitButton } from "@/components/add-habit-button"
import { getUserHabits, subscribeToHabits, type HabitWithProgress } from "../supabase/database"
import { supabase } from "../supabase/client"

export function HabitGrid() {
  const [habits, setHabits] = useState<HabitWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadHabits = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const userHabits = await getUserHabits(user.id)
      setHabits(userHabits)
      setLoading(false)

      // Set up realtime subscription
      const subscription = subscribeToHabits(user.id, (updatedHabits) => {
        setHabits(updatedHabits)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    loadHabits()
  }, [refreshKey])

  const handleHabitAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="h-8 bg-gray-800 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-800 rounded animate-pulse w-24"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-responsive-xl font-bold text-white">Your Habits</h2>
          <AddHabitButton onHabitAdded={handleHabitAdded} />
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-responsive-lg font-semibold text-white mb-2">No habits yet</h3>
          <p className="text-responsive text-gray-400 mb-6">Start building better habits by adding your first one!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-responsive-xl font-bold text-white">Your Habits</h2>
        <AddHabitButton onHabitAdded={handleHabitAdded} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  )
}
