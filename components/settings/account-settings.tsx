"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

interface AccountSettingsProps {
  userId: string
}

export function AccountSettings({ userId }: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match")
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      setError(error.message || "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
      </div>

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

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  )
}
