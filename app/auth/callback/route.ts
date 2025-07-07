import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // If there's an error in the URL, redirect to auth page with error
  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${error}&error_description=${errorDescription}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=session_error&error_description=Failed to exchange code for session`,
      )
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
