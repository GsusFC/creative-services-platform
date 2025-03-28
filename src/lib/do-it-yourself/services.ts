// Importar tipos de la UI
import { 
  Departamento,
  Servicio,
  Producto,
  Paquete,
  ElementoPresupuesto, // Aunque no se use directamente para obtener, puede usarse en retornos
  TipoElemento,
  ConfiguracionPaginacion
} from '@/types/do-it-yourself'; 
// Importar tipos del repositorio
import { 
  Service as RepoService,
  ServiceCategory as RepoServiceCategory
} from '@/lib/do-it-yourself/repository/types'; 

import {
  // Usar la ruta correcta para los repositorios
  getServiceCategoryRepository,
  getServiceRepository,
  // Repositorios de Producto/Paquete no existen en esta implementación
  getBudgetRepository
} from './repository'; // Corregido a ./repository

/**
 * Servicio para interactuar con los datos de Do It Yourself
 * 
 * Este módulo implementa el patrón servicio que utiliza repositorios
 * para abstraer la fuente de datos (Supabase, memoria, etc.)
 * Mapea los datos del repositorio (Service/Category) a los tipos de la UI (Servicio/Departamento).
 */

// --- Helper de Mapeo ---
// Simple mapeo de ID string a number (usando hash simple o índice)
// Usaremos un mapa para consistencia si se llama varias veces
const categoryIdMap = new Map<string, number>();
const serviceIdMap = new Map<string, number>();
let nextCategoryId = 1;
let nextServiceId = 1;

function getNumericCategoryId(id: string): number {
  if (!categoryIdMap.has(id)) {
    categoryIdMap.set(id, nextCategoryId++);
  }
  return categoryIdMap.get(id)!;
}

function getNumericServiceId(id: string): number {
  if (!serviceIdMap.has(id)) {
    serviceIdMap.set(id, nextServiceId++);
  }
  return serviceIdMap.get(id)!;
}


// ---- Departamentos (Mapeado desde ServiceCategory) ----

/**
 * Obtiene todos los departamentos (mapeado desde ServiceCategory)
 */
export async function getDepartamentos(): Promise<{
  departamentos: Departamento[];
  error: string | null;
}> {
  const repository = getServiceCategoryRepository(); // Usar repo de categorías
  const result = await repository.getAll();
  
  // Mapear ServiceCategory[] a Departamento[]
  const departamentos = result.data.map((category: RepoServiceCategory): Departamento => ({
    id: getNumericCategoryId(category.id), // Mapear ID string a number
    nombre: category.name,
    descripcion: category.description
  }));
  
  return {
    departamentos,
    error: result.error
  };
}

/**
 * Obtiene un departamento por su ID (Requiere mapeo inverso o búsqueda por nombre/propiedad)
 * NOTA: Esta función es difícil de implementar sin un mapeo inverso consistente de number a string ID.
 * Por ahora, devolverá null o buscará por el ID numérico mapeado si es posible.
 */
export async function getDepartamentoById(departamentoId: number): Promise<{
  departamento: Departamento | null;
  error: string | null;
}> {
   // Encontrar la categoría original cuyo ID numérico mapeado coincide
   let foundCategory: RepoServiceCategory | undefined;
   for (const [stringId, numId] of categoryIdMap.entries()) {
     if (numId === departamentoId) {
       const repo = getServiceCategoryRepository();
       const result = await repo.getById(stringId);
       if (!result.error && result.data) {
         foundCategory = result.data;
       }
       break;
     }
   }

   if (foundCategory) {
     return {
       departamento: {
         id: departamentoId,
         nombre: foundCategory.name,
         descripcion: foundCategory.description
       },
       error: null
     };
   } else {
     return { departamento: null, error: 'Departamento no encontrado con ese ID numérico' };
   }
}

// ---- Servicios (Mapeado desde Service) ----

/**
 * Obtiene todos los servicios (mapeado desde Service)
 */
export async function getServicios(): Promise<{
  servicios: Servicio[];
  error: string | null;
}> {
  const repository = getServiceRepository(); // Usar repo de servicios
  const result = await repository.getAll();
  
  // Mapear Service[] a Servicio[]
  const servicios = result.data.map((service: RepoService): Servicio => ({
    id: getNumericServiceId(service.id), // Mapear ID string a number
    nombre: service.name,
    descripcion: service.description,
    precio: service.price,
    tiempo_estimado: service.tiempo_estimado || null, // Asumir que Service puede tener tiempo_estimado opcional
    es_independiente: true, // Default a true ya que no está en el repo
    departamentoId: getNumericCategoryId(service.category_id) // Añadir el ID numérico del departamento
  }));
  
  return {
    servicios,
    error: result.error
  };
}

/**
 * Obtiene servicios filtrados por categoría (mapeado desde getByCategory)
 */
