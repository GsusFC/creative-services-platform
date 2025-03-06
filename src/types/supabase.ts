export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      case_studies: {
        Row: {
          id: string
          title: string
          slug: string
          client: string
          description: string
          description2: string
          tags: string
          order: number
          status: string
          featured: boolean
          featured_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          client: string
          description: string
          description2?: string
          tags?: string
          order?: number
          status?: string
          featured?: boolean
          featured_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          client?: string
          description?: string
          description2?: string
          tags?: string
          order?: number
          status?: string
          featured?: boolean
          featured_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      media_items: {
        Row: {
          id: string
          type: string
          url: string
          video_type: string | null
          thumbnail_url: string | null
          alt: string
          width: number
          height: number
          order: number
          display_mode: string | null
          case_study_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          url: string
          video_type?: string | null
          thumbnail_url?: string | null
          alt?: string
          width: number
          height: number
          order?: number
          display_mode?: string | null
          case_study_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          url?: string
          video_type?: string | null
          thumbnail_url?: string | null
          alt?: string
          width?: number
          height?: number
          order?: number
          display_mode?: string | null
          case_study_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_case_study_id_fkey"
            columns: ["case_study_id"]
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          }
        ]
      }
      notion_sync_log: {
        Row: {
          id: string
          operation: string
          entity_type: string
          entity_id: string
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          operation: string
          entity_type: string
          entity_id: string
          status: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          operation?: string
          entity_type?: string
          entity_id?: string
          status?: string
          error_message?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_notion_fdw_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          configured: boolean
          database_count: number
        }
      }
      sync_notion_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          added: number
          updated: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
