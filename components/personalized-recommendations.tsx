"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { getTopHeadlines } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"
import { Loader2, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Article } from "@/types/news"

export function PersonalizedRecommendations() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const [userPreferences, setUserPreferences] = useState<{
    categories: string[]
    countries: string[]
  } | null>(null)
  const [recommendations, setRecommendations] = useState<{
    [key: string]: Article[]
  }>({})
  const [activeTab, setActiveTab] = useState<string>("")

  // Default preferences to use if none are found
  const defaultPreferences = {
    categories: ["general", "technology", "business"],
    countries: ["us"],
  }

  useEffect(() => {
    const fetchUserPreferences = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // If no session, use default preferences
          setUserPreferences(defaultPreferences)
          setIsLoading(false)
          return
        }

        // Get user preferences - don't use .single() to avoid the error
        const { data, error } = await supabase
          .from("user_preferences")
          .select("categories, countries, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        let preferences = defaultPreferences

        if (error) {
          console.error("Error fetching user preferences:", error)
        } else if (data && data.length > 0) {
          // Use the most recent preferences if multiple rows exist
          preferences = {
            categories: data[0].categories || defaultPreferences.categories,
            countries: data[0].countries || defaultPreferences.countries,
          }

          // Log if multiple preferences were found
          if (data.length > 1) {
            console.warn(`Multiple preference rows found for user ${session.user.id}. Using most recent.`)
          }
        } else {
          // No preferences found, create default preferences for the user
          try {
            await supabase.from("user_preferences").insert({
              user_id: session.user.id,
              categories: defaultPreferences.categories,
              countries: defaultPreferences.countries,
            })
            console.log("Created default preferences for user")
          } catch (insertError) {
            console.error("Error creating default preferences:", insertError)
          }
        }

        setUserPreferences(preferences)

        // Set default active tab
        if (preferences.categories && preferences.categories.length > 0) {
          setActiveTab(preferences.categories[0])
        }

        // Fetch recommendations for each category
        const recommendationsData: { [key: string]: Article[] } = {}

        for (const category of preferences.categories) {
          try {
            // Use the first country in preferences, or default to 'us'
            const country = preferences.countries && preferences.countries.length > 0 ? preferences.countries[0] : "us"

            const articles = await getTopHeadlines({
              category,
              country,
              pageSize: 6,
            })

            // Check if we got mock data (API error)
            if (articles.length > 0 && articles[0].source.id === "mock-source") {
              setUsingMockData(true)
            }

            recommendationsData[category] = articles
          } catch (categoryError) {
            console.error(`Error fetching recommendations for ${category}:`, categoryError)
            recommendationsData[category] = []
          }
        }

        setRecommendations(recommendationsData)
      } catch (error) {
        console.error("Error in personalized recommendations:", error)
        setError("Unable to load personalized recommendations. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPreferences()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!userPreferences || !userPreferences.categories || userPreferences.categories.length === 0) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>
          {usingMockData ? "Demo content (NEWS_API_KEY not configured)" : "Articles based on your interests"}
        </CardDescription>

        {usingMockData && (
          <Alert className="mt-2 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              Using demo content because the NEWS_API_KEY is not configured.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {userPreferences.categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {userPreferences.categories.map((category) => (
            <TabsContent key={category} value={category}>
              {recommendations[category] && recommendations[category].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations[category].map((article, index) => (
                    <NewsCard key={`${article.url}-${index}`} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No recommendations available for this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