export async function getServiciosByDepartamento(departamentoId: number): Promise<{
  servicios: Servicio[];
  error: string | null;
}> {
  // Encontrar el categoryId string correspondiente al departamentoId numérico
  let categoryId: string | null = null;
  for (const [stringId, numId] of categoryIdMap.entries()) {
    if (numId === departamentoId) {
      categoryId = stringId;
      break;
    }
  }

  if (!categoryId) {
    return { servicios: [], error: 'ID de departamento no válido' };
  }

  const repository = getServiceRepository();
  const result = await repository.getByCategory(categoryId); // Usar getByCategory
  
  // Mapear Service[] a Servicio[]
  const servicios = result.data.map((service: RepoService): Servicio => ({
    id: getNumericServiceId(service.id),
    nombre: service.name,
    descripcion: service.description,
    precio: service.price,
    tiempo_estimado: service.tiempo_estimado || null,
    es_independiente: true, // Default
    departamentoId: getNumericCategoryId(service.category_id) // Añadir el ID numérico del departamento
  }));

  return {
    servicios,
    error: result.error
  };
}

/**
 * Obtiene un servicio por su ID (mapeado desde Service)
 */
export async function getServicioById(servicioId: number): Promise<{
  servicio: Servicio | null;
  error: string | null;
}> {
  // Encontrar el serviceId string correspondiente al servicioId numérico
  let serviceId: string | null = null;
  for (const [stringId, numId] of serviceIdMap.entries()) {
    if (numId === servicioId) {
      serviceId = stringId;
      break;
    }
  }

  if (!serviceId) {
    return { servicio: null, error: 'ID de servicio no válido' };
  }

  const repository = getServiceRepository();
  const result = await repository.getById(serviceId); // Usar getById con string

  if (result.error || !result.data) {
    return { servicio: null, error: result.error || 'Servicio no encontrado' };
  }

  // Mapear Service a Servicio
  const servicio: Servicio = {
    id: servicioId,
    nombre: result.data.name,
    descripcion: result.data.description,
    precio: result.data.price,
    tiempo_estimado: result.data.tiempo_estimado || null,
    es_independiente: true // Default
  };

  return {
    servicio,
    error: null
  };
}

// ---- Productos (Simulado - Devuelve vacío) ----

export async function getProductos(): Promise<{ productos: Producto[]; error: string | null; }> {
  console.warn("getProductos no implementado con la estructura de repositorio actual.");
  return { productos: [], error: null };
}
export async function getProductosByDepartamento(_departamentoId: number): Promise<{ productos: Producto[]; error: string | null; }> {
  console.warn("getProductosByDepartamento no implementado con la estructura de repositorio actual.");
  return { productos: [], error: null };
}
export async function getProductosByServicio(_servicioId: number): Promise<{ productos: Producto[]; error: string | null; }> {
   console.warn("getProductosByServicio no implementado con la estructura de repositorio actual.");
  return { productos: [], error: null };
}
export async function getProductoById(_productoId: number): Promise<{ producto: Producto | null; error: string | null; }> {
   console.warn("getProductoById no implementado con la estructura de repositorio actual.");
  return { producto: null, error: null };
}

// ---- Paquetes (Simulado - Devuelve vacío) ----

export async function getPaquetes(): Promise<{ paquetes: Paquete[]; error: string | null; }> {
  console.warn("getPaquetes no implementado con la estructura de repositorio actual.");
  return { paquetes: [], error: null };
}
export async function getPaquetesByDepartamento(_departamentoId: number): Promise<{ paquetes: Paquete[]; error: string | null; }> {
  console.warn("getPaquetesByDepartamento no implementado con la estructura de repositorio actual.");
  return { paquetes: [], error: null };
}
export async function getPaquetesByProducto(_productoId: number): Promise<{ paquetes: Paquete[]; error: string | null; }> {
  console.warn("getPaquetesByProducto no implementado con la estructura de repositorio actual.");
  return { paquetes: [], error: null };
}
export async function getPaqueteById(_paqueteId: number): Promise<{ paquete: Paquete | null; error: string | null; }> {
  console.warn("getPaqueteById no implementado con la estructura de repositorio actual.");
  return { paquete: null, error: null };
}

// ---- Elementos (Genérico - Comentado/Eliminado) ----
// Estas funciones genéricas son menos útiles ahora que trabajamos principalmente con Servicios
/*
export async function getElementosPaginados(...) { ... }
export async function getElementoById(...) { ... }
*/

// ---- Presupuesto (Sin cambios en la capa de servicio, usa repo directamente) ----

/**
 * Actualiza el estado de un presupuesto
 */
export async function updateBudgetStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<{
  success: boolean;
  error: string | null;
}> {
  const repository = getBudgetRepository(); // Usa el repo correcto
  const result = await repository.updateStatus(code, status);
  
  return {
    success: result.data,
    error: result.error
  };
}

// Eliminar la función duplicada

/**
 * Estas funciones de fallback ya no son necesarias, ya que el
 * repositorio en memoria incluye estos datos por defecto
 */
