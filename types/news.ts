export interface Article {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Article[]
}

export type NewsCategory =
  | "general"
  | "business"
  | "entertainment"
  | "health"
  | "science"
  | "sports"
  | "technology"
  | "all"
