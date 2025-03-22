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

/**
 * Obtiene la implementación del repositorio de presupuestos
 */
export function getBudgetRepository(): IBudgetRepository {
  return getInMemoryBudgetRepository();
}

// Exportar tipos
export * from './types';
