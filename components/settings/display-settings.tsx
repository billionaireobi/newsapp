"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function DisplaySettings() {
  const [theme, setTheme] = useState("system")
  const [fontSize, setFontSize] = useState("medium")
  const [articleDensity, setArticleDensity] = useState("comfortable")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Display settings saved",
      description: "Your display preferences have been updated",
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display Settings</h3>
        <p className="text-sm text-muted-foreground">Customize how content appears on the site</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">System</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size</Label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger id="font-size">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-density">Article Density</Label>
          <Select value={articleDensity} onValueChange={setArticleDensity}>
            <SelectTrigger id="article-density">
              <SelectValue placeholder="Select article density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSaveSettings} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  )
}
