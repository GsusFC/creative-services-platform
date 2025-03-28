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

// import {
//   SupabaseDepartamentoRepository,
//   SupabaseServicioRepository,
//   SupabaseProductoRepository,
//   SupabasePaqueteRepository,
//   SupabaseElementoPresupuestoRepository,
//   SupabaseBudgetRepository
// } from './supabase'; // Comentado porque el archivo ./supabase no existe

// Variable para determinar si se debe usar Supabase o la implementación en memoria
// const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'; // Comentado porque la implementación de Supabase no está disponible

/**
 * Obtiene el repositorio de departamentos (siempre en memoria por ahora)
 */
export function getDepartamentoRepository(): DepartamentoRepository {
  // return useSupabase
  //   ? new SupabaseDepartamentoRepository()
  //   : new MemoryDepartamentoRepository();
  return new MemoryDepartamentoRepository(); // Devuelve siempre la implementación en memoria
}

/**
 * Obtiene el repositorio de servicios (siempre en memoria por ahora)
 */
export function getServicioRepository(): ServicioRepository {
  // return useSupabase
  //   ? new SupabaseServicioRepository()
  //   : new MemoryServicioRepository();
  return new MemoryServicioRepository(); // Devuelve siempre la implementación en memoria
}

/**
 * Obtiene el repositorio de productos (siempre en memoria por ahora)
 */
export function getProductoRepository(): ProductoRepository {
  // return useSupabase
  //   ? new SupabaseProductoRepository()
  //   : new MemoryProductoRepository();
  return new MemoryProductoRepository(); // Devuelve siempre la implementación en memoria
}

/**
 * Obtiene el repositorio de paquetes (siempre en memoria por ahora)
 */
export function getPaqueteRepository(): PaqueteRepository {
  // return useSupabase
  //   ? new SupabasePaqueteRepository()
  //   : new MemoryPaqueteRepository();
  return new MemoryPaqueteRepository(); // Devuelve siempre la implementación en memoria
}

/**
 * Obtiene el repositorio de elementos de presupuesto (siempre en memoria por ahora)
 */
export function getElementoPresupuestoRepository(): ElementoPresupuestoRepository {
  // return useSupabase
  //   ? new SupabaseElementoPresupuestoRepository()
  //   : new MemoryElementoPresupuestoRepository();
  return new MemoryElementoPresupuestoRepository(); // Devuelve siempre la implementación en memoria
}

/**
 * Obtiene el repositorio de presupuestos (siempre en memoria por ahora)
 */
export function getBudgetRepository(): BudgetRepository {
  // return useSupabase
  //   ? new SupabaseBudgetRepository()
  //   : new MemoryBudgetRepository();
  return new MemoryBudgetRepository(); // Devuelve siempre la implementación en memoria
}
