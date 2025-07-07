"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single instance of the Supabase client to be reused
export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (...args) => {
        // Add a timeout to fetch requests
        const [url, options] = args
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(30000), // 30 second timeout
        })
      },
    },
  },
})
