import { type NextRequest, NextResponse } from "next/server"
import { getHabit, updateHabit, deleteHabit } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const habit = await getHabit(params.id)

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    return NextResponse.json({ habit })
  } catch (error) {
    console.error("Error fetching habit:", error)
    return NextResponse.json({ error: "Failed to fetch habit" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updatedHabit = await updateHabit(params.id, body)

    if (!updatedHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    return NextResponse.json({ habit: updatedHabit })
  } catch (error) {
    console.error("Error updating habit:", error)
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteHabit(params.id)

    if (!success) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Habit deleted successfully" })
  } catch (error) {
    console.error("Error deleting habit:", error)
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 })
  }
}
