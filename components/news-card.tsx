import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import { ShareButton } from "@/components/share-button"
import { BookmarkButton } from "@/components/bookmark-button"
import type { Article } from "@/types/news"

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full h-48">
        {article.urlToImage ? (
          <Image
            src={article.urlToImage || "/placeholder.svg"}
            alt={article.title}
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
        <div className="absolute top-2 right-2 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
          <ShareButton articleTitle={article.title} articleUrl={article.url} />
          <BookmarkButton article={article} />
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="flex items-center text-xs">
          <span>{article.source.name}</span>
          {publishedDate && (
            <>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(publishedDate)}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.description || "No description available"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" size="sm" className="w-1/2">
          <Link href={`/article?url=${encodeURIComponent(article.url)}`} className="flex items-center justify-center">
            Read More
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="w-1/2">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            Original <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
