"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Target, BarChart3, Calendar, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "../supabase/database"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Habits", href: "/dashboard/habits", icon: Target },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string; email?: string; avatar_url?: string } | null>(null)
  const [loading, setLoading] = useState(true)

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
    <div className={cn("flex flex-col h-screen transition-all duration-300 p-4", collapsed ? "w-20" : "w-64")}> 
      <div className="flex-1 flex flex-col p-4 card">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-foreground" />
              <span className="font-bold text-lg text-foreground">
                Habits
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 border text-foreground hover:bg-secondary"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-12 transition-all duration-200",
                    collapsed ? "px-3" : "px-4",
                    isActive
                      ? "bg-primary text-primary-foreground border"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-border pt-4 mt-4">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src={user?.avatar_url || "/diverse-user-avatars.png"} alt="User" />
                <AvatarFallback className="bg-secondary text-foreground">
                  {user?.name ? user.name.slice(0,2).toUpperCase() : "AX"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{loading ? "Loading..." : user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{loading ? "" : user?.email || ""}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src={user?.avatar_url || "/diverse-user-avatars.png"} alt="User" />
                <AvatarFallback className="bg-secondary text-foreground">
                  {user?.name ? user.name.slice(0,2).toUpperCase() : "AX"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <Button
            variant="ghost"
            className={cn(
              "w-full mt-2 text-foreground hover:bg-secondary",
              collapsed ? "px-3" : "justify-start gap-3 px-4",
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
