import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { FavoritesList } from "@/components/favorites-list"

export default async function FavoritesPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not logged in, redirect to auth page
  if (!session) {
    redirect("/auth")
  }

  // Fetch user's favorites
  const { data: favorites } = await supabase.from("favorites").select("*").order("created_at", { ascending: false })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorite Articles</h1>
      <FavoritesList initialFavorites={favorites || []} />
    </main>
  )
}
