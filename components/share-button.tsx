"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Share2, Twitter, Facebook, Linkedin, Mail, Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  articleTitle: string
  articleUrl: string
}

export function ShareButton({ articleTitle, articleUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
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
    navigator.clipboard
      .writeText(articleUrl)
      .then(() => {
        setCopied(true)
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = articleUrl
        document.body.appendChild(textArea)
        textArea.select()

        try {
          document.execCommand("copy")
          setCopied(true)
          toast({
            title: "Link copied",
            description: "Article link copied to clipboard",
          })
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Could not copy the link to clipboard",
            variant: "destructive",
          })
        }

        document.body.removeChild(textArea)
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Share article">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share article</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.open(shareLinks.twitter, "_blank", "noopener,noreferrer")}>
          <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
          <span>Share on Twitter/X</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.facebook, "_blank", "noopener,noreferrer")}>
          <Facebook className="mr-2 h-4 w-4 text-[#4267B2]" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.linkedin, "_blank", "noopener,noreferrer")}>
          <Linkedin className="mr-2 h-4 w-4 text-[#0077B5]" />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.email)}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Share via Email</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyToClipboard}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
