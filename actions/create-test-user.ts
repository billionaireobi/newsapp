"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { headers } from "next/headers"

export async function createTestUser() {
  const supabase = createServerActionClient({ cookies })

  // Check if we're in a development environment
  if (process.env.NODE_ENV !== "development") {
    return { success: false, error: "This action is only available in development mode" }
  }

  try {
    // Use standard sign-up instead of admin API
    const testEmail = `test${Math.floor(Math.random() * 10000)}@example.com`
    const testPassword = "password123"

    // Get the host from headers
    const headersList = headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Create a test user with standard sign-up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (signUpError) throw signUpError

    if (!signUpData.user) {
      throw new Error("Failed to create user")
    }

    // Since we can't auto-confirm the email without admin access,
    // we'll provide instructions to the user
    return {
      success: true,
      message: `Test user created with email: ${testEmail} and password: ${testPassword}. 
      Check the Supabase dashboard to confirm the user or use the confirmation link sent to the email.`,
    }
  } catch (error: any) {
    console.error("Error creating test user:", error)
    return {
      success: false,
      error: error.message || "Failed to create test user",
    }
  }
}
