"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DevLoginProps {
  createdUsers?: Array<{ email: string; password: string }>
}

export function DevLogin({ createdUsers = [] }: DevLoginProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      setError(
        error.message === "Invalid login credentials"
          ? "Invalid login credentials. Make sure the user exists and is confirmed in Supabase."
          : error.message || "An error occurred during login",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const fillCredentials = (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login with Test User</CardTitle>
        <CardDescription>Log in with a confirmed test user account</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <Alert variant="default" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              You must confirm the user in the Supabase dashboard before you can log in with it.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="dev-email">Email</Label>
            <Input id="dev-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dev-password">Password</Label>
            <Input
              id="dev-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {createdUsers.length > 0 && (
            <div className="mt-4">
              <Label className="mb-2 block">Quick Select:</Label>
              <div className="grid grid-cols-1 gap-2">
                {createdUsers.map((user, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillCredentials(user.email, user.password)}
                  >
                    {user.email}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Click a user to fill in credentials (remember to confirm the user first)
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
