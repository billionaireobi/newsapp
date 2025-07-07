"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Bookmark, BookmarkCheck, UserCircle, Settings, History, Bell, HelpCircle } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export function UserDropdown() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)

        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle()

        if (profileData) {
          setUsername(profileData.username)
          setAvatarUrl(profileData.avatar_url)
        }
      }

      setLoading(false)

      // Set up auth state listener
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user || null)

        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", session.user.id)
            .maybeSingle()

          if (profileData) {
            setUsername(profileData.username)
            setAvatarUrl(profileData.avatar_url)
          }
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <UserCircle className="h-5 w-5 mr-2" />
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/auth")}>
        <UserCircle className="h-5 w-5 mr-2" />
        Sign In
      </Button>
    )
  }

  const displayName = username || user.email?.split("@")[0] || "User"
  const initials = (displayName[0] || "U").toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <span className="hidden md:inline-block max-w-[100px] truncate">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/favorites")}>
            <BookmarkCheck className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/bookmarks")}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Bookmarks</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/history")}>
            <History className="mr-2 h-4 w-4" />
            <span>Reading History</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/help")}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
