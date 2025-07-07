"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Info, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { DevLogin } from "@/components/auth/dev-login"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSiteUrl, getSupabaseDashboardUrl } from "@/lib/config"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [createdUsers, setCreatedUsers] = useState<Array<{ email: string; password: string }>>([])
  const [siteUrl, setSiteUrl] = useState("")
  const [dashboardUrl, setDashboardUrl] = useState("")

  // Generate a unique email with timestamp
  const generateUniqueEmail = () => {
    const timestamp = new Date().getTime()
    return `user${timestamp}@example.com`
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("password123")

  // Set a unique email when the component mounts
  useEffect(() => {
    setEmail(generateUniqueEmail())

    // Get the site URL and dashboard URL
    setSiteUrl(getSiteUrl())
    setDashboardUrl(getSupabaseDashboardUrl())
  }, [])

  const handleCreateTestUser = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Validate email format
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address")
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Use the public URL for the redirect
      const redirectUrl = getSiteUrl()

      // Create user with standard sign-up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        // Add the created user to our list
        setCreatedUsers((prev) => [...prev, { email, password }])

        setResult({
          success: true,
          message: `User created with email: ${email}. Check your email for the confirmation link or confirm this user in the Supabase dashboard.`,
        })

        // Generate a new unique email for the next user
        setEmail(generateUniqueEmail())
      } else {
        setResult({
          success: false,
          error: "Failed to create user",
        })
      }
    } catch (error: any) {
      console.error("Error creating test user:", error)
      setResult({
        success: false,
        error: error.message || "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateNewEmail = () => {
    setEmail(generateUniqueEmail())
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Tools</h1>

      <Alert className="max-w-2xl mx-auto mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Current Site URL:</strong> {siteUrl}
          <br />
          <br />
          If this is not your public URL, set the <code>NEXT_PUBLIC_SITE_URL</code> environment variable to your
          deployed application URL.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="create" className="max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create User</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Test User</CardTitle>
              <CardDescription>Create a test user for testing purposes.</CardDescription>
            </CardHeader>
            <CardContent>
              {result && (
                <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{result.success ? result.message : result.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleGenerateNewEmail}>
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Use a unique email address each time</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTestUser} disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create Test User"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <DevLogin createdUsers={createdUsers} />
        </TabsContent>
      </Tabs>

      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Supabase Dashboard</CardTitle>
          <CardDescription>Access your Supabase dashboard to manage users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            You can confirm users and manage authentication settings in your Supabase dashboard.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Open Supabase Dashboard <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>How to Use Test Users</CardTitle>
          <CardDescription>Follow these steps to create and use test users</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-4 text-sm">
            <li>
              <strong>Create a test user</strong> using the form above
            </li>
            <li>
              <strong>Confirm the user:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Check your email for the confirmation link, OR</li>
                <li>Go to your Supabase dashboard → Authentication → Users</li>
                <li>Find the user you just created</li>
                <li>Click on the three dots menu and select "Confirm user"</li>
              </ul>
            </li>
            <li>
              <strong>Switch to the Login tab</strong> and enter the email and password of the user you created and
              confirmed
            </li>
            <li>
              <strong>Click "Login"</strong> to sign in with the test user
            </li>
          </ol>

          {createdUsers.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">Recently Created Users:</h4>
              <ul className="space-y-2">
                {createdUsers.map((user, index) => (
                  <li key={index} className="text-xs bg-muted p-2 rounded">
                    <div>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                      <strong>Password:</strong> {user.password}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
