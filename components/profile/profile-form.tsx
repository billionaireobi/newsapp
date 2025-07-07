"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface ProfileFormProps {
  initialProfile: Profile | null
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [username, setUsername] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize form with profile data when available
  useEffect(() => {
    if (initialProfile) {
      setUsername(initialProfile.username || "")
      setFullName(initialProfile.full_name || "")
      setAvatarUrl(initialProfile.avatar_url || "")
    }
  }, [initialProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError("You must be logged in to update your profile")
        return
      }

      const { error: updateError } = await supabase.from("profiles").upsert({
        id: session.user.id,
        username: username || null,
        full_name: fullName || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })

      if (updateError) {
        console.error("Error updating profile:", updateError)
        setError(updateError.message || "Failed to update profile")
        return
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      router.refresh()
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={fullName || username || "User"} />
              ) : (
                <AvatarFallback>{(fullName?.[0] || username?.[0] || "U").toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar-url">Avatar URL</Label>
            <Input
              id="avatar-url"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
