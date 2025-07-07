import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { BookmarksList } from "@/components/bookmarks-list"

export default async function BookmarksPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not logged in, redirect to auth page
  if (!session) {
    redirect("/auth")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>
      <BookmarksList userId={session.user.id} />
    </main>
  )
}
