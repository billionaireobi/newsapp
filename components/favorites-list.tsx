"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, Trash2 } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { removeFromFavorites } from "@/actions/favorites"
import { useToast } from "@/hooks/use-toast"
import { ShareButton } from "@/components/share-button"

interface Favorite {
  id: string
  article_title: string
  article_url: string
  article_image_url: string | null
  article_description: string | null
  article_source: string | null
  article_published_at: string | null
  created_at: string
}

interface FavoritesListProps {
  initialFavorites: Favorite[]
}

export function FavoritesList({ initialFavorites }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites)
  const { toast } = useToast()

  const handleRemoveFavorite = async (articleUrl: string) => {
    const { success, error } = await removeFromFavorites(articleUrl)

    if (success) {
      setFavorites(favorites.filter((fav) => fav.article_url !== articleUrl))
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
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No favorites yet</h3>
        <p className="text-muted-foreground mt-2">
          Browse articles and click the bookmark icon to add them to your favorites
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => (
        <Card key={favorite.id} className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative w-full h-48">
            {favorite.article_image_url ? (
              <Image
                src={favorite.article_image_url || "/placeholder.svg"}
                alt={favorite.article_title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=192&width=384`
                }}
              />
            ) : (
              <Image
                src={`/placeholder.svg?height=192&width=384`}
                alt="No image available"
                fill
                className="object-cover bg-muted"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <ShareButton articleTitle={favorite.article_title} articleUrl={favorite.article_url} />
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveFavorite(favorite.article_url)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg line-clamp-2">{favorite.article_title}</CardTitle>
            <CardDescription className="flex items-center text-xs">
              <span>{favorite.article_source}</span>
              {favorite.article_published_at && (
                <>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDistanceToNow(new Date(favorite.article_published_at))}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {favorite.article_description || "No description available"}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href={favorite.article_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Read More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
