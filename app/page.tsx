import { Suspense } from "react"
import { NewsGrid } from "@/components/news-grid"
import { NewsFilters } from "@/components/news-filters"
import { SearchBar } from "@/components/search-bar"
import { getTopHeadlines, getCountryName } from "@/lib/news-service"
import { CountrySelector } from "@/components/country-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : "general"
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const country = typeof searchParams.country === "string" ? searchParams.country : "us"

  let initialArticles = []
  let fetchError = null
  let usingMockData = false

  try {
    // Check if NEWS_API_KEY is set
    if (!process.env.NEWS_API_KEY) {
      usingMockData = true
    }

    initialArticles = await getTopHeadlines({ category, q: query, country })

    // Check if we're using mock data based on the source
    if (initialArticles.length > 0 && initialArticles[0].source.id === "mock-source") {
      usingMockData = true
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    fetchError = "Failed to load news articles. Please try again later."
  }

  const countryName = getCountryName(country)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>

      {usingMockData && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Using demo content because the NEWS_API_KEY is not configured.
            <a
              href="https://newsapi.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Get your API key
            </a>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <NewsFilters activeCategory={category} activeCountry={country} />
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
            <SearchBar initialQuery={query} />
            <CountrySelector activeCountry={country} />
          </div>

          <div className="bg-muted p-4 rounded-md mb-6">
            <p className="text-sm">
              Showing {usingMockData ? "demo" : "trending"} news from <span className="font-medium">{countryName}</span>
              {category !== "all" && category !== "general" && (
                <>
                  {" "}
                  in <span className="font-medium capitalize">{category}</span>
                </>
              )}
              {query && (
                <>
                  {" "}
                  matching <span className="font-medium">"{query}"</span>
                </>
              )}
            </p>
          </div>

          {fetchError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fetchError}</AlertDescription>
            </Alert>
          )}

          <Suspense fallback={<div className="mt-8 text-center">Loading news...</div>}>
            <NewsGrid initialArticles={initialArticles} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
