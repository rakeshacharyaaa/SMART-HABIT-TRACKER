"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, Minus, Flame, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { recordHabitCompletion } from "../supabase/database"
import { supabase } from "../supabase/client"

interface Habit {
  id: string
  name: string
  description?: string
  icon?: string
  color: "primary" | "secondary" | "accent"
  current_streak: number
  longest_streak: number
  is_completed_today: boolean
  target_value: number
  today_progress: number
  category?: string
}

interface HabitCardProps {
  habit: Habit
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(habit.is_completed_today)
  const [progress, setProgress] = useState(habit.today_progress)
  const streak = habit.current_streak
  const target = habit.target_value

  const progressPercentage = (progress / target) * 100

  const handleToggleComplete = async () => {
    try {
      const newCompleted = !isCompleted
      const newProgress = newCompleted ? target : 0

      // Call Supabase directly instead of API route
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert("Please sign in to complete habits")
        return
      }

      const completion = await recordHabitCompletion(habit.id, user.id, newProgress)
      
      if (completion) {
        setIsCompleted(newCompleted)
        setProgress(newProgress)
      }
    } catch (error) {
      console.error("Failed to update habit completion:", error)
    }
  }

  const handleIncrement = async () => {
    if (progress < target) {
      const newProgress = progress + 1

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          alert("Please sign in to complete habits")
          return
        }

        const completion = await recordHabitCompletion(habit.id, user.id, newProgress)
        
        if (completion) {
          setProgress(newProgress)
          if (newProgress === target) {
            setIsCompleted(true)
          }
        }
      } catch (error) {
        console.error("Failed to update habit progress:", error)
      }
    }
  }

  const handleDecrement = async () => {
    if (progress > 0) {
      const newProgress = progress - 1

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          alert("Please sign in to complete habits")
          return
        }

        const completion = await recordHabitCompletion(habit.id, user.id, newProgress)
        
        if (completion) {
          setProgress(newProgress)
          if (newProgress < target) {
            setIsCompleted(false)
          }
        }
      } catch (error) {
        console.error("Failed to update habit progress:", error)
      }
    }
  }

  return (
    <div className={cn(
      "card space-y-4 transition-all duration-300",
      isCompleted && "ring-2 ring-ring/50"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="text-2xl flex-shrink-0">{habit.icon}</div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-responsive truncate">{habit.name}</h3>
            <p className="text-sm text-muted-foreground text-responsive line-clamp-2">{habit.description}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="px-2 py-1 rounded border text-foreground border-border text-xs">
          {habit.category}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Flame className="h-3 w-3" />
          <span>{streak} day streak</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">
            {progress}/{target}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-foreground h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {target > 1 ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={progress === 0}
              className="h-8 w-8 border text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={progress >= target}
              className="h-8 w-8 border text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </>
        ) : null}

        <Button
          onClick={handleToggleComplete}
          className={cn(
            "flex-1 h-10 transition-all duration-300",
            isCompleted 
              ? "btn-primary"
              : "btn-secondary"
          )}
        >
          <Check className="mr-2 h-4 w-4" />
          {isCompleted ? "Completed" : "Mark Complete"}
        </Button>
      </div>
    </div>
  )
}