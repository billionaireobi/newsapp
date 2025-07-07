import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export function createServerClient() {
  try {
    return createServerComponentClient<Database>({
      cookies,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    // Return a minimal client that won't throw errors when methods are called
    // This allows the app to continue functioning even if Supabase is unavailable
    return createServerComponentClient<Database>({ cookies })
  }
}
