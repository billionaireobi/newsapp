"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function addComment(articleUrl: string, content: string) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in to comment" }
  }

  try {
    const { error } = await supabase.from("comments").insert({
      user_id: session.user.id,
      article_url: articleUrl,
      content,
    })

    if (error) throw error

    revalidatePath(`/article?url=${encodeURIComponent(articleUrl)}`)
    return { success: true }
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return {
      success: false,
      error: "Failed to add comment",
    }
  }
}

export async function deleteComment(commentId: string, articleUrl: string) {
  const supabase = createServerActionClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  try {
    // Only allow users to delete their own comments
    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", session.user.id)

    if (error) throw error

    revalidatePath(`/article?url=${encodeURIComponent(articleUrl)}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting comment:", error)
    return { success: false, error: "Failed to delete comment" }
  }
}

export async function getComments(articleUrl: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    // First, get all comments for the article
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        updated_at,
        user_id
      `)
      .eq("article_url", articleUrl)
      .order("created_at", { ascending: false })

    if (commentsError) throw commentsError

    // If we have comments, fetch the profile information for each comment
    if (commentsData && commentsData.length > 0) {
      // Get unique user IDs
      const userIds = [...new Set(commentsData.map((comment) => comment.user_id))]

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds)

      if (profilesError) throw profilesError

      // Create a map of user_id to profile data
      const profilesMap = (profilesData || []).reduce((map, profile) => {
        map[profile.id] = profile
        return map
      }, {})

      // Combine comments with their profile data
      const commentsWithProfiles = commentsData.map((comment) => ({
        ...comment,
        profiles: profilesMap[comment.user_id] || { username: null, avatar_url: null },
      }))

      return { success: true, comments: commentsWithProfiles }
    } else {
      return { success: true, comments: [] }
    }
  } catch (error) {
    console.error("Error fetching comments:", error)
    return { success: false, comments: [] }
  }
}
