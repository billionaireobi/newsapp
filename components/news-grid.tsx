"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import type { Article } from "@/types/news"
import { getTopHeadlines } from "@/lib/news-service"
import { FallbackNewsContent } from "@/components/fallback-news-content"

interface NewsGridProps {
  initialArticles?: Article[]
  articles?: Article[]
}

export function NewsGrid({ initialArticles, articles }: NewsGridProps) {
  // Use provided articles or initialArticles, ensuring we always have an array
  const displayArticles = articles || initialArticles || []

  const searchParams = useSearchParams()
  const [loadedArticles, setLoadedArticles] = useState<Article[]>(displayArticles)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showFallback, setShowFallback] = useState(displayArticles.length === 0)
  const country = searchParams.get("country") || "us"
  const category = searchParams.get("category") || "general"

  useEffect(() => {
    setLoadedArticles(displayArticles)
    setPage(1)
    setHasMore(true)
    setShowFallback(displayArticles.length === 0)
  }, [displayArticles, searchParams])

  const loadMore = async () => {
    const nextPage = page + 1
    setLoading(true)

    try {
      const category = searchParams.get("category") || "general"
      const query = searchParams.get("q") || ""
      const country = searchParams.get("country") || "us"

      const newArticles = await getTopHeadlines({
        category,
        q: query,
        page: nextPage,
        country,
      })

      if (newArticles.length === 0) {
        setHasMore(false)
      } else {
        setLoadedArticles([...loadedArticles, ...newArticles])
        setPage(nextPage)
      }
    } catch (error) {
      console.error("Error loading more articles:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  if (loadedArticles.length === 0 && !showFallback) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No articles found</h3>
        <p className="text-muted-foreground mt-2">Try changing your search, filters, or country</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFallback ? (
        <FallbackNewsContent country={country} category={category} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadedArticles.map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
      )}

      {!showFallback && hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
