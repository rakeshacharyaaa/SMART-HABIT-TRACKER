import { type NextRequest, NextResponse } from "next/server"
import { getHabitStats } from "../../../../supabase/database"
import { supabase } from "../../../../supabase/client"

export async function GET(request: NextRequest) {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getHabitStats(user.id)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
