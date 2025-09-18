"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { supabase } from "../supabase/client"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace("/dashboard")
      }
    }
    checkSession()
  }, [router])

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 card mb-6">
            <span className="text-2xl">🎯</span>
          </div>

          <h1 className="text-responsive-xl font-bold mb-3">
            Smart Habit Tracker
          </h1>

          <p className="text-responsive text-muted-foreground">
            Build better habits with a clean, minimalist interface
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="card p-6">
          <h2 className="text-responsive-lg font-semibold mb-6 text-center">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          
          <div className="space-y-4">
            {isLogin ? <LoginForm /> : <SignupForm />}
            
            <div className="text-center pt-4">
              <button
                className="btn-secondary text-responsive"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create an account" : "Back to login"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 Smart Habit Tracker
          </p>
        </div>
      </div>
    </div>
  )
}
