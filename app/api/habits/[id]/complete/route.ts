import { type NextRequest, NextResponse } from "next/server"
import { recordHabitCompletion } from "../../../../../supabase/database"
import { supabase } from "../../../../../supabase/client"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { value = 1, date } = body

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    // For now, let's use a simple approach - get user from the request
    // In a real app, you'd validate the JWT token
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const completion = await recordHabitCompletion(params.id, user.id, value, date)

    return NextResponse.json({ completion })
  } catch (error) {
    console.error("Error recording habit completion:", error)
    return NextResponse.json({ error: "Failed to record completion" }, { status: 500 })
  }
}
