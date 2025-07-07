"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trash2, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface Bookmark {
  id: string
  article_title: string
  article_url: string
  article_image_url: string | null
  article_description: string | null
  article_source: string | null
  article_published_at: string | null
  collection_name: string
  created_at: string
}

interface UserActivityProps {
  userId: string
}

export function UserActivity({ userId }: UserActivityProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error

        setBookmarks(data || [])
      } catch (err) {
        console.error("Error fetching bookmarks:", err)
        setError("Failed to load bookmarks. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [userId])

  const handleRemoveBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from("bookmarks").delete().eq("id", id)

      if (error) throw error

      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id))
      toast({
        title: "Bookmark removed",
        description: "Article removed from your bookmarks",
      })
    } catch (err) {
      console.error("Error removing bookmark:", err)
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <p>You haven't bookmarked any articles yet.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Browse articles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="overflow-hidden">
          <div className="relative w-full h-40">
            {bookmark.article_image_url ? (
              <Image
                src={bookmark.article_image_url || "/placeholder.svg"}
                alt={bookmark.article_title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=160&width=320`
                }}
              />
            ) : (
              <Image
                src={`/placeholder.svg?height=160&width=320`}
                alt="No image available"
                fill
                className="object-cover bg-muted"
              />
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => handleRemoveBookmark(bookmark.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="p-4">
            <h3 className="font-medium line-clamp-2 mb-1">{bookmark.article_title}</h3>
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <span>{bookmark.article_source}</span>
              {bookmark.article_published_at && (
                <>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDistanceToNow(new Date(bookmark.article_published_at))}</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {bookmark.article_description || "No description available"}
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="w-1/2">
                <Link
                  href={`/article?url=${encodeURIComponent(bookmark.article_url)}`}
                  className="flex items-center justify-center"
                >
                  Read More
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-1/2">
                <a
                  href={bookmark.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Original <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
