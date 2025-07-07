import { DevLogin } from "@/components/auth/dev-login"

export default function DevLoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Development Login</h1>
      <DevLogin />
    </div>
  )
}
