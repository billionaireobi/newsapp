"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { BarChart, FileText, Loader2, Eye, FileDown } from "lucide-react"
import { availableCountries } from "@/lib/news-service"
import { generateNewsReport, generateUserActivityReport } from "@/actions/reports"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ReportGeneratorProps {
  userId: string
}

export function ReportGenerator({ userId }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<"news" | "activity">("news")
  const [country, setCountry] = useState<string>("us")
  const [category, setCategory] = useState<string>("general")
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  )
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [includeBookmarks, setIncludeBookmarks] = useState(true)
  const [includeFavorites, setIncludeFavorites] = useState(true)
  const [includeComments, setIncludeComments] = useState(true)
  const [format, setFormat] = useState<"pdf" | "csv">("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportPreview, setReportPreview] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      if (reportType === "news") {
        const result = await generateNewsReport({
          country,
          category,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          format,
        })

        setReportPreview(result.reportData)
        setShowPreview(true)
      } else {
        const result = await generateUserActivityReport({
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          includeBookmarks,
          includeFavorites,
          includeComments,
          format,
        })

        setReportPreview(result.reportData)
        setShowPreview(true)
      }

      toast({
        title: "Report generated",
        description: "Your report has been generated and is ready to preview",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = () => {
    if (!reportPreview) return

    // Create the content based on format
    let content = ""
    let fileName = ""

    if (format === "csv") {
      // Create CSV content
      if (reportType === "news") {
        const headers = Object.keys(reportPreview[0] || {}).join(",")
        const rows = reportPreview.map((item: any) => Object.values(item).join(","))
        content = [headers, ...rows].join("\n")
        fileName = `news_report_${new Date().toISOString().slice(0, 10)}.csv`
      } else {
        const headers = Object.keys(reportPreview[0] || {}).join(",")
        const rows = reportPreview.map((item: any) => Object.values(item).join(","))
        content = [headers, ...rows].join("\n")
        fileName = `activity_report_${new Date().toISOString().slice(0, 10)}.csv`
      }

      // Create and download the file
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
      downloadFile(blob, fileName)
    } else {
      // For PDF, we'll use a simple approach since we can't generate PDFs in the browser easily
      // In a real app, you'd use a library like jsPDF or generate the PDF on the server
      const htmlContent = `
        <html>
          <head>
            <title>${reportType === "news" ? "News Report" : "Activity Report"}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${reportType === "news" ? "News Report" : "Activity Report"}</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  ${Object.keys(reportPreview[0] || {})
                    .map((key) => `<th>${key}</th>`)
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${reportPreview
                  .map(
                    (item: any) => `
                  <tr>
                    ${Object.values(item)
                      .map((value) => `<td>${value}</td>`)
                      .join("")}
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: "text/html" })
      fileName = `${reportType}_report_${new Date().toISOString().slice(0, 10)}.html`
      downloadFile(blob, fileName)
    }

    toast({
      title: "Report downloaded",
      description: `Your ${reportType} report has been downloaded as ${fileName}`,
    })
  }

  const downloadFile = (blob: Blob, fileName: string) => {
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Create custom reports based on news data or your activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="news" onValueChange={(value) => setReportType(value as "news" | "activity")}>
            <TabsList className="mb-6">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                News Trends
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Include Data</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bookmarks"
                        checked={includeBookmarks}
                        onCheckedChange={(checked) => setIncludeBookmarks(!!checked)}
                      />
                      <Label htmlFor="bookmarks" className="font-normal">
                        Bookmarks
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="favorites"
                        checked={includeFavorites}
                        onCheckedChange={(checked) => setIncludeFavorites(!!checked)}
                      />
                      <Label htmlFor="favorites" className="font-normal">
                        Favorites
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="comments"
                        checked={includeComments}
                        onCheckedChange={(checked) => setIncludeComments(!!checked)}
                      />
                      <Label htmlFor="comments" className="font-normal">
                        Comments
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-2">
            <Label>Report Format</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="pdf"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={() => setFormat("pdf")}
                  className="h-4 w-4"
                />
                <Label htmlFor="pdf" className="font-normal">
                  HTML (Printable)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="csv"
                  value="csv"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  className="h-4 w-4"
                />
                <Label htmlFor="csv" className="font-normal">
                  CSV
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} disabled={isGenerating || !startDate || !endDate} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Generate & Preview Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>Review your report before downloading</DialogDescription>
          </DialogHeader>

          {reportPreview && reportPreview.length > 0 ? (
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      {Object.keys(reportPreview[0]).map((header) => (
                        <th key={header} className="border p-2 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportPreview.map((row: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        {Object.values(row).map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} className="border p-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleDownloadReport} className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Download {format.toUpperCase()}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No data available for the selected criteria.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
