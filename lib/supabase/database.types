export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          article_title: string
          article_url: string
          article_image_url: string | null
          article_description: string | null
          article_source: string | null
          article_published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_title: string
          article_url: string
          article_image_url?: string | null
          article_description?: string | null
          article_source?: string | null
          article_published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_title?: string
          article_url?: string
          article_image_url?: string | null
          article_description?: string | null
          article_source?: string | null
          article_published_at?: string | null
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          article_title: string
          article_url: string
          article_image_url: string | null
          article_description: string | null
          article_source: string | null
          article_published_at: string | null
          collection_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_title: string
          article_url: string
          article_image_url?: string | null
          article_description?: string | null
          article_source?: string | null
          article_published_at?: string | null
          collection_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_title?: string
          article_url?: string
          article_image_url?: string | null
          article_description?: string | null
          article_source?: string | null
          article_published_at?: string | null
          collection_name?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          article_url: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_url: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_url?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          categories: string[]
          countries: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categories?: string[]
          countries?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categories?: string[]
          countries?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      reading_history: {
        Row: {
          id: string
          user_id: string
          article_title: string
          article_url: string
          article_image_url: string | null
          article_source: string | null
          article_category: string | null
          read_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_title: string
          article_url: string
          article_image_url?: string | null
          article_source?: string | null
          article_category?: string | null
          read_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_title?: string
          article_url?: string
          article_image_url?: string | null
          article_source?: string | null
          article_category?: string | null
          read_at?: string
        }
      }
    }
  }
}
