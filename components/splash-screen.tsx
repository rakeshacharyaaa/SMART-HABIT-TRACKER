"use client"

import { useState, useEffect } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showGetStarted, setShowGetStarted] = useState(false)
  const [pixelText, setPixelText] = useState("")

  const features = [
    {
      icon: "🎯",
      title: "TRACK HABITS",
      description: "Level up your daily quests!",
    },
    {
      icon: "📊",
      title: "VIEW STATS",
      description: "Check your progress bars!",
    },
    {
      icon: "📅",
      title: "STAY CONSISTENT",
      description: "Maintain your streak combo!",
    },
  ]

  const appTitle = "SMART HABIT TRACKER"

  useEffect(() => {
    let index = 0
    const typeWriter = () => {
      if (index < appTitle.length) {
        setPixelText(appTitle.substring(0, index + 1))
        index++
        setTimeout(typeWriter, 100)
      }
    }
    typeWriter()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < features.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setShowGetStarted(true)
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [currentStep, features.length])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="inline-block p-6 card mb-6">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-responsive-xl font-bold">
              {pixelText}
              <span className="animate-pulse">|</span>
            </div>
          </div>

          <p className="text-responsive text-muted-foreground">
            Build consistency. Unlock progress.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Feature Showcase
          </h3>

          <div className="text-center">
            <div className="text-6xl mb-4">
              {features[currentStep].icon}
            </div>

            <h4 className="text-responsive-lg font-semibold mb-2">
              {features[currentStep].title}
            </h4>

            <p className="text-responsive text-muted-foreground">
              {features[currentStep].description}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep ? "bg-foreground" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {showGetStarted && (
          <div className="text-center">
            <button
              className="btn-primary text-responsive-lg px-8 py-4"
              onClick={onComplete}
            >
              Get Started
            </button>

            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                Press button to continue
              </span>
            </div>
          </div>
        )}

        <div className="fixed top-4 right-4">
          <div className="card px-3 py-2">
            <span className="text-xs text-muted-foreground">
              Loading... {Math.floor(((currentStep + 1) / features.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
