"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Camera } from "lucide-react"
import { getCurrentUser, updateUserProfile } from "../supabase/database"

export function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getCurrentUser().then((user) => {
      if (mounted && user) {
        setProfile({
          name: user.name || "",
          email: user.email || "",
          bio: user.bio || "",
        })
      }
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const updated = await updateUserProfile({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
      })
      if (updated) {
        setSuccess("Profile updated!")
        setIsEditing(false)
      } else {
        setError("Failed to update profile.")
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/5 backdrop-blur-xl border border-white/10"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <Avatar className="h-20 w-20 ring-2 ring-primary/20">
              <AvatarImage src="/diverse-user-avatars.png" alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile.name ? profile.name.slice(0,2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-secondary hover:bg-secondary/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 bg-white/5 backdrop-blur-xl border border-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 bg-white/5 backdrop-blur-xl border border-white/10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                className="bg-white/5 backdrop-blur-xl border border-white/10 min-h-[80px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="bg-white/5 backdrop-blur-xl border border-white/10"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 neon-glow" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
