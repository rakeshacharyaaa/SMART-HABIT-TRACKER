"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Trash2, Download } from "lucide-react"
import { getUserSettings, updateUserSettings, subscribeToUserSettings } from "../supabase/database"
import { supabase } from "../supabase/client"

export function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    dataCollection: false,
    analytics: true,
    publicProfile: false,
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
        setPrivacy({
          dataCollection: settings.data_collection,
          analytics: settings.analytics,
          publicProfile: settings.public_profile,
        })
        setLoading(false)
      }

      // Set up realtime subscription
      const subscription = subscribeToUserSettings(user.id, (updatedSettings) => {
        if (mounted) {
          setPrivacy({
            dataCollection: updatedSettings.data_collection,
            analytics: updatedSettings.analytics,
            publicProfile: updatedSettings.public_profile,
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

  const updatePrivacy = async (key: string, value: boolean) => {
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      const updates: any = {}
      if (key === "dataCollection") updates.data_collection = value
      else if (key === "analytics") updates.analytics = value
      else if (key === "publicProfile") updates.public_profile = value

      const updated = await updateUserSettings(updates)
      if (updated) {
        setSuccess("Settings updated!")
        setPrivacy((prev) => ({ ...prev, [key]: value }))
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
          <div className="p-2 rounded-lg bg-green-400/10">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Privacy & Data</h2>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Data Collection</Label>
              <p className="text-sm text-muted-foreground">Allow collection of usage data to improve the app</p>
            </div>
            <Switch
              checked={privacy.dataCollection}
              onCheckedChange={(checked) => updatePrivacy("dataCollection", checked)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Analytics</Label>
              <p className="text-sm text-muted-foreground">Help us understand how you use the app</p>
            </div>
            <Switch checked={privacy.analytics} onCheckedChange={(checked) => updatePrivacy("analytics", checked)} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-foreground font-medium">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your habit progress visible to others</p>
            </div>
            <Switch
              checked={privacy.publicProfile}
              onCheckedChange={(checked) => updatePrivacy("publicProfile", checked)}
            />
          </div>

          <div className="border-t border-border/50 pt-6 space-y-4">
            <h3 className="text-lg font-medium text-foreground">Data Management</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
