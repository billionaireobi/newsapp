import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function NotificationsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not logged in, redirect to auth page
  if (!session) {
    redirect("/auth")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>Stay updated with the latest news and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
            <p className="text-muted-foreground max-w-md">
              When you receive notifications about new articles, comments, or updates, they'll appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
