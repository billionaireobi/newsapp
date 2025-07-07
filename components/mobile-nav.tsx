"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Home, BookmarkCheck, Bookmark, User, LogIn, BarChart, History } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setOpen(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 h-full">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold" onClick={() => setOpen(false)}>
              News Aggregator
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                pathname === "/" ? "bg-accent" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/favorites"
                  className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                    pathname === "/favorites" ? "bg-accent" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <BookmarkCheck className="h-5 w-5" />
                  Favorites
                </Link>

                <Link
                  href="/bookmarks"
                  className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                    pathname === "/bookmarks" ? "bg-accent" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Bookmark className="h-5 w-5" />
                  Bookmarks
                </Link>

                <Link
                  href="/history"
                  className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                    pathname === "/history" ? "bg-accent" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <History className="h-5 w-5" />
                  Reading History
                </Link>

                <Link
                  href="/reports"
                  className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                    pathname === "/reports" ? "bg-accent" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <BarChart className="h-5 w-5" />
                  Reports
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                    pathname === "/profile" ? "bg-accent" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link
                href="/auth"
                className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                  pathname === "/auth" ? "bg-accent" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            )}
          </nav>

          <div className="mt-auto">
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Terms
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">&copy; {new Date().getFullYear()} News Aggregator</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
