import { 
  IServiceCategoryRepository,
  IServiceRepository
  // IBudgetRepository // Comentado: La interfaz está comentada en ./types
} from './types';

import {
  getInMemoryServiceCategoryRepository,
  getInMemoryServiceRepository
  // getInMemoryBudgetRepository // Comentado: No se exporta desde in-memory.ts
} from './in-memory';

/**
 * Obtiene la implementación del repositorio de categorías de servicios
 */
export function getServiceCategoryRepository(): IServiceCategoryRepository {
  return getInMemoryServiceCategoryRepository();
}

/**
 * Obtiene la implementación del repositorio de servicios
 */
export function getServiceRepository(): IServiceRepository {
  return getInMemoryServiceRepository();
}

// /**
//  * Obtiene la implementación del repositorio de presupuestos - COMENTADO
//  * Depende de getInMemoryBudgetRepository que fue comentado.
//  */
// export function getBudgetRepository(): IBudgetRepository {
//   // return getInMemoryBudgetRepository();
//   // Debería lanzar un error o devolver una implementación nula/mock si se llama
//   throw new Error("Budget repository functionality is currently disabled."); 
// }

// Exportar tipos
export * from './types';
