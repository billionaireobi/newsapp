import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ success: false, collections: [] })
  }

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("collection_name")
      .eq("user_id", session.user.id)
      .order("collection_name")

    if (error) throw error

    // Get unique collection names
    const uniqueCollections = Array.from(new Set(data.map((item) => item.collection_name)))
    return NextResponse.json({ success: true, collections: uniqueCollections })
  } catch (error) {
    console.error("Error fetching bookmark collections:", error)
    return NextResponse.json({ success: false, collections: [] })
  }
}
