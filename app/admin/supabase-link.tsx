"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { getSupabaseDashboardUrl } from "@/lib/config"

export function SupabaseDashboardLink() {
  const [dashboardUrl, setDashboardUrl] = useState("")

  useEffect(() => {
    setDashboardUrl(getSupabaseDashboardUrl())
  }, [])

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Dashboard</CardTitle>
        <CardDescription>Access your Supabase dashboard to manage users</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          You can confirm users and manage authentication settings in your Supabase dashboard.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            Open Supabase Dashboard <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
