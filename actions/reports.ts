"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getTopHeadlines, getCountryName } from "@/lib/news-service"

// Helper function to generate CSV content
function generateCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(",")
  const rows = data.map((item) =>
    headers
      .map((header) => {
        const value = item[header] || ""
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === "string" && (value.includes(",") || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value
      })
      .join(","),
  )

  return [headerRow, ...rows].join("\n")
}

// Generate news report
export async function generateNewsReport({
  country,
  category,
  startDate,
  endDate,
  format,
}: {
  country: string
  category: string
  startDate: string
  endDate: string
  format: "pdf" | "csv"
}) {
  try {
    // Fetch news data
    const articles = await getTopHeadlines({
      country,
      category: category === "all" ? undefined : category,
      pageSize: 100,
    })

    // Filter by date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const filteredArticles = articles.filter((article) => {
      const publishDate = new Date(article.publishedAt)
      return publishDate >= start && publishDate <= end
    })

    // Process data for report
    const reportData = filteredArticles.map((article) => ({
      title: article.title,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url,
    }))

    // Generate report based on format
    if (format === "csv") {
      const csvContent = generateCSV(reportData, ["title", "source", "publishedAt", "url"])

      // In a real application, you would save this to a file and return a download URL
      // For this example, we'll simulate a download by returning the content
      const countryName = getCountryName(country)
      const fileName = `news_report_${countryName.replace(/\s+/g, "_").toLowerCase()}_${category}_${new Date().toISOString().split("T")[0]}.csv`

      // In a real application, you would use a file storage service
      // For this example, we'll just log the content
      console.log(`Generated CSV report: ${fileName}`)
      console.log(csvContent.substring(0, 200) + "...")

      return { success: true, fileName, reportData }
    } else {
      // PDF generation would typically be done server-side with a library like PDFKit
      // For this example, we'll just simulate it
      const countryName = getCountryName(country)
      const fileName = `news_report_${countryName.replace(/\s+/g, "_").toLowerCase()}_${category}_${new Date().toISOString().split("T")[0]}.pdf`

      console.log(`Generated PDF report: ${fileName}`)
      console.log(`Report contains ${reportData.length} articles`)

      return { success: true, fileName, reportData }
    }
  } catch (error) {
    console.error("Error generating news report:", error)
    throw new Error("Failed to generate news report")
  }
}

// Generate user activity report
export async function generateUserActivityReport({
  userId,
  startDate,
  endDate,
  includeBookmarks,
  includeFavorites,
  includeComments,
  format,
}: {
  userId: string
  startDate: string
  endDate: string
  includeBookmarks: boolean
  includeFavorites: boolean
  includeComments: boolean
  format: "pdf" | "csv"
}) {
  const supabase = createServerActionClient({ cookies })

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Prepare data collections
    let bookmarksData: any[] = []
    let favoritesData: any[] = []
    let commentsData: any[] = []

    // Fetch data based on user selections
    if (includeBookmarks) {
      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: false })

      bookmarksData = bookmarks || []
    }

    if (includeFavorites) {
      const { data: favorites } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: false })

      favoritesData = favorites || []
    }

    if (includeComments) {
      const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: false })

      commentsData = comments || []
    }

    // Process data for report
    const reportData = {
      bookmarks: bookmarksData.map((b) => ({
        type: "Bookmark",
        title: b.article_title,
        collection: b.collection_name,
        date: new Date(b.created_at).toLocaleDateString(),
        url: b.article_url,
      })),
      favorites: favoritesData.map((f) => ({
        type: "Favorite",
        title: f.article_title,
        date: new Date(f.created_at).toLocaleDateString(),
        url: f.article_url,
      })),
      comments: commentsData.map((c) => ({
        type: "Comment",
        content: c.content,
        date: new Date(c.created_at).toLocaleDateString(),
        url: c.article_url,
      })),
    }

    // Combine all data for the report
    const allData = [...reportData.bookmarks, ...reportData.favorites, ...reportData.comments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    // Generate report based on format
    if (format === "csv") {
      const csvContent = generateCSV(allData, ["type", "title", "content", "collection", "date", "url"])

      const fileName = `user_activity_report_${new Date().toISOString().split("T")[0]}.csv`

      console.log(`Generated CSV activity report: ${fileName}`)
      console.log(csvContent.substring(0, 200) + "...")

      return { success: true, fileName, reportData: allData }
    } else {
      // PDF generation would typically be done server-side
      const fileName = `user_activity_report_${new Date().toISOString().split("T")[0]}.pdf`

      console.log(`Generated PDF activity report: ${fileName}`)
      console.log(`Report contains ${allData.length} items`)

      return { success: true, fileName, reportData: allData }
    }
  } catch (error) {
    console.error("Error generating user activity report:", error)
    throw new Error("Failed to generate user activity report")
  }
}
