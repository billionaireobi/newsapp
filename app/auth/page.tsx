import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AuthForm } from "@/components/auth/auth-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Get session without try/catch since redirect needs to be handled by Next.js
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is already logged in, redirect them to the homepage
  if (session) {
    redirect("/")
  }

  // Get error from URL if present
  const error = typeof searchParams.error === "string" ? searchParams.error : null
  const errorDescription = typeof searchParams.error_description === "string" ? searchParams.error_description : null

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Account Access</h1>

      {error && (
        <Alert variant="destructive" className="max-w-md mx-auto mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorDescription || "An error occurred during authentication"}</AlertDescription>
        </Alert>
      )}

      {!error && (
        <Alert variant="default" className="max-w-md mx-auto mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <p>After signing up, you'll need to verify your email address.</p>
            <p className="mt-1">If you don't receive the verification email:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Check your spam/junk folder</li>
              <li>Try a different email provider</li>
              <li>Contact support if issues persist</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <AuthForm />
    </div>
  )
}
