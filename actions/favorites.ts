"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Article } from "@/types/news"

export async function addToFavorites(article: Article) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in to save favorites" }
  }

  try {
    const { error } = await supabase.from("favorites").insert({
      user_id: session.user.id,
      article_title: article.title,
      article_url: article.url,
      article_image_url: article.urlToImage,
      article_description: article.description,
      article_source: article.source.name,
      article_published_at: article.publishedAt,
    })

    if (error) throw error

    revalidatePath("/favorites")
    return { success: true }
  } catch (error: any) {
    console.error("Error adding to favorites:", error)
    return {
      success: false,
      error: error.code === "23505" ? "Article already in favorites" : "Failed to add to favorites",
    }
  }
}

export async function removeFromFavorites(articleUrl: string) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", session.user.id)
      .eq("article_url", articleUrl)

    if (error) throw error

    revalidatePath("/favorites")
    return { success: true }
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return { success: false, error: "Failed to remove from favorites" }
  }
}

export async function checkIsFavorite(articleUrl: string) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return false
  }

  try {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("article_url", articleUrl)
      .single()

    return !!data
  } catch (error) {
    return false
  }
}
