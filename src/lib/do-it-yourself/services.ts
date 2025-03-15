import { 
  Departamento,
  Servicio,
  Producto,
  Paquete,
  ElementoPresupuesto,
  TipoElemento,
  ConfiguracionPaginacion
} from '@/types/do-it-yourself';

import {
  getDepartamentoRepository,
  getServicioRepository,
  getProductoRepository,
  getPaqueteRepository,
  getElementoPresupuestoRepository,
  getBudgetRepository
} from './repositories';

/**
 * Servicio para interactuar con los datos de Do It Yourself
 * 
 * Este módulo implementa el patrón servicio que utiliza repositorios
 * para abstraer la fuente de datos (Supabase, memoria, etc.)
 */

// ---- Departamentos ----

/**
 * Obtiene todos los departamentos
 */
export async function getDepartamentos(): Promise<{
  departamentos: Departamento[];
  error: string | null;
}> {
  const repository = getDepartamentoRepository();
  const result = await repository.getAll();
  
  return {
    departamentos: result.data,
    error: result.error
  };
}

/**
 * Obtiene un departamento por su ID
 */
export async function getDepartamentoById(departamentoId: number): Promise<{
  departamento: Departamento | null;
  error: string | null;
}> {
  const repository = getDepartamentoRepository();
  const result = await repository.getById(departamentoId);
  
  return {
    departamento: result.data,
    error: result.error
  };
}

// ---- Servicios ----

/**
 * Obtiene todos los servicios
 */
export async function getServicios(): Promise<{
  servicios: Servicio[];
  error: string | null;
}> {
  const repository = getServicioRepository();
  const result = await repository.getAll();
  
  return {
    servicios: result.data,
    error: result.error
  };
}

/**
 * Obtiene servicios filtrados por departamento
 */
export async function getServiciosByDepartamento(departamentoId: number): Promise<{
  servicios: Servicio[];
  error: string | null;
}> {
  const repository = getServicioRepository();
  const result = await repository.getByDepartamento(departamentoId);
  
  return {
    servicios: result.data,
    error: result.error
  };
}

/**
 * Obtiene un servicio por su ID
 */
export async function getServicioById(servicioId: number): Promise<{
  servicio: Servicio | null;
  error: string | null;
}> {
  const repository = getServicioRepository();
  const result = await repository.getById(servicioId);
  
  return {
    servicio: result.data,
    error: result.error
  };
}

// ---- Productos ----

/**
 * Obtiene todos los productos
 */
export async function getProductos(): Promise<{
  productos: Producto[];
  error: string | null;
}> {
  const repository = getProductoRepository();
  const result = await repository.getAll();
  
  return {
    productos: result.data,
    error: result.error
  };
}

/**
 * Obtiene productos filtrados por departamento
 */
export async function getProductosByDepartamento(departamentoId: number): Promise<{
  productos: Producto[];
  error: string | null;
}> {
  const repository = getProductoRepository();
  const result = await repository.getByDepartamento(departamentoId);
  
  return {
    productos: result.data,
    error: result.error
  };
}

/**
 * Obtiene productos relacionados con un servicio específico
 */
export async function getProductosByServicio(servicioId: number): Promise<{
  productos: Producto[];
  error: string | null;
}> {
  const repository = getProductoRepository();
  const result = await repository.getByServicio(servicioId);
  
  return {
    productos: result.data,
    error: result.error
  };
}

/**
 * Obtiene un producto por su ID
 */
export async function getProductoById(productoId: number): Promise<{
  producto: Producto | null;
  error: string | null;
}> {
  const repository = getProductoRepository();
  const result = await repository.getById(productoId);
  
  return {
    producto: result.data,
    error: result.error
  };
}

// ---- Paquetes ----

/**
 * Obtiene todos los paquetes
 */
export async function getPaquetes(): Promise<{
  paquetes: Paquete[];
  error: string | null;
}> {
  const repository = getPaqueteRepository();
  const result = await repository.getAll();
  
  return {
    paquetes: result.data,
    error: result.error
  };
}

/**
 * Obtiene paquetes filtrados por departamento
 */
export async function getPaquetesByDepartamento(departamentoId: number): Promise<{
  paquetes: Paquete[];
  error: string | null;
}> {
  const repository = getPaqueteRepository();
  const result = await repository.getByDepartamento(departamentoId);
  
  return {
    paquetes: result.data,
    error: result.error
  };
}

/**
 * Obtiene paquetes relacionados con un producto específico
 */
export async function getPaquetesByProducto(productoId: number): Promise<{
  paquetes: Paquete[];
  error: string | null;
}> {
  const repository = getPaqueteRepository();
  const result = await repository.getByProducto(productoId);
  
  return {
    paquetes: result.data,
    error: result.error
  };
}

/**
 * Obtiene un paquete por su ID
 */
export async function getPaqueteById(paqueteId: number): Promise<{
  paquete: Paquete | null;
  error: string | null;
}> {
  const repository = getPaqueteRepository();
  const result = await repository.getById(paqueteId);
  
  return {
    paquete: result.data,
    error: result.error
  };
}

// ---- Elementos (Genérico) ----

/**
 * Obtiene elementos para presupuesto con paginación
 */
export async function getElementosPaginados(
  tipo: string = TipoElemento.SERVICIO,
  departamentoId: number | null = null,
  paginacion: ConfiguracionPaginacion = { pagina: 1, elementosPorPagina: 10 }
): Promise<{
  resultado: {
    elementos: ElementoPresupuesto[];
    total: number;
    totalPaginas: number;
  };
  error: string | null;
}> {
  const repository = getElementoPresupuestoRepository();
  const result = await repository.getElementosPaginados(
    departamentoId,
    tipo,
    paginacion.pagina,
    paginacion.elementosPorPagina
  );
  
  return {
    resultado: result.data,
    error: result.error
  };
}

/**
 * Obtiene un elemento por su ID y tipo
 */
export async function getElementoById(
  id: number,
  tipo: string
): Promise<{
  elemento: ElementoPresupuesto | null;
  error: string | null;
}> {
  const repository = getElementoPresupuestoRepository();
  const result = await repository.getById(id, tipo);
  
  return {
    elemento: result.data,
    error: result.error
  };
}

/**
 * Actualiza el estado de un presupuesto
 */
export async function updateBudgetStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<{
  success: boolean;
  error: string | null;
}> {
  const repository = getBudgetRepository();
  const result = await repository.updateStatus(code, status);
  
  return {
    success: result.data,
    error: result.error
  };
}

/**
 * Estas funciones de fallback ya no son necesarias, ya que el
 * repositorio en memoria incluye estos datos por defecto
 */
