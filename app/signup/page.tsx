import { SignupForm } from "@/components/signup-form"
import { GlassCard } from "@/components/glass-card"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Smart Habit Tracker
          </h1>
          <p className="text-muted-foreground">Start your habit journey today</p>
        </div>

        <GlassCard variant="glow">
          <SignupForm />
        </GlassCard>
      </div>
    </div>
  )
}
