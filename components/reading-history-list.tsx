"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "@/lib/utils"
import { clearReadingHistory } from "@/actions/reading-history"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ReadingHistoryItem {
  id: string
  article_title: string
  article_url: string
  article_image_url: string | null
  article_source: string | null
  article_category: string | null
  read_at: string
}

interface ReadingHistoryListProps {
  initialHistory: ReadingHistoryItem[]
}

export function ReadingHistoryList({ initialHistory }: ReadingHistoryListProps) {
  const [history, setHistory] = useState<ReadingHistoryItem[]>(initialHistory)
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const handleClearHistory = async () => {
    setIsClearing(true)
    try {
      const { success, error } = await clearReadingHistory()

      if (success) {
        setHistory([])
        toast({
          title: "History cleared",
          description: "Your reading history has been cleared",
        })
      } else if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error clearing history:", error)
      toast({
        title: "Error",
        description: "Failed to clear reading history",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No reading history yet</h3>
        <p className="text-muted-foreground mt-2">Browse articles to start building your reading history</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recently Read Articles</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete your entire reading history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearHistory}
                disabled={isClearing}
                className="bg-red-500 hover:bg-red-600"
              >
                {isClearing ? "Clearing..." : "Clear History"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <Card key={item.id} className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative w-full h-48">
              {item.article_image_url ? (
                <Image
                  src={item.article_image_url || "/placeholder.svg"}
                  alt={item.article_title}
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
              {item.article_category && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.article_category}
                </div>
              )}
            </div>

            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg line-clamp-2">{item.article_title}</CardTitle>
              <CardDescription className="flex items-center text-xs">
                <span>{item.article_source}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>Read {formatDistanceToNow(new Date(item.read_at))}</span>
              </CardDescription>
            </CardHeader>

            <CardFooter className="p-4 pt-0 mt-auto">
              <div className="flex gap-2 w-full">
                <Button asChild variant="outline" size="sm" className="w-1/2">
                  <Link
                    href={`/article?url=${encodeURIComponent(item.article_url)}`}
                    className="flex items-center justify-center"
                  >
                    View Article
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-1/2">
                  <a
                    href={item.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Original <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
