import { 
  ServiceCategory, 
  Service,
  Budget,
  BudgetService 
} from '@/types/services-supabase';

/**
 * Datos para crear un nuevo presupuesto
 */
export interface BudgetCreateData {
  client: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  project: {
    description?: string;
    timeline: string;
    contactPreference: string;
  };
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    notes?: string;
  }[];
  totalPrice: number;
}

/**
 * Resultado de operaciones
 */
export interface RepositoryResult<T> {
  data: T;
  error: string | null;
}

/**
 * Interfaz para el repositorio de categorías de servicios
 */
export interface IServiceCategoryRepository {
  /**
   * Obtiene todas las categorías de servicios
   */
  getAll(): Promise<RepositoryResult<ServiceCategory[]>>;
  
  /**
   * Obtiene una categoría de servicio por su ID
   */
  getById(id: string): Promise<RepositoryResult<ServiceCategory | null>>;
}

/**
 * Interfaz para el repositorio de servicios
 */
export interface IServiceRepository {
  /**
   * Obtiene todos los servicios activos
   */
  getAll(): Promise<RepositoryResult<Service[]>>;
  
  /**
   * Obtiene un servicio por su ID
   */
  getById(id: string): Promise<RepositoryResult<Service | null>>;
  
  /**
   * Obtiene servicios filtrados por categoría
   */
  getByCategory(categoryId: string): Promise<RepositoryResult<Service[]>>;
}

/**
 * Interfaz para el repositorio de presupuestos
 */
export interface IBudgetRepository {
  /**
   * Crea un nuevo presupuesto
   * @returns El código del presupuesto creado
   */
  create(budgetData: BudgetCreateData): Promise<RepositoryResult<string>>;
  
  /**
   * Obtiene un presupuesto por su código
   */
  getByCode(code: string): Promise<RepositoryResult<Budget | null>>;
  
  /**
   * Obtiene todos los presupuestos
   */
  getAll(): Promise<RepositoryResult<Budget[]>>;
  
  /**
   * Actualiza el estado de un presupuesto
   */
  updateStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<RepositoryResult<boolean>>;
  
  /**
   * Obtiene los servicios incluidos en un presupuesto
   */
  getBudgetServices(budgetId: string): Promise<RepositoryResult<BudgetService[]>>;
}
