// Get the site URL from environment variable or use a fallback
export const getSiteUrl = () => {
  // For server-side code
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }

  // For client-side code
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
}

// Get the Supabase URL
export const getSupabaseUrl = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ""
}

// Get the Supabase dashboard URL
export const getSupabaseDashboardUrl = () => {
  // Extract project reference from the Supabase URL
  const supabaseUrl = getSupabaseUrl()
  if (!supabaseUrl) return "https://app.supabase.com"

  // Try to extract the project reference from the URL
  // Example: https://abcdefghijklm.supabase.co -> abcdefghijklm
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
  if (match && match[1]) {
    return `https://app.supabase.com/project/${match[1]}/auth/users`
  }

  return "https://app.supabase.com"
}
