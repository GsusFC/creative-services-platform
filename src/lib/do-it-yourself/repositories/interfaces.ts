/**
 * Interfaces para repositorios del módulo Do-It-Yourself
 * 
 * Define las interfaces base para los repositorios utilizados en el módulo DIY.
 * Implementa el patrón Repository para abstraer el acceso a datos.
 */

import { 
  ElementoPresupuesto, 
  Producto, 
  Servicio, 
  Paquete,
  Departamento 
} from '@/types/do-it-yourself';

/**
 * Interfaz base para el resultado de operaciones en repositorios
 */
export interface RepositoryResult<T> {
  data: T;
  error: string | null;
  loading?: boolean;
}

/**
 * Interfaz básica para todos los repositorios
 */
export interface BaseRepository<T> {
  getAll(): Promise<RepositoryResult<T[]>>;
  getById(id: number): Promise<RepositoryResult<T | null>>;
}

/**
 * Repositorio para departamentos
 */
export interface DepartamentoRepository extends BaseRepository<Departamento> {
  // Métodos específicos para departamentos si son necesarios
}

/**
 * Repositorio para servicios
 */
export interface ServicioRepository extends BaseRepository<Servicio> {
  getByDepartamento(departamentoId: number): Promise<RepositoryResult<Servicio[]>>;
}

/**
 * Repositorio para productos
 */
export interface ProductoRepository extends BaseRepository<Producto> {
  getByDepartamento(departamentoId: number): Promise<RepositoryResult<Producto[]>>;
  getByServicio(servicioId: number): Promise<RepositoryResult<Producto[]>>;
}

/**
 * Repositorio para paquetes
 */
export interface PaqueteRepository extends BaseRepository<Paquete> {
  getByDepartamento(departamentoId: number): Promise<RepositoryResult<Paquete[]>>;
  getByProducto(productoId: number): Promise<RepositoryResult<Paquete[]>>;
}

/**
 * Repositorio para elementos de presupuesto
 * (combina productos, servicios y paquetes)
 */
export interface ElementoPresupuestoRepository {
  getAll(): Promise<RepositoryResult<ElementoPresupuesto[]>>;
  getById(id: number, tipo: string): Promise<RepositoryResult<ElementoPresupuesto | null>>;
  getByDepartamento(departamentoId: number, tipo: string): Promise<RepositoryResult<ElementoPresupuesto[]>>;
  getElementosPaginados(
    departamentoId: number | null,
    tipo: string,
    pagina: number,
    elementosPorPagina: number
  ): Promise<RepositoryResult<{
    elementos: ElementoPresupuesto[];
    total: number;
    totalPaginas: number;
  }>>;
}

/**
 * Repositorio para gestionar presupuestos
 */
export interface BudgetRepository {
  updateStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<RepositoryResult<boolean>>;
}
