"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, ChevronDown, Globe } from "lucide-react"
import { availableCountries } from "@/lib/news-service"
import { Input } from "@/components/ui/input"

interface CountrySelectorProps {
  activeCountry: string
}

export function CountrySelector({ activeCountry }: CountrySelectorProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const activeCountryName = availableCountries.find((c) => c.code === activeCountry)?.name || "United States"

  const handleCountryChange = (countryCode: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set("country", countryCode)
    router.push(`/?${params.toString()}`)
    setIsOpen(false)
  }

  const filteredCountries = availableCountries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{activeCountryName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <div className="p-2">
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCountries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onSelect={() => handleCountryChange(country.code)}
              className="flex items-center justify-between"
            >
              <span>{country.name}</span>
              {country.code === activeCountry && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
