"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  article_url: string
  created_at: string
  article_title?: string
}

interface UserCommentsProps {
  userId: string
}

export function UserComments({ userId }: UserCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      try {
        // Fetch comments
        const { data, error } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            article_url,
            created_at
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error

        // For each comment, try to get the article title
        const commentsWithTitles = await Promise.all(
          (data || []).map(async (comment) => {
            // Try to get article title from bookmarks or favorites
            const { data: bookmarkData } = await supabase
              .from("bookmarks")
              .select("article_title")
              .eq("article_url", comment.article_url)
              .limit(1)
              .single()

            if (bookmarkData?.article_title) {
              return { ...comment, article_title: bookmarkData.article_title }
            }

            const { data: favoriteData } = await supabase
              .from("favorites")
              .select("article_title")
              .eq("article_url", comment.article_url)
              .limit(1)
              .single()

            if (favoriteData?.article_title) {
              return { ...comment, article_title: favoriteData.article_title }
            }

            return { ...comment, article_title: "Article" }
          }),
        )

        setComments(commentsWithTitles)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [userId, toast])

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", userId)

      if (error) throw error

      setComments(comments.filter((comment) => comment.id !== commentId))
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>
  }

  if (comments.length === 0) {
    return <div className="text-center py-8">You haven't made any comments yet.</div>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{comment.article_title}</h3>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at))}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteComment(comment.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm mb-3">{comment.content}</p>
            <div className="flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href={`/article?url=${encodeURIComponent(comment.article_url)}`} className="flex items-center">
                  View Article <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
