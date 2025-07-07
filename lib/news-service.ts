import type { Article, NewsApiResponse } from "@/types/news"

const API_KEY = process.env.NEWS_API_KEY
const BASE_URL = "https://newsapi.org/v2"

export type NewsParams = {
  category?: string
  q?: string
  pageSize?: number
  page?: number
  country?: string
}

// Generate mock articles based on category and query
function generateMockArticles(params: NewsParams): Article[] {
  const { category = "general", q = "", pageSize = 10 } = params
  const mockArticles: Article[] = []

  const categories = {
    general: ["World News", "Daily Updates", "Breaking News"],
    business: ["Market Trends", "Business Insights", "Economic Updates"],
    technology: ["Tech Innovations", "Digital Trends", "Tech News"],
    entertainment: ["Celebrity News", "Entertainment Weekly", "Movie Reviews"],
    sports: ["Sports Updates", "Game Results", "Athletic Achievements"],
    science: ["Scientific Discoveries", "Research News", "Innovation Highlights"],
    health: ["Health Tips", "Medical Research", "Wellness News"],
  }

  const titles = categories[category as keyof typeof categories] || categories.general

  for (let i = 0; i < pageSize; i++) {
    const randomIndex = Math.floor(Math.random() * titles.length)
    const baseTitle = titles[randomIndex]
    const title = q ? `${baseTitle}: ${q}` : baseTitle

    mockArticles.push({
      source: { id: "mock-source", name: "Demo News" },
      author: "Demo Author",
      title: `${title} ${i + 1}`,
      description:
        "This is mock content because the NEWS_API_KEY is not configured. Please add your News API key to the environment variables.",
      url: "#",
      urlToImage: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(category)}`,
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      content:
        "This is mock content generated because the NEWS_API_KEY environment variable is not set. To see real news, please add your News API key to the environment variables.",
    })
  }

  return mockArticles
}

// Helper function to validate API key
function validateApiKey(): boolean {
  if (!API_KEY) {
    console.warn("NEWS_API_KEY environment variable is not set. Using mock data instead.")
    return false
  }
  return true
}

export async function getTopHeadlines(params: NewsParams = {}): Promise<Article[]> {
  try {
    // Check if API key is available
    if (!validateApiKey()) {
      return generateMockArticles(params)
    }

    const { category = "general", q = "", pageSize = 20, page = 1, country = "us" } = params

    const queryParams = new URLSearchParams({
      apiKey: API_KEY!,
      country,
      pageSize: pageSize.toString(),
      page: page.toString(),
    })

    if (category && category !== "all") {
      queryParams.append("category", category)
    }

    if (q) {
      queryParams.append("q", q)
    }

    const response = await fetch(`${BASE_URL}/top-headlines?${queryParams.toString()}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`News API error: ${response.status} - ${errorText}`)

      // For 401 errors, log more detailed information
      if (response.status === 401) {
        console.error("API Key authentication failed. Please check your NEWS_API_KEY environment variable.")
      }

      // Return mock data for any API error
      return generateMockArticles(params)
    }

    const data: NewsApiResponse = await response.json()
    return data.articles || []
  } catch (error) {
    console.error("Failed to fetch news:", error)
    return generateMockArticles(params)
  }
}

export async function searchNews(params: NewsParams = {}): Promise<Article[]> {
  try {
    const { q = "", pageSize = 20, page = 1 } = params

    if (!q) return []

    // Check if API key is available
    if (!validateApiKey()) {
      return generateMockArticles({ ...params, category: "general" })
    }

    const queryParams = new URLSearchParams({
      apiKey: API_KEY!,
      q,
      pageSize: pageSize.toString(),
      page: page.toString(),
    })

    const response = await fetch(`${BASE_URL}/everything?${queryParams.toString()}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`News API error: ${response.status} - ${errorText}`)

      // Return mock data for any API error
      return generateMockArticles({ ...params, category: "general" })
    }

    const data: NewsApiResponse = await response.json()
    return data.articles || []
  } catch (error) {
    console.error("Failed to search news:", error)
    return generateMockArticles({ ...params, category: "general" })
  }
}

// Get available countries for the News API
export const availableCountries = [
  { code: "ae", name: "United Arab Emirates" },
  { code: "ar", name: "Argentina" },
  { code: "at", name: "Austria" },
  { code: "au", name: "Australia" },
  { code: "be", name: "Belgium" },
  { code: "bg", name: "Bulgaria" },
  { code: "br", name: "Brazil" },
  { code: "ca", name: "Canada" },
  { code: "ch", name: "Switzerland" },
  { code: "cn", name: "China" },
  { code: "co", name: "Colombia" },
  { code: "cu", name: "Cuba" },
  { code: "cz", name: "Czech Republic" },
  { code: "de", name: "Germany" },
  { code: "eg", name: "Egypt" },
  { code: "fr", name: "France" },
  { code: "gb", name: "United Kingdom" },
  { code: "gr", name: "Greece" },
  { code: "hk", name: "Hong Kong" },
  { code: "hu", name: "Hungary" },
  { code: "id", name: "Indonesia" },
  { code: "ie", name: "Ireland" },
  { code: "il", name: "Israel" },
  { code: "in", name: "India" },
  { code: "it", name: "Italy" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "lt", name: "Lithuania" },
  { code: "lv", name: "Latvia" },
  { code: "ma", name: "Morocco" },
  { code: "mx", name: "Mexico" },
  { code: "my", name: "Malaysia" },
  { code: "ng", name: "Nigeria" },
  { code: "nl", name: "Netherlands" },
  { code: "no", name: "Norway" },
  { code: "nz", name: "New Zealand" },
  { code: "ph", name: "Philippines" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "ro", name: "Romania" },
  { code: "rs", name: "Serbia" },
  { code: "ru", name: "Russia" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "se", name: "Sweden" },
  { code: "sg", name: "Singapore" },
  { code: "si", name: "Slovenia" },
  { code: "sk", name: "Slovakia" },
  { code: "th", name: "Thailand" },
  { code: "tr", name: "Turkey" },
  { code: "tw", name: "Taiwan" },
  { code: "ua", name: "Ukraine" },
  { code: "us", name: "United States" },
  { code: "ve", name: "Venezuela" },
  { code: "za", name: "South Africa" },
]

// Get country name from country code
export function getCountryName(countryCode: string): string {
  const country = availableCountries.find((c) => c.code === countryCode)
  return country ? country.name : "Unknown"
}
