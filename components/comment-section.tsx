"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CommentForm } from "@/components/comment-form"
import { supabase } from "@/lib/supabase/client"

interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  profiles: {
    username: string | null
    avatar_url: string | null
  }
}

interface CommentSectionProps {
  articleUrl: string
}

export function CommentSection({ articleUrl }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)

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

          setComments(commentsWithProfiles)
        } else {
          setComments([])
        }
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

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUserId(session?.user?.id || null)
    }

    fetchComments()
    checkAuth()
  }, [articleUrl, toast])

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

  const handleAddComment = (newComment: Comment) => {
    setComments([newComment, ...comments])
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentForm articleUrl={articleUrl} onCommentAdded={handleAddComment} />

          {loading ? (
            <div className="text-center py-4">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No comments yet. Be the first to comment!</div>
          ) : (
            <div className="space-y-6 mt-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    {comment.profiles.avatar_url ? (
                      <AvatarImage
                        src={comment.profiles.avatar_url || "/placeholder.svg"}
                        alt={comment.profiles.username || "User"}
                      />
                    ) : (
                      <AvatarFallback>{(comment.profiles.username || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{comment.profiles.username || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDistanceToNow(new Date(comment.created_at))}
                        </span>
                      </div>
                      {userId === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
