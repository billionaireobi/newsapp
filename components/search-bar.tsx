"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(window.location.search)

    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }

    router.push(`/?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery("")

    const params = new URLSearchParams(window.location.search)
    params.delete("q")

    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative mb-6">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-16"
        />
        {query && (
          <Button type="button" variant="ghost" size="icon" className="absolute right-12 h-8 w-8" onClick={clearSearch}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <Button type="submit" className="absolute right-0 rounded-l-none">
          Search
        </Button>
      </div>
    </form>
  )
}
