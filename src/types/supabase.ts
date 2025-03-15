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
      // Tablas existentes
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
      sync_log: {
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
      
      // Tablas para Do It Yourself
      departamentos: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
        }
        Insert: {
          id?: never // GENERATED ALWAYS AS IDENTITY
          nombre: string
          descripcion?: string | null
        }
        Update: {
          id?: never
          nombre?: string
          descripcion?: string | null
        }
        Relationships: []
      }
      servicios: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          precio: number
          tiempo_estimado: string | null
          es_independiente: boolean
        }
        Insert: {
          id?: never // GENERATED ALWAYS AS IDENTITY
          nombre: string
          descripcion?: string | null
          precio: number
          tiempo_estimado?: string | null
          es_independiente?: boolean
        }
        Update: {
          id?: never
          nombre?: string
          descripcion?: string | null
          precio?: number
          tiempo_estimado?: string | null
          es_independiente?: boolean
        }
        Relationships: []
      }
      productos: {
        Row: {
          id: number
          nombre: string
          precio: number
          descripcion: string | null
          tiempo_estimado: string | null
        }
        Insert: {
          id?: never // GENERATED ALWAYS AS IDENTITY
          nombre: string
          precio: number
          descripcion?: string | null
          tiempo_estimado?: string | null
        }
        Update: {
          id?: never
          nombre?: string
          precio?: number
          descripcion?: string | null
          tiempo_estimado?: string | null
        }
        Relationships: []
      }
      paquetes: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          precio: number
          tiempo_estimado: string | null
        }
        Insert: {
          id?: never // GENERATED ALWAYS AS IDENTITY
          nombre: string
          precio: number
          descripcion?: string | null
          tiempo_estimado?: string | null
        }
        Update: {
          id?: never
          nombre?: string
          precio?: number
          descripcion?: string | null
          tiempo_estimado?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          id: number
          nombre_empresa: string
          persona_contacto: string | null
          email: string | null
          telefono: string | null
          direccion: string | null
          fecha_creacion: string
        }
        Insert: {
          id?: never // GENERATED ALWAYS AS IDENTITY
          nombre_empresa: string
          persona_contacto?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          fecha_creacion?: string
        }
        Update: {
          id?: never
          nombre_empresa?: string
          persona_contacto?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
        }
        Relationships: []
      }
      presupuestos: {
        Row: {
          id: number
          cliente_id: number
          nombre: string | null
          fecha_creacion: string
          fecha_modificacion: string
          version: number
          presupuesto_anterior_id: number | null
          descuento_global: number
          es_sprint: boolean
          factor_sprint: number
          notas: string | null
          total: number | null
        }
        Insert: {
          id?: never // GENERATED ALWAYS AS IDENTITY
          cliente_id: number
          nombre?: string | null
          fecha_creacion?: string
          fecha_modificacion?: string
          version?: number
          presupuesto_anterior_id?: number | null
          descuento_global?: number
          es_sprint?: boolean
          factor_sprint?: number
          notas?: string | null
          total?: number | null
        }
        Update: {
          id?: never
          cliente_id?: number
          nombre?: string | null
          client_phone?: string | null
          client_company?: string | null
          project_description?: string | null
          project_timeline?: string
          contact_preference?: string
          total_price?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      // Tablas de relación
      producto_departamento: {
        Row: {
          producto_id: number
          departamento_id: number
        }
        Insert: {
          producto_id: number
          departamento_id: number
        }
        Update: {
          producto_id?: number
          departamento_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "producto_departamento_producto_id_fkey"
            columns: ["producto_id"]
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producto_departamento_departamento_id_fkey"
            columns: ["departamento_id"]
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          }
        ]
      }
      producto_servicio: {
        Row: {
          producto_id: number
          servicio_id: number
        }
        Insert: {
          producto_id: number
          servicio_id: number
        }
        Update: {
          producto_id?: number
          servicio_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "producto_servicio_producto_id_fkey"
            columns: ["producto_id"]
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producto_servicio_servicio_id_fkey"
            columns: ["servicio_id"]
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          }
        ]
      }
      paquete_producto: {
        Row: {
          paquete_id: number
          producto_id: number
        }
        Insert: {
          paquete_id: number
          producto_id: number
        }
        Update: {
          paquete_id?: number
          producto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "paquete_producto_paquete_id_fkey"
            columns: ["paquete_id"]
            referencedRelation: "paquetes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paquete_producto_producto_id_fkey"
            columns: ["producto_id"]
            referencedRelation: "productos"
            referencedColumns: ["id"]
          }
        ]
      }
      presupuesto_producto: {
        Row: {
          presupuesto_id: number
          producto_id: number
          cantidad: number
          precio_unitario: number
          descuento: number
        }
        Insert: {
          presupuesto_id: number
          producto_id: number
          cantidad?: number
          precio_unitario: number
          descuento?: number
        }
        Update: {
          presupuesto_id?: number
          producto_id?: number
          cantidad?: number
          precio_unitario?: number
          descuento?: number
        }
        Relationships: [
          {
            foreignKeyName: "presupuesto_producto_presupuesto_id_fkey"
            columns: ["presupuesto_id"]
            referencedRelation: "presupuestos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_producto_producto_id_fkey"
            columns: ["producto_id"]
            referencedRelation: "productos"
            referencedColumns: ["id"]
          }
        ]
      }
      presupuesto_servicio: {
        Row: {
          presupuesto_id: number
          servicio_id: number
          cantidad: number
          precio_unitario: number
          descuento: number
        }
        Insert: {
          presupuesto_id: number
          servicio_id: number
          cantidad?: number
          precio_unitario: number
          descuento?: number
        }
        Update: {
          presupuesto_id?: number
          servicio_id?: number
          cantidad?: number
          precio_unitario?: number
          descuento?: number
        }
        Relationships: [
          {
            foreignKeyName: "presupuesto_servicio_presupuesto_id_fkey"
            columns: ["presupuesto_id"]
            referencedRelation: "presupuestos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_servicio_servicio_id_fkey"
            columns: ["servicio_id"]
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          }
        ]
      }
      presupuesto_paquete: {
        Row: {
          presupuesto_id: number
          paquete_id: number
          cantidad: number
          precio_unitario: number
          descuento: number
        }
        Insert: {
          presupuesto_id: number
          paquete_id: number
          cantidad?: number
          precio_unitario: number
          descuento?: number
        }
        Update: {
          presupuesto_id?: number
          paquete_id?: number
          cantidad?: number
          precio_unitario?: number
          descuento?: number
        }
        Relationships: [
          {
            foreignKeyName: "presupuesto_paquete_presupuesto_id_fkey"
            columns: ["presupuesto_id"]
            referencedRelation: "presupuestos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_paquete_paquete_id_fkey"
            columns: ["paquete_id"]
            referencedRelation: "paquetes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_tables_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          configured: boolean
          tables_count: number
        }
      }
      sync_data: {
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
