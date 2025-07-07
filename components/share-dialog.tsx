"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Mail, Twitter, Facebook, Linkedin, Link, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  articleTitle: string
  articleUrl: string
}

export function ShareDialog({ articleTitle, articleUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const encodedTitle = encodeURIComponent(articleTitle)
  const encodedUrl = encodeURIComponent(articleUrl)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  }

  const copyToClipboard = () => {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea")
    textArea.value = articleUrl
    textArea.style.position = "fixed" // Avoid scrolling to bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      // Use the older document.execCommand method for maximum compatibility
      const successful = document.execCommand("copy")
      if (successful) {
        setCopied(true)
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } else {
        throw new Error("Copy command was unsuccessful")
      }
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard. Please try manually copying the URL.",
        variant: "destructive",
      })
    }

    // Clean up
    document.body.removeChild(textArea)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Share article">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share article</DialogTitle>
          <DialogDescription>Share this article with your friends and colleagues</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              value={articleUrl}
              readOnly
              className="w-full"
              onClick={(e) => {
                e.currentTarget.select()
              }}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Link className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="text-sm font-medium">Share via</div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => {
                window.open(shareLinks.twitter, "_blank", "noopener,noreferrer")
                setOpen(false)
              }}
            >
              <Twitter className="h-5 w-5 text-[#1DA1F2]" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => {
                window.open(shareLinks.facebook, "_blank", "noopener,noreferrer")
                setOpen(false)
              }}
            >
              <Facebook className="h-5 w-5 text-[#4267B2]" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => {
                window.open(shareLinks.linkedin, "_blank", "noopener,noreferrer")
                setOpen(false)
              }}
            >
              <Linkedin className="h-5 w-5 text-[#0077B5]" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => {
                window.open(shareLinks.email)
                setOpen(false)
              }}
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
