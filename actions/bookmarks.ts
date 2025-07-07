"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Article } from "@/types/news"

export async function addToBookmarks(article: Article, collectionName = "Default") {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in to bookmark articles" }
  }

  try {
    const { error } = await supabase.from("bookmarks").insert({
      user_id: session.user.id,
      article_title: article.title,
      article_url: article.url,
      article_image_url: article.urlToImage,
      article_description: article.description,
      article_source: article.source.name,
      article_published_at: article.publishedAt,
      collection_name: collectionName,
    })

    if (error) throw error

    revalidatePath("/bookmarks")
    return { success: true }
  } catch (error: any) {
    console.error("Error adding to bookmarks:", error)
    return {
      success: false,
      error: error.code === "23505" ? "Article already in bookmarks" : "Failed to add to bookmarks",
    }
  }
}

export async function removeFromBookmarks(articleUrl: string, collectionName = "Default") {
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
      .from("bookmarks")
      .delete()
      .eq("user_id", session.user.id)
      .eq("article_url", articleUrl)
      .eq("collection_name", collectionName)

    if (error) throw error

    revalidatePath("/bookmarks")
    return { success: true }
  } catch (error) {
    console.error("Error removing from bookmarks:", error)
    return { success: false, error: "Failed to remove from bookmarks" }
  }
}

export async function checkIsBookmarked(articleUrl: string, collectionName = "Default") {
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
      .from("bookmarks")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("article_url", articleUrl)
      .eq("collection_name", collectionName)
      .single()

    return !!data
  } catch (error) {
    return false
  }
}

export async function getBookmarkCollections() {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, collections: [] }
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
    return { success: true, collections: uniqueCollections }
  } catch (error) {
    console.error("Error fetching bookmark collections:", error)
    return { success: false, collections: [] }
  }
}
