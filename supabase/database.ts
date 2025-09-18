import { supabase } from './client'

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

// User functions
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return profile
}

export async function updateUserProfile(updates: Partial<User>): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data
}

// Habit functions
export async function getUserHabits(userId: string): Promise<HabitWithProgress[]> {
  const { data: habits, error } = await supabase
    .from('habits')
    .select(`
      *,
      habit_streaks!inner(current_streak, longest_streak, last_completion_date)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching habits:', error)
    return []
  }

  // Get today's completions for each habit
  const today = new Date().toISOString().split('T')[0]
  const habitIds = habits.map(h => h.id)

  const { data: completions } = await supabase
    .from('habit_completions')
    .select('habit_id, value')
    .eq('user_id', userId)
    .eq('completion_date', today)
    .in('habit_id', habitIds)

  // Combine data
  return habits.map(habit => {
    const todayCompletion = completions?.find(c => c.habit_id === habit.id)
    const streak = habit.habit_streaks?.[0] || { current_streak: 0, longest_streak: 0 }
    
    return {
      ...habit,
      current_streak: streak.current_streak,
      longest_streak: streak.longest_streak,
      today_progress: todayCompletion?.value || 0,
      is_completed_today: (todayCompletion?.value || 0) >= habit.target_value
    }
  })
}

export async function getHabit(habitId: string): Promise<HabitWithProgress | null> {
  const { data: habit, error } = await supabase
    .from('habits')
    .select(`
      *,
      habit_streaks!inner(current_streak, longest_streak, last_completion_date)
    `)
    .eq('id', habitId)
    .single()

  if (error) {
    console.error('Error fetching habit:', error)
    return null
  }

  // Get today's completion
  const today = new Date().toISOString().split('T')[0]
  const { data: completion } = await supabase
    .from('habit_completions')
    .select('value')
    .eq('habit_id', habitId)
    .eq('user_id', habit.user_id)
    .eq('completion_date', today)
    .single()

  const streak = habit.habit_streaks?.[0] || { current_streak: 0, longest_streak: 0 }
  
  return {
    ...habit,
    current_streak: streak.current_streak,
    longest_streak: streak.longest_streak,
    today_progress: completion?.value || 0,
    is_completed_today: (completion?.value || 0) >= habit.target_value
  }
}

export async function createHabit(habitData: Omit<Habit, "id" | "created_at" | "updated_at">): Promise<Habit | null> {
  const { data, error } = await supabase
    .from('habits')
    .insert(habitData)
    .select()
    .single()

  if (error) {
    console.error('Error creating habit:', error)
    return null
  }

  // Create initial streak record
  await supabase
    .from('habit_streaks')
    .insert({
      habit_id: data.id,
      user_id: data.user_id,
      current_streak: 0,
      longest_streak: 0
    })

  return data
}

export async function updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | null> {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .select()
    .single()

  if (error) {
    console.error('Error updating habit:', error)
    return null
  }

  return data
}

export async function deleteHabit(habitId: string): Promise<boolean> {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)

  if (error) {
    console.error('Error deleting habit:', error)
    return false
  }

  return true
}

export async function recordHabitCompletion(
  habitId: string,
  userId: string,
  value: number,
  date?: string
): Promise<HabitCompletion | null> {
  const completionDate = date || new Date().toISOString().split('T')[0]

  // Upsert completion (insert or update if exists)
  const { data, error } = await supabase
    .from('habit_completions')
    .upsert({
      habit_id: habitId,
      user_id: userId,
      completion_date: completionDate,
      value: value
    })
    .select()
    .single()

  if (error) {
    console.error('Error recording habit completion:', error)
    return null
  }

  // Update streak
  await updateHabitStreak(habitId, userId, completionDate)

  return data
}

async function updateHabitStreak(habitId: string, userId: string, completionDate: string): Promise<void> {
  // Get current streak
  const { data: streak } = await supabase
    .from('habit_streaks')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .single()

  if (!streak) return

  const today = new Date(completionDate)
  const lastCompletion = streak.last_completion_date ? new Date(streak.last_completion_date) : null
  
  let newCurrentStreak = streak.current_streak
  let newLongestStreak = streak.longest_streak

  if (lastCompletion) {
    const daysDiff = Math.floor((today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      newCurrentStreak += 1
    } else if (daysDiff > 1) {
      // Gap in days - reset streak
      newCurrentStreak = 1
    }
    // If daysDiff === 0, it's the same day, keep current streak
  } else {
    // First completion
    newCurrentStreak = 1
  }

  // Update longest streak if needed
  if (newCurrentStreak > newLongestStreak) {
    newLongestStreak = newCurrentStreak
  }

  // Update streak record
  await supabase
    .from('habit_streaks')
    .update({
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_completion_date: completionDate
    })
    .eq('habit_id', habitId)
    .eq('user_id', userId)
}

export async function getHabitStats(userId: string) {
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
    longestStreak: Math.max(...habits.map((h) => h.longest_streak), 0),
  }
}

// Realtime subscription helpers
export function subscribeToHabits(userId: string, callback: (habits: HabitWithProgress[]) => void) {
  return supabase
    .channel('habits')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'habits',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        const habits = await getUserHabits(userId)
        callback(habits)
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'habit_completions',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        const habits = await getUserHabits(userId)
        callback(habits)
      }
    )
    .subscribe()
}

export function subscribeToHabitStats(userId: string, callback: (stats: any) => void) {
  return supabase
    .channel('habit-stats')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'habit_completions',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        const stats = await getHabitStats(userId)
        callback(stats)
      }
    )
    .subscribe()
}

// User Settings functions
export interface UserSettings {
  user_id: string
  habit_reminders: boolean
  streak_alerts: boolean
  weekly_reports: boolean
  motivational_quotes: boolean
  reminder_time: string
  theme: string
  accent_color: string
  data_collection: boolean
  analytics: boolean
  public_profile: boolean
  created_at: string
  updated_at: string
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  // Try to fetch, tolerating zero rows
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user settings:', error)
  }

  if (data) return data

  // If no row exists, attempt to create a default row for this user
  const { error: insertError } = await supabase
    .from('user_settings')
    .insert({ user_id: userId })

  if (insertError) {
    console.error('Error creating default user settings:', insertError)
    return null
  }

  // Refetch after insert
  const { data: created } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return created || null
}

export async function updateUserSettings(updates: Partial<UserSettings>): Promise<UserSettings | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()
  if (error) {
    console.error('Error updating user settings:', error)
    return null
  }
  return data
}

export function subscribeToUserSettings(userId: string, callback: (settings: UserSettings) => void) {
  return supabase
    .channel('user-settings')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_settings',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        const settings = await getUserSettings(userId)
        if (settings) callback(settings)
      }
    )
    .subscribe()
}
