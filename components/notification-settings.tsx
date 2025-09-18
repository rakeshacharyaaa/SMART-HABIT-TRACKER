"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell } from "lucide-react"
import { getUserSettings, updateUserSettings, subscribeToUserSettings } from "../supabase/database"
import { supabase } from "../supabase/client"

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    habitReminders: true,
    streakAlerts: true,
    weeklyReports: false,
    motivationalQuotes: true,
    reminderTime: "09:00",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    let mounted = true
    const loadSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const settings = await getUserSettings(user.id)
      if (settings && mounted) {
        setNotifications({
          habitReminders: settings.habit_reminders,
          streakAlerts: settings.streak_alerts,
          weeklyReports: settings.weekly_reports,
          motivationalQuotes: settings.motivational_quotes,
          reminderTime: settings.reminder_time,
        })
        setLoading(false)
      }

      // Set up realtime subscription
      const subscription = subscribeToUserSettings(user.id, (updatedSettings) => {
        if (mounted) {
          setNotifications({
            habitReminders: updatedSettings.habit_reminders,
            streakAlerts: updatedSettings.streak_alerts,
            weeklyReports: updatedSettings.weekly_reports,
            motivationalQuotes: updatedSettings.motivational_quotes,
            reminderTime: updatedSettings.reminder_time,
          })
        }
      })

      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    }

    loadSettings()
  }, [])

  const updateNotification = async (key: string, value: boolean | string) => {
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      const updates: any = {}
      if (key === "habitReminders") updates.habit_reminders = value
      else if (key === "streakAlerts") updates.streak_alerts = value
      else if (key === "weeklyReports") updates.weekly_reports = value
      else if (key === "motivationalQuotes") updates.motivational_quotes = value
      else if (key === "reminderTime") updates.reminder_time = value

      const updated = await updateUserSettings(updates)
      if (updated) {
        setSuccess("Settings updated!")
        setNotifications((prev) => ({ ...prev, [key]: value }))
      } else {
        setError("Failed to update settings.")
      }
    } catch (e) {
      setError("An error occurred.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <GlassCard><div className="p-8 text-center">Loading...</div></GlassCard>
  }

  return (
    <GlassCard>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Habit Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified when it's time to complete your habits</p>
            </div>
            <Switch
              checked={notifications.habitReminders}
              onCheckedChange={(checked) => updateNotification("habitReminders", checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Streak Alerts</Label>
              <p className="text-sm text-muted-foreground">Celebrate when you reach new streak milestones</p>
            </div>
            <Switch
              checked={notifications.streakAlerts}
              onCheckedChange={(checked) => updateNotification("streakAlerts", checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly progress summaries</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => updateNotification("weeklyReports", checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Motivational Quotes</Label>
              <p className="text-sm text-muted-foreground">Daily inspiration to keep you motivated</p>
            </div>
            <Switch
              checked={notifications.motivationalQuotes}
              onCheckedChange={(checked) => updateNotification("motivationalQuotes", checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Reminder Time</Label>
              <p className="text-sm text-muted-foreground">When to send daily habit reminders</p>
            </div>
            <Select
              value={notifications.reminderTime}
              onValueChange={(value) => updateNotification("reminderTime", value)}
            >
              <SelectTrigger className="w-full sm:w-32 bg-white/5 backdrop-blur-xl border border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">7:00 AM</SelectItem>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="19:00">7:00 PM</SelectItem>
                <SelectItem value="20:00">8:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
