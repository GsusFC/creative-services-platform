import { 
  IServiceCategoryRepository,
  IServiceRepository,
  IBudgetRepository
} from './types';

import {
  getInMemoryServiceCategoryRepository,
  getInMemoryServiceRepository,
  getInMemoryBudgetRepository
} from './in-memory';

import {
  getSupabaseServiceCategoryRepository,
  getSupabaseServiceRepository,
  getSupabaseBudgetRepository
} from './supabase';

/**
 * Obtiene la implementación del repositorio de categorías de servicios
 */
export function getServiceCategoryRepository(): IServiceCategoryRepository {
  // Determinar qué implementación usar basado en configuración o entorno
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
  
  if (useSupabase) {
    return getSupabaseServiceCategoryRepository();
  }
  
  return getInMemoryServiceCategoryRepository();
}

/**
 * Obtiene la implementación del repositorio de servicios
 */
export function getServiceRepository(): IServiceRepository {
  // Determinar qué implementación usar basado en configuración o entorno
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
  
  if (useSupabase) {
    return getSupabaseServiceRepository();
  }
  
  return getInMemoryServiceRepository();
}

/**
 * Obtiene la implementación del repositorio de presupuestos
 */
export function getBudgetRepository(): IBudgetRepository {
  // Determinar qué implementación usar basado en configuración o entorno
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
  
  if (useSupabase) {
    return getSupabaseBudgetRepository();
  }
  
  return getInMemoryBudgetRepository();
}

// Exportar tipos
export * from './types';
