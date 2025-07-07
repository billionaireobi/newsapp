import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ArticlePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const url = typeof searchParams.url === "string" ? searchParams.url : null

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{url ? "Article View" : "No Article Selected"}</CardTitle>
        </CardHeader>
        <CardContent>
          {url ? (
            <div>
              <p className="mb-4">You are viewing the article with URL:</p>
              <p className="bg-muted p-4 rounded-md overflow-auto break-all mb-4">{url}</p>
              <p className="mb-4">
                Note: Full article content would normally be displayed here, but we're showing a simplified view to
                troubleshoot the page.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-6">Please select an article from the homepage to view its details.</p>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
