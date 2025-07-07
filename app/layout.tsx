import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { UserDropdown } from "@/components/auth/user-dropdown"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Bookmark, BookmarkCheck, BarChart, History } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI News Aggregator",
  description: "Get the latest news from around the world",
    generator: 'eugine.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-2xl font-bold">
                    AI News Aggregator
                  </Link>
                  <nav className="hidden md:flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                    <Link href="/favorites" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                      <BookmarkCheck className="h-4 w-4" />
                      Favorites
                    </Link>
                    <Link href="/bookmarks" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                      <Bookmark className="h-4 w-4" />
                      Bookmarks
                    </Link>
                    <Link href="/history" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                      <History className="h-4 w-4" />
                      History
                    </Link>
                    <Link href="/reports" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      Reports
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <UserDropdown />
                  <MobileNav />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} News Aggregator. All rights reserved.
                </p>
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()}Developed by Dev
                  <a href="https://billionaireobi.github.io/portofolio/"> Eugine obiero osoro </a>and{" "}
                  <a href="https://techstrips-production.up.railway.app">company</a>
                </p>
                <div className="flex items-center gap-4">
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </div>
              </div>
            </footer>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
