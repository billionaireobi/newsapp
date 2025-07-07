"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Article } from "@/types/news"

interface BookmarkButtonProps {
  article: Article
}

export function BookmarkButton({ article }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setIsChecking(false)
          return
        }

        const { data, error } = await supabase
          .from("bookmarks")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("article_url", article.url)
          .maybeSingle()

        if (error) {
          console.error("Error checking bookmark status:", error)
        } else {
          setIsBookmarked(!!data)
        }

        setIsChecking(false)
      } catch (error) {
        console.error("Error checking bookmark status:", error)
        setIsChecking(false)
      }
    }

    checkBookmarkStatus()
  }, [article.url])

  const handleBookmark = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    setIsLoading(true)

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", session.user.id)
          .eq("article_url", article.url)

        if (error) throw error

        setIsBookmarked(false)
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        })
      } else {
        // Add bookmark
        const { error } = await supabase.from("bookmarks").insert({
          user_id: session.user.id,
          article_title: article.title,
          article_url: article.url,
          article_image_url: article.urlToImage,
          article_description: article.description,
          article_source: article.source.name,
          article_published_at: article.publishedAt,
          collection_name: "Default",
        })

        if (error) {
          if (error.code === "23505") {
            toast({
              title: "Already bookmarked",
              description: "This article is already in your bookmarks",
            })
          } else {
            throw error
          }
        } else {
          setIsBookmarked(true)
          toast({
            title: "Bookmarked",
            description: "Article added to your bookmarks",
          })
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bookmark className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBookmark}
      disabled={isLoading}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  )
}
