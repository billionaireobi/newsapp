"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { addToFavorites, removeFromFavorites, checkIsFavorite } from "@/actions/favorites"
import { supabase } from "@/lib/supabase/client"
import type { Article } from "@/types/news"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  article: Article
}

export function FavoriteButton({ article }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      if (session) {
        setIsChecking(true)
        const result = await checkIsFavorite(article.url)
        setIsFavorite(result)
        setIsChecking(false)
      } else {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [article.url])

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        const { success, error } = await removeFromFavorites(article.url)
        if (success) {
          setIsFavorite(false)
          toast({
            title: "Removed from favorites",
            description: "Article has been removed from your favorites",
          })
        } else if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        }
      } else {
        const { success, error } = await addToFavorites(article)
        if (success) {
          setIsFavorite(true)
          toast({
            title: "Added to favorites",
            description: "Article has been added to your favorites",
          })
        } else if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
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
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  )
}
