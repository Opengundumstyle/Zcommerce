export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          author: string | null
          created_at: string | null
          id: number
          image_path: string | null
          song_path: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
