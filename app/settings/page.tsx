import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { DisplaySettings } from "@/components/settings/display-settings"

export default async function SettingsPage() {
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
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Manage your account preferences and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <AccountSettings userId={session.user.id} />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings userId={session.user.id} />
            </TabsContent>
            <TabsContent value="display">
              <DisplaySettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
