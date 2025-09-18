// Mock database functions for demo purposes
// In a real app, these would connect to your actual database

export interface User {
  id: string
  email: string
  name: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  icon?: string
  color: "primary" | "secondary" | "accent"
  category?: string
  target_value: number
  target_unit: string
  frequency: "daily" | "weekly" | "monthly"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completion_date: string
  value: number
  notes?: string
  created_at: string
}

export interface HabitStreak {
  id: string
  habit_id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_completion_date?: string
  updated_at: string
}

export interface HabitWithProgress extends Habit {
  current_streak: number
  longest_streak: number
  today_progress: number
  is_completed_today: boolean
}

// Mock data for demo
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "alex@example.com",
  name: "Alex Johnson",
  bio: "Building better habits one day at a time. Passionate about personal growth and mindfulness.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockHabits: HabitWithProgress[] = [
  {
    id: "1",
    user_id: mockUser.id,
    name: "Morning Meditation",
    description: "10 minutes of mindfulness",
    icon: "🧘‍♂️",
    color: "primary",
    category: "Wellness",
    target_value: 1,
    target_unit: "times",
    frequency: "daily",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_streak: 12,
    longest_streak: 15,
    today_progress: 1,
    is_completed_today: true,
  },
  {
    id: "2",
    user_id: mockUser.id,
    name: "Drink Water",
    description: "8 glasses throughout the day",
    icon: "💧",
    color: "accent",
    category: "Health",
    target_value: 8,
    target_unit: "glasses",
    frequency: "daily",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_streak: 8,
    longest_streak: 12,
    today_progress: 5,
    is_completed_today: false,
  },
  {
    id: "3",
    user_id: mockUser.id,
    name: "Read Books",
    description: "30 minutes of reading",
    icon: "📚",
    color: "secondary",
    category: "Learning",
    target_value: 30,
    target_unit: "minutes",
    frequency: "daily",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_streak: 15,
    longest_streak: 20,
    today_progress: 45,
    is_completed_today: true,
  },
  {
    id: "4",
    user_id: mockUser.id,
    name: "Exercise",
    description: "45 minutes workout",
    icon: "💪",
    color: "primary",
    category: "Fitness",
    target_value: 45,
    target_unit: "minutes",
    frequency: "daily",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_streak: 5,
    longest_streak: 8,
    today_progress: 0,
    is_completed_today: false,
  },
  {
    id: "5",
    user_id: mockUser.id,
    name: "Gratitude Journal",
    description: "Write 3 things I'm grateful for",
    icon: "📝",
    color: "secondary",
    category: "Mindfulness",
    target_value: 3,
    target_unit: "items",
    frequency: "daily",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_streak: 20,
    longest_streak: 25,
    today_progress: 3,
    is_completed_today: true,
  },
  {
    id: "6",
    user_id: mockUser.id,
    name: "Learn Spanish",
    description: "15 minutes language practice",
    icon: "🇪🇸",
    color: "accent",
    category: "Learning",
    target_value: 15,
    target_unit: "minutes",
    frequency: "daily",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_streak: 7,
    longest_streak: 10,
    today_progress: 8,
    is_completed_today: false,
  },
]

// Database functions
export async function getUser(userId: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockUser.id === userId ? mockUser : null
}

export async function getUserHabits(userId: string): Promise<HabitWithProgress[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockHabits.filter((habit) => habit.user_id === userId)
}

export async function getHabit(habitId: string): Promise<HabitWithProgress | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockHabits.find((habit) => habit.id === habitId) || null
}

export async function createHabit(habitData: Omit<Habit, "id" | "created_at" | "updated_at">): Promise<Habit> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newHabit: Habit = {
    ...habitData,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return newHabit
}

export async function updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const habitIndex = mockHabits.findIndex((habit) => habit.id === habitId)
  if (habitIndex === -1) return null

  const updatedHabit = {
    ...mockHabits[habitIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  mockHabits[habitIndex] = updatedHabit
  return updatedHabit
}

export async function deleteHabit(habitId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const habitIndex = mockHabits.findIndex((habit) => habit.id === habitId)
  if (habitIndex === -1) return false

  mockHabits.splice(habitIndex, 1)
  return true
}

export async function recordHabitCompletion(
  habitId: string,
  userId: string,
  value: number,
  date?: string,
): Promise<HabitCompletion> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const completion: HabitCompletion = {
    id: Math.random().toString(36).substr(2, 9),
    habit_id: habitId,
    user_id: userId,
    completion_date: date || new Date().toISOString().split("T")[0],
    value,
    created_at: new Date().toISOString(),
  }

  // Update the habit progress in mock data
  const habit = mockHabits.find((h) => h.id === habitId)
  if (habit) {
    habit.today_progress = value
    habit.is_completed_today = value >= habit.target_value
    if (habit.is_completed_today) {
      habit.current_streak += 1
      if (habit.current_streak > habit.longest_streak) {
        habit.longest_streak = habit.current_streak
      }
    }
  }

  return completion
}

export async function getHabitStats(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const habits = await getUserHabits(userId)
  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.is_completed_today).length
  const totalProgress = habits.reduce((sum, h) => sum + h.today_progress, 0)
  const totalTarget = habits.reduce((sum, h) => sum + h.target_value, 0)
  const averageStreak = habits.reduce((sum, h) => sum + h.current_streak, 0) / totalHabits

  return {
    totalHabits,
    completedToday,
    todayProgress: totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0,
    averageStreak: Math.round(averageStreak),
    longestStreak: Math.max(...habits.map((h) => h.longest_streak)),
  }
}
