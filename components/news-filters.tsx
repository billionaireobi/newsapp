"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NewsCategory } from "@/types/news"
import { Globe, Briefcase, Film, Heart, FlaskRound, Trophy, Cpu, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

interface NewsFiltersProps {
  activeCategory: string
  activeCountry: string
}

export function NewsFilters({ activeCategory, activeCountry }: NewsFiltersProps) {
  const router = useRouter()

  const categories: { value: NewsCategory; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All", icon: <Globe className="h-4 w-4 mr-2" /> },
    { value: "general", label: "General", icon: <Globe className="h-4 w-4 mr-2" /> },
    { value: "business", label: "Business", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    { value: "entertainment", label: "Entertainment", icon: <Film className="h-4 w-4 mr-2" /> },
    { value: "health", label: "Health", icon: <Heart className="h-4 w-4 mr-2" /> },
    { value: "science", label: "Science", icon: <FlaskRound className="h-4 w-4 mr-2" /> },
    { value: "sports", label: "Sports", icon: <Trophy className="h-4 w-4 mr-2" /> },
    { value: "technology", label: "Technology", icon: <Cpu className="h-4 w-4 mr-2" /> },
  ]

  // Popular countries for quick access
  const popularCountries = [
    // North America
    { code: "us", name: "United States" },
    { code: "ca", name: "Canada" },
    { code: "mx", name: "Mexico" },

    // Europe
    { code: "gb", name: "United Kingdom" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "it", name: "Italy" },
    { code: "es", name: "Spain" },
    { code: "ru", name: "Russia" },
    { code: "nl", name: "Netherlands" },
    { code: "se", name: "Sweden" },

    // Asia
    { code: "in", name: "India" },
    { code: "cn", name: "China" },
    { code: "jp", name: "Japan" },
    { code: "kr", name: "South Korea" },
    { code: "sg", name: "Singapore" },

    // Middle East
    { code: "ae", name: "United Arab Emirates" },
    { code: "sa", name: "Saudi Arabia" },
    { code: "il", name: "Israel" },

    // South America
    { code: "br", name: "Brazil" },
    { code: "ar", name: "Argentina" },
    { code: "co", name: "Colombia" },

    // Africa
    { code: "za", name: "South Africa" },
    { code: "ng", name: "Nigeria" },
    { code: "eg", name: "Egypt" },
    { code: "ke", name: "Kenya" },

    // Oceania
    { code: "au", name: "Australia" },
    { code: "nz", name: "New Zealand" },
  ]

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(window.location.search)

    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }

    router.push(`/?${params.toString()}`)
  }

  const handleCountryChange = (country: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set("country", country)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={
                  activeCategory === category.value || (category.value === "all" && activeCategory === "general")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
                onClick={() => handleCategoryChange(category.value)}
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Countries</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <Input
              placeholder="Search countries..."
              className="w-full"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase()
                const filteredCountries = popularCountries.filter((country) =>
                  country.name.toLowerCase().includes(searchTerm),
                )
                // You would typically set state here, but for simplicity we're just filtering the display
              }}
            />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {popularCountries.map((country) => (
              <Button
                key={country.code}
                variant={activeCountry === country.code ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleCountryChange(country.code)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {country.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
