"use client"

import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, Sparkles, Menu } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCurrentUser } from "../supabase/database"
import { supabase } from "../supabase/client"
import { useRouter } from "next/navigation"

export function DashboardHeader({ onHamburgerClick }: { onHamburgerClick?: () => void }) {
  const [user, setUser] = useState<{ name?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    let mounted = true
    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
      <div className="flex items-center gap-2">
        {/* Hamburger menu for mobile */}
        {onHamburgerClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2 border text-foreground hover:bg-secondary"
            onClick={onHamburgerClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <div className="space-y-1">
          <h1 className="text-responsive-xl font-bold text-foreground">
            {loading ? "Good morning!" : `Good morning, ${user?.name || "User"}!`}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 text-responsive">
            <Sparkles className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button
            variant="ghost"
            size="icon"
            className="border text-foreground hover:bg-secondary"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="border text-foreground hover:bg-secondary"
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/")
          }}
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 ring-2 ring-border">
          <AvatarImage src="/diverse-user-avatars.png" alt="User" />
          <AvatarFallback className="bg-secondary text-foreground">AX</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
