import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper } from "lucide-react"
import Link from "next/link"

interface FallbackNewsContentProps {
  country?: string
  category?: string
}

export function FallbackNewsContent({ country = "us", category = "general" }: FallbackNewsContentProps) {
  // Sample fallback content for different categories
  const fallbackContent = {
    general: {
      title: "Stay Informed with the Latest News",
      description: "Our news aggregator brings you the most important headlines from around the world.",
    },
    business: {
      title: "Business & Finance Updates",
      description: "Track market trends, company news, and economic developments.",
    },
    technology: {
      title: "Technology & Innovation",
      description: "Stay updated with the latest tech news, product launches, and digital trends.",
    },
    entertainment: {
      title: "Entertainment News",
      description: "Get the latest updates on movies, music, celebrities, and pop culture.",
    },
    sports: {
      title: "Sports Coverage",
      description: "Follow your favorite teams, athletes, and sporting events.",
    },
    science: {
      title: "Science & Discovery",
      description: "Explore scientific breakthroughs, research, and discoveries.",
    },
    health: {
      title: "Health & Wellness",
      description: "Stay informed about medical research, health tips, and wellness trends.",
    },
  }

  const content = fallbackContent[category as keyof typeof fallbackContent] || fallbackContent.general

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
          <CardDescription className="text-lg">{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We're currently unable to fetch the latest news. This could be due to API limits, network issues, or service
            unavailability.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Refresh</Link>
          </Button>
          <Button asChild>
            <Link href={`/?category=general&country=${country}`}>Try General News</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
