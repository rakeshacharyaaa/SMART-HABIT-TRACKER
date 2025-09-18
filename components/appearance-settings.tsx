"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserSettings, updateUserSettings, subscribeToUserSettings } from "../supabase/database"
import { supabase } from "../supabase/client"

export function AppearanceSettings() {
  const [theme, setTheme] = useState("dark")
  const [accentColor, setAccentColor] = useState("blue")
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
        setTheme(settings.theme)
        setAccentColor(settings.accent_color)
        setLoading(false)
      }

      // Set up realtime subscription
      const subscription = subscribeToUserSettings(user.id, (updatedSettings) => {
        if (mounted) {
          setTheme(updatedSettings.theme)
          setAccentColor(updatedSettings.accent_color)
        }
      })

      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    }

    loadSettings()
  }, [])

  const updateSetting = async (key: string, value: string) => {
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      const updates: any = {}
      if (key === "theme") updates.theme = value
      else if (key === "accentColor") updates.accent_color = value

      const updated = await updateUserSettings(updates)
      if (updated) {
        setSuccess("Settings updated!")
        if (key === "theme") {
          setTheme(value)
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', value)
            try { localStorage.setItem('app-theme', value) } catch (e) {}
          }
        } else if (key === "accentColor") {
          setAccentColor(value)
        }
      } else {
        setError("Failed to update settings.")
      }
    } catch (e) {
      setError("An error occurred.")
    } finally {
      setSaving(false)
    }
  }

  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor },
  ]

  const colors = [
    { id: "monochrome", name: "Monochrome", color: "bg-white" },
  ]

  if (loading) {
    return <GlassCard><div className="p-8 text-center">Loading...</div></GlassCard>
  }

  return (
    <GlassCard>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Palette className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Theme</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.id}
                  variant="outline"
                  onClick={() => updateSetting("theme", themeOption.id)}
                  disabled={saving}
                  className={cn(
                    "flex flex-col items-center gap-2 h-20 bg-white/5 backdrop-blur-xl border border-white/10",
                    theme === themeOption.id && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  <themeOption.icon className="h-5 w-5" />
                  <span className="text-sm">{themeOption.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-foreground font-medium">Accent Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <Button
                  key={color.id}
                  variant="outline"
                  onClick={() => updateSetting("accentColor", color.id)}
                  disabled={saving}
                  className={cn(
                    "flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10",
                    accentColor === color.id && "border-white bg-white/10",
                  )}
                >
                  <div className={cn("w-4 h-4 rounded-full", color.color)} />
                  <span className="text-sm">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
