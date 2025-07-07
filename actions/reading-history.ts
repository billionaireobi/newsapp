"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Article } from "@/types/news"

export async function addToReadingHistory(article: Article, category?: string) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in to track reading history" }
  }

  try {
    const { error } = await supabase.from("reading_history").upsert({
      user_id: session.user.id,
      article_title: article.title,
      article_url: article.url,
      article_image_url: article.urlToImage,
      article_source: article.source.name,
      article_category: category || "general",
      read_at: new Date().toISOString(),
    })

    if (error) throw error

    revalidatePath("/history")
    return { success: true }
  } catch (error: any) {
    console.error("Error adding to reading history:", error)
    return {
      success: false,
      error: "Failed to update reading history",
    }
  }
}

export async function getReadingHistory(limit = 50) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, history: [], error: "You must be logged in to view reading history" }
  }

  try {
    const { data, error } = await supabase
      .from("reading_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("read_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, history: data }
  } catch (error: any) {
    console.error("Error fetching reading history:", error)
    return {
      success: false,
      history: [],
      error: "Failed to fetch reading history",
    }
  }
}

export async function clearReadingHistory() {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in to clear reading history" }
  }

  try {
    const { error } = await supabase.from("reading_history").delete().eq("user_id", session.user.id)

    if (error) throw error

    revalidatePath("/history")
    return { success: true }
  } catch (error: any) {
    console.error("Error clearing reading history:", error)
    return {
      success: false,
      error: "Failed to clear reading history",
    }
  }
}
