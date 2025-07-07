"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Info, Mail, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSiteUrl } from "@/lib/config"
import { Checkbox } from "@/components/ui/checkbox"

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("signin")
  const tabsRef = useRef<HTMLDivElement>(null)

  // These are now decorative only - not used functionally
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["general", "technology"])
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["us"])

  const categories = [
    { value: "general", label: "General" },
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" },
  ]

  const popularCountries = [
    { code: "us", name: "United States" },
    { code: "gb", name: "United Kingdom" },
    { code: "ca", name: "Canada" },
    { code: "au", name: "Australia" },
    { code: "in", name: "India" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "jp", name: "Japan" },
  ]

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // If successful, refresh the page to update the auth state
      router.refresh()
    } catch (error: any) {
      console.error("Sign in error:", error)

      if (error.message.includes("Email not confirmed")) {
        setError("Your email has not been verified. Please check your inbox or request a new verification email.")
        setShowEmailSent(true)
      } else if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else {
        setError(error.message || "An error occurred during sign in. Please check your credentials.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Use the public URL for the redirect
      const redirectUrl = getSiteUrl() + "/auth/callback"

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          throw new Error("This email is already registered. Please sign in instead.")
        }
        throw error
      }

      // Show success message
      setSuccess("Verification email sent! Please check your inbox and spam folder.")
      setShowEmailSent(true)
    } catch (error: any) {
      console.error("Sign up error:", error)

      // If the user is already registered, suggest signing in
      if (error.message.includes("already registered")) {
        setError("This email is already registered. Please sign in instead.")
        // Switch to sign in tab
        setActiveTab("signin")
      } else {
        setError(error.message || "An error occurred during sign up")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      if (!email) {
        throw new Error("Email is required")
      }

      // Use the public URL for the redirect
      const redirectUrl = getSiteUrl() + "/auth/callback"

      // Try both signup and recovery methods to increase chances of delivery
      const { error: signupError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (signupError) {
        // If signup resend fails, try recovery as fallback
        const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        })

        if (recoveryError) throw recoveryError
      }

      setSuccess(
        "Verification email resent! Please check your inbox and spam folder. It may take a few minutes to arrive.",
      )
    } catch (error: any) {
      console.error("Resend verification error:", error)
      setError(error.message || "Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  const switchToSignIn = () => {
    setActiveTab("signin")
    setError(null)
  }

  const checkVerificationStatus = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Try to sign in - if successful, the email has been verified
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError(
            "Your email is still pending verification. Please check your inbox or request a new verification email.",
          )
          setShowEmailSent(true)
        } else {
          throw error
        }
      } else {
        // If sign-in succeeds, the email is verified
        router.refresh()
      }
    } catch (error: any) {
      console.error("Verification check error:", error)
      setError(error.message || "An error occurred while checking verification status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} ref={tabsRef}>
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <CardDescription className="pt-4">
            Access your account to save and manage your favorite articles
          </CardDescription>
        </CardHeader>

        {showEmailSent ? (
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                {success || "Please check your email to verify your account."}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md space-y-3">
                <h3 className="font-medium">Troubleshooting Email Verification</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    Check your <strong>spam/junk folder</strong> for the verification email
                  </li>
                  <li>
                    Add <code>noreply@supabase.co</code> to your contacts
                  </li>
                  <li>If using Gmail, check the "Promotions" or "Updates" tabs</li>
                  <li>Try using a different email provider if possible</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={handleResendVerificationEmail}
                  disabled={isResending}
                  className="flex items-center gap-2"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  onClick={checkVerificationStatus}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      I've Verified My Email
                    </>
                  )}
                </Button>

                <Button variant="link" onClick={() => setShowEmailSent(false)} className="text-sm">
                  Back to sign in
                </Button>
              </div>
            </div>
          </CardContent>
        ) : (
          <>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error}
                        {error.includes("already registered") && (
                          <Button variant="link" onClick={switchToSignIn} className="p-0 h-auto font-normal">
                            Click here to sign in
                          </Button>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                  </div>

                  {/* Decorative preferences section - not used functionally */}
                  <div className="space-y-3 border p-3 rounded-md bg-gray-50">
                    <h3 className="text-sm font-medium">Personalize your experience (optional)</h3>
                    <div className="space-y-3">
                      <Label className="text-xs text-muted-foreground">News Categories</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.value}`}
                              checked={selectedCategories.includes(category.value)}
                              onCheckedChange={() => toggleCategory(category.value)}
                            />
                            <Label htmlFor={`category-${category.value}`} className="font-normal text-sm">
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Preferred Countries</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {popularCountries.slice(0, 4).map((country) => (
                          <div key={country.code} className="flex items-center space-x-2">
                            <Checkbox
                              id={`country-${country.code}`}
                              checked={selectedCountries.includes(country.code)}
                              onCheckedChange={() => toggleCountry(country.code)}
                            />
                            <Label htmlFor={`country-${country.code}`} className="font-normal text-sm">
                              {country.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  )
}
