import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ReadingHistoryList } from "@/components/reading-history-list"

export default async function ReadingHistoryPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not logged in, redirect to auth page
  if (!session) {
    redirect("/auth")
  }

  // Fetch user's reading history
  const { data: history } = await supabase
    .from("reading_history")
    .select("*")
    .eq("user_id", session.user.id)
    .order("read_at", { ascending: false })
    .limit(50)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Reading History</h1>
      <ReadingHistoryList initialHistory={history || []} />
    </main>
  )
}
