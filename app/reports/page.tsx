import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ReportGenerator } from "@/components/reports/report-generator"

export default async function ReportsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not logged in, redirect to auth page
  if (!session) {
    redirect("/auth")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">News Reports</h1>
      <p className="text-muted-foreground mb-8">
        Generate and download reports based on news trends and your reading habits.
      </p>

      <ReportGenerator userId={session.user.id} />
    </main>
  )
}
