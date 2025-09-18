import { type NextRequest, NextResponse } from "next/server"
import { getUserHabits, createHabit } from "../../../../supabase/database"
import { supabase } from "../../../../supabase/client"

export async function GET(request: NextRequest) {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const habits = await getUserHabits(user.id)

    return NextResponse.json({ habits })
  } catch (error) {
    console.error("Error fetching habits:", error)
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const habitData = {
      ...body,
      user_id: user.id,
      is_active: true,
    }

    const newHabit = await createHabit(habitData)

    return NextResponse.json({ habit: newHabit }, { status: 201 })
  } catch (error) {
    console.error("Error creating habit:", error)
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 })
  }
}
