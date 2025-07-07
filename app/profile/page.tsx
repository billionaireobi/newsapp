import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { UserActivity } from "@/components/profile/user-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not logged in, redirect to auth page
  if (!session) {
    redirect("/auth")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileForm initialProfile={profile} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Activity</CardTitle>
              <CardDescription>View your bookmarks and reading history</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bookmarks">
                <TabsList className="mb-4">
                  <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                  <TabsTrigger value="history">Reading History</TabsTrigger>
                </TabsList>

                <TabsContent value="bookmarks">
                  <UserActivity userId={session.user.id} />
                </TabsContent>

                <TabsContent value="history">
                  <div className="text-center py-8">
                    <p>Your reading history will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
