"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CommentFormProps {
  articleUrl: string
  onCommentAdded?: (comment: any) => void
}

export function CommentForm({ articleUrl, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to comment",
          variant: "destructive",
        })
        return
      }

      // Add the comment
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .insert({
          user_id: session.user.id,
          article_url: articleUrl,
          content: content.trim(),
        })
        .select("id, content, created_at, updated_at, user_id")
        .single()

      if (commentError) throw commentError

      // Get the user's profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session.user.id)
        .single()

      // Combine comment with profile data
      const newComment = {
        ...commentData,
        profiles: profileData || { username: null, avatar_url: null },
      }

      setContent("")
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })

      // Add the new comment to the list
      if (onCommentAdded && newComment) {
        onCommentAdded(newComment)
      }

      // Refresh the page to show the new comment
      router.refresh()
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated === false) {
    return (
      <div className="bg-muted p-4 rounded-md text-center">
        <p className="mb-2">You need to be signed in to comment</p>
        <Button onClick={() => router.push("/auth")}>Sign In</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
        disabled={isLoading}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim() || isLoading}>
          {isLoading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  )
}
