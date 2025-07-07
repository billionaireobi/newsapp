"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { addToReadingHistory } from "@/actions/reading-history"
import { supabase } from "@/lib/supabase/client"
import type { Article } from "@/types/news"

interface ReadingTrackerProps {
  article: Article
  category?: string
}

export function ReadingTracker({ article, category }: ReadingTrackerProps) {
  const router = useRouter()

  useEffect(() => {
    const trackReading = async () => {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Only track if user is logged in
        await addToReadingHistory(article, category)
      }
    }

    // Track reading after a short delay to ensure the user actually read the article
    const timer = setTimeout(() => {
      trackReading()
    }, 5000)

    return () => clearTimeout(timer)
  }, [article, category])

  // This component doesn't render anything
  return null
}
