import { Json } from './supabase';

// Tipos para las tablas de servicios en Supabase
export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  is_active: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  code: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  project_description: string | null;
  project_timeline: string | null; // 'urgent', 'short', 'medium', 'flexible'
  contact_preference: string | null; // 'email', 'phone', 'videocall', 'meeting'
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetService {
  id: string;
  budget_id: string;
  service_id: string;
  service_name: string;
  service_description: string | null;
  price: number;
  notes: string | null;
  created_at: string;
}

// Extensión de los tipos de Database para incluir las nuevas tablas
export interface ServicesDatabase {
  public: {
    Tables: {
      service_categories: {
        Row: ServiceCategory;
        Insert: Omit<ServiceCategory, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ServiceCategory, 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
      services: {
        Row: Service;
        Insert: Omit<Service, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Service, 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
      budgets: {
        Row: Budget;
        Insert: Omit<Budget, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
      budget_services: {
        Row: BudgetService;
        Insert: Omit<BudgetService, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<BudgetService, 'id' | 'created_at'>>;
      };
    };
  };
}
