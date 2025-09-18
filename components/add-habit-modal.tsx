"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createHabit } from "../supabase/database"
import { supabase } from "../supabase/client"

interface AddHabitModalProps {
  onHabitAdded?: () => void
}

export function AddHabitModal({ onHabitAdded }: AddHabitModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "🎯",
    category: "other",
    target: 1,
  })

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert("Please sign in to add habits")
        return
      }

      const habitData = {
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon || "🎯",
        category: formData.category,
        target_value: formData.target,
        user_id: user.id,
      }

      const newHabit = await createHabit(habitData)
      
      if (newHabit) {
        setFormData({
          name: "",
          description: "",
          icon: "🎯",
          category: "other",
          target: 1,
        })
        setOpen(false)
        onHabitAdded?.()
      }
    } catch (error) {
      console.error("Failed to create habit:", error)
      alert("Failed to create habit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-responsive-lg">Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-responsive">Habit Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="e.g., Morning Meditation"
              required
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white text-responsive">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Describe your habit..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-white text-responsive">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => updateFormData("icon", e.target.value)}
                placeholder="🎯"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white text-responsive">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => updateFormData("category", e.target.value)}
                placeholder="e.g., Health, Learning"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target" className="text-white text-responsive">Target Value</Label>
            <Input
              id="target"
              type="number"
              min="1"
              value={formData.target}
              onChange={(e) => updateFormData("target", parseInt(e.target.value))}
              placeholder="1"
              required
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="btn-secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Adding..." : "Add Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}