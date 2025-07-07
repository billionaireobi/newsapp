import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // In a real application, you would fetch the article content and parse it
    // This is a simplified example that returns minimal data
    // You would need a server-side solution to handle CORS and parse HTML

    // For now, we'll just return the URL as the only guaranteed data
    return NextResponse.json({
      title: "Article from external source",
      description: "This article content would be fetched from the original source.",
      source: new URL(url).hostname.replace("www.", ""),
    })
  } catch (error) {
    console.error("Error fetching article info:", error)
    return NextResponse.json({ error: "Failed to fetch article information" }, { status: 500 })
  }
}
