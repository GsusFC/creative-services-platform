/**
 * Tipos relacionados con servicios y categorías
 * 
 * Este archivo centraliza todas las definiciones de tipos relacionadas con
 * servicios y categorías para mantener la consistencia en toda la aplicación.
 */

import { ID, ISODateString } from './common';

/**
 * Estructura de una categoría de servicio
 */
export interface ServiceCategory {
  id: ID;
  name: string;
  description: string | null;
  icon: string | null;
  orderNum: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Estructura de un servicio
 */
export interface Service {
  id: ID;
  name: string;
  description: string | null;
  price: number;
  categoryId: ID;
  isActive: boolean;
  orderNum: number;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Estructura de un presupuesto
 */
export interface Budget {
  id: ID;
  code: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  clientCompany: string | null;
  projectDescription: string | null;
  projectTimeline: string | null; // 'urgent', 'short', 'medium', 'flexible'
  contactPreference: string | null; // 'email', 'phone', 'videocall', 'meeting'
  totalPrice: number;
  status: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Estructura de un servicio incluido en un presupuesto
 */
export interface BudgetService {
  id: ID;
  budgetId: ID;
  serviceId: ID;
  serviceName: string;
  serviceDescription: string | null;
  price: number;
  notes: string | null;
  createdAt: ISODateString;
}

/**
 * Resultado del hook de servicios
 */
export interface ServicesHookResult {
  categories: ServiceCategory[];
  services: Service[];
  loading: boolean;
  error: string | null;
  getServicesByCategory: (categoryId: ID) => Service[];
  getServiceById: (serviceId: ID) => Service | undefined;
}

/**
 * Tipos para datos que vienen de Supabase
 * Estos tipos representan la estructura exacta de los datos en la base de datos
 */

export interface DbServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface DbService {
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

export interface DbBudget {
  id: string;
  code: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  project_description: string | null;
  project_timeline: string | null;
  contact_preference: string | null;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DbBudgetService {
  id: string;
  budget_id: string;
  service_id: string;
  service_name: string;
  service_description: string | null;
  price: number;
  notes: string | null;
  created_at: string;
}

/**
 * Funciones para normalizar datos de Supabase a la estructura interna
 */

export function normalizeServiceCategory(dbCategory: DbServiceCategory): ServiceCategory {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    description: dbCategory.description,
    icon: dbCategory.icon,
    orderNum: dbCategory.order_num,
    createdAt: dbCategory.created_at,
    updatedAt: dbCategory.updated_at
  };
}

export function normalizeService(dbService: DbService): Service {
  return {
    id: dbService.id,
    name: dbService.name,
    description: dbService.description,
    price: dbService.price,
    categoryId: dbService.category_id,
    isActive: dbService.is_active,
    orderNum: dbService.order_num,
    createdAt: dbService.created_at,
    updatedAt: dbService.updated_at
  };
}

export function normalizeBudget(dbBudget: DbBudget): Budget {
  return {
    id: dbBudget.id,
    code: dbBudget.code,
    clientName: dbBudget.client_name,
    clientEmail: dbBudget.client_email,
    clientPhone: dbBudget.client_phone,
    clientCompany: dbBudget.client_company,
    projectDescription: dbBudget.project_description,
    projectTimeline: dbBudget.project_timeline,
    contactPreference: dbBudget.contact_preference,
    totalPrice: dbBudget.total_price,
    status: dbBudget.status,
    createdAt: dbBudget.created_at,
    updatedAt: dbBudget.updated_at
  };
}

export function normalizeBudgetService(dbBudgetService: DbBudgetService): BudgetService {
  return {
    id: dbBudgetService.id,
    budgetId: dbBudgetService.budget_id,
    serviceId: dbBudgetService.service_id,
    serviceName: dbBudgetService.service_name,
    serviceDescription: dbBudgetService.service_description,
    price: dbBudgetService.price,
    notes: dbBudgetService.notes,
    createdAt: dbBudgetService.created_at
  };
}
