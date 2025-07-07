"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Globe } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ShareButton } from "@/components/share-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { ReadingTracker } from "@/components/reading-tracker"

interface ArticleViewProps {
  article: {
    title: string
    url: string
    imageUrl: string | null
    description: string | null
    source: string | null
    publishedAt: string | null
    category?: string
  }
}

export function ArticleView({ article }: ArticleViewProps) {
  const router = useRouter()

  // Convert to the format expected by ReadingTracker
  const trackingArticle = {
    title: article.title,
    url: article.url,
    urlToImage: article.imageUrl,
    description: article.description,
    source: { id: null, name: article.source || "" },
    author: null,
    publishedAt: article.publishedAt || "",
    content: null,
  }

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        {article.imageUrl && (
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=320&width=640`
              }}
            />
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <CardDescription className="flex items-center mt-2 text-sm">
                {article.source && <span>{article.source}</span>}
                {article.publishedAt && (
                  <>
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDistanceToNow(new Date(article.publishedAt))}</span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <ShareButton articleTitle={article.title} articleUrl={article.url} />
              {/* Convert article data to the format expected by BookmarkButton */}
              <BookmarkButton
                article={{
                  title: article.title,
                  url: article.url,
                  urlToImage: article.imageUrl,
                  description: article.description,
                  source: { id: null, name: article.source || "" },
                  author: null,
                  publishedAt: article.publishedAt || "",
                  content: null,
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="mb-4">{article.description}</p>
          <Button asChild variant="outline" className="mt-4">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" /> Read full article on original website
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Track reading */}
      <ReadingTracker article={trackingArticle} category={article.category} />
    </div>
  )
}
