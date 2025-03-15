/**
 * Factory de repositorios para el módulo Do-It-Yourself
 * 
 * Este módulo proporciona funciones factory para obtener la implementación
 * adecuada de cada repositorio según la configuración del entorno.
 */

import {
  DepartamentoRepository,
  ServicioRepository,
  ProductoRepository,
  PaqueteRepository,
  ElementoPresupuestoRepository,
  BudgetRepository
} from './interfaces';

import {
  MemoryDepartamentoRepository,
  MemoryServicioRepository,
  MemoryProductoRepository,
  MemoryPaqueteRepository,
  MemoryElementoPresupuestoRepository,
  MemoryBudgetRepository
} from './memory';

import {
  SupabaseDepartamentoRepository,
  SupabaseServicioRepository,
  SupabaseProductoRepository,
  SupabasePaqueteRepository,
  SupabaseElementoPresupuestoRepository,
  SupabaseBudgetRepository
} from './supabase';

// Variable para determinar si se debe usar Supabase o la implementación en memoria
const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

/**
 * Obtiene el repositorio de departamentos según la configuración
 */
export function getDepartamentoRepository(): DepartamentoRepository {
  return useSupabase
    ? new SupabaseDepartamentoRepository()
    : new MemoryDepartamentoRepository();
}

/**
 * Obtiene el repositorio de servicios según la configuración
 */
export function getServicioRepository(): ServicioRepository {
  return useSupabase
    ? new SupabaseServicioRepository()
    : new MemoryServicioRepository();
}

/**
 * Obtiene el repositorio de productos según la configuración
 */
export function getProductoRepository(): ProductoRepository {
  return useSupabase
    ? new SupabaseProductoRepository()
    : new MemoryProductoRepository();
}

/**
 * Obtiene el repositorio de paquetes según la configuración
 */
export function getPaqueteRepository(): PaqueteRepository {
  return useSupabase
    ? new SupabasePaqueteRepository()
    : new MemoryPaqueteRepository();
}

/**
 * Obtiene el repositorio de elementos de presupuesto según la configuración
 */
export function getElementoPresupuestoRepository(): ElementoPresupuestoRepository {
  return useSupabase
    ? new SupabaseElementoPresupuestoRepository()
    : new MemoryElementoPresupuestoRepository();
}

/**
 * Obtiene el repositorio de presupuestos según la configuración
 */
export function getBudgetRepository(): BudgetRepository {
  return useSupabase
    ? new SupabaseBudgetRepository()
    : new MemoryBudgetRepository();
}
