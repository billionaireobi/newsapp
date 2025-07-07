"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettingsProps {
  userId: string
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [breakingNews, setBreakingNews] = useState(false)
  const [recommendations, setRecommendations] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated",
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Manage how and when you receive notifications</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-digest">Weekly Digest</Label>
            <p className="text-sm text-muted-foreground">Receive a weekly summary of top news</p>
          </div>
          <Switch
            id="weekly-digest"
            checked={weeklyDigest}
            onCheckedChange={setWeeklyDigest}
            disabled={!emailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="breaking-news">Breaking News</Label>
            <p className="text-sm text-muted-foreground">Get notified about important breaking news</p>
          </div>
          <Switch
            id="breaking-news"
            checked={breakingNews}
            onCheckedChange={setBreakingNews}
            disabled={!emailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="recommendations">Personalized Recommendations</Label>
            <p className="text-sm text-muted-foreground">Receive recommendations based on your reading history</p>
          </div>
          <Switch
            id="recommendations"
            checked={recommendations}
            onCheckedChange={setRecommendations}
            disabled={!emailNotifications}
          />
        </div>
      </div>

      <Button onClick={handleSaveSettings} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  )
}
