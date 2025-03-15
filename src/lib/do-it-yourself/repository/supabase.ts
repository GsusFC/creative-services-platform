import { supabase } from '@/lib/supabase';
import { 
  ServiceCategory, 
  Service,
  Budget,
  BudgetService 
} from '@/types/services-supabase';
import { 
  IServiceCategoryRepository, 
  IServiceRepository, 
  IBudgetRepository,
  BudgetCreateData,
  RepositoryResult
} from './types';

/**
 * Implementación del repositorio de categorías de servicios con Supabase
 */
export class SupabaseServiceCategoryRepository implements IServiceCategoryRepository {
  /**
   * Obtiene todas las categorías de servicios
   */
  async getAll(): Promise<RepositoryResult<ServiceCategory[]>> {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('order_num', { ascending: true });
      
      if (error) throw error;
      
      return {
        data: data || [],
        error: null
      };
    } catch (err) {
      console.error('Error fetching service categories:', err);
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene una categoría de servicio por su ID
   */
  async getById(id: string): Promise<RepositoryResult<ServiceCategory | null>> {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        data: data || null,
        error: null
      };
    } catch (err) {
      console.error(`Error fetching service category ${id}:`, err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
}

/**
 * Implementación del repositorio de servicios con Supabase
 */
export class SupabaseServiceRepository implements IServiceRepository {
  /**
   * Obtiene todos los servicios activos
   */
  async getAll(): Promise<RepositoryResult<Service[]>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_num', { ascending: true });
      
      if (error) throw error;
      
      return {
        data: data || [],
        error: null
      };
    } catch (err) {
      console.error('Error fetching services:', err);
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene un servicio por su ID
   */
  async getById(id: string): Promise<RepositoryResult<Service | null>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        data: data || null,
        error: null
      };
    } catch (err) {
      console.error(`Error fetching service ${id}:`, err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene servicios filtrados por categoría
   */
  async getByCategory(categoryId: string): Promise<RepositoryResult<Service[]>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('order_num', { ascending: true });
      
      if (error) throw error;
      
      return {
        data: data || [],
        error: null
      };
    } catch (err) {
      console.error(`Error fetching services for category ${categoryId}:`, err);
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
}

/**
 * Implementación del repositorio de presupuestos con Supabase
 */
export class SupabaseBudgetRepository implements IBudgetRepository {
  /**
   * Crea un nuevo presupuesto
   * @returns El código del presupuesto creado
   */
  async create(budgetData: BudgetCreateData): Promise<RepositoryResult<string>> {
    try {
      // Generar código único
      const prefix = 'P';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const code = `${prefix}${timestamp}${random}`;
      
      // Crear objeto de presupuesto para guardar
      const newBudget = {
        code,
        client_name: budgetData.client.name,
        client_email: budgetData.client.email,
        client_phone: budgetData.client.phone || null,
        client_company: budgetData.client.company || null,
        project_description: budgetData.project.description || null,
        project_timeline: budgetData.project.timeline,
        contact_preference: budgetData.project.contactPreference,
        total_price: budgetData.totalPrice,
        status: 'pending'
      };
      
      // Insertar presupuesto en la base de datos
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert(newBudget)
        .select('id')
        .single();
      
      if (budgetError) throw budgetError;
      
      // Insertar servicios del presupuesto
      const budgetServices = budgetData.services.map(service => ({
        budget_id: budget.id,
        service_id: service.id,
        service_name: service.name,
        service_description: service.description,
        price: service.price,
        notes: service.notes || null
      }));
      
      const { error: servicesError } = await supabase
        .from('budget_services')
        .insert(budgetServices);
      
      if (servicesError) throw servicesError;
      
      return {
        data: code,
        error: null
      };
    } catch (err) {
      console.error('Error creating budget:', err);
      return {
        data: '',
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene un presupuesto por su código
   */
  async getByCode(code: string): Promise<RepositoryResult<Budget | null>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      
      return {
        data: data || null,
        error: null
      };
    } catch (err) {
      console.error(`Error fetching budget ${code}:`, err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene todos los presupuestos
   */
  async getAll(): Promise<RepositoryResult<Budget[]>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        data: data || [],
        error: null
      };
    } catch (err) {
      console.error('Error fetching budgets:', err);
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Actualiza el estado de un presupuesto
   */
  async updateStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<RepositoryResult<boolean>> {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({ status })
        .eq('code', code);
      
      if (error) throw error;
      
      return {
        data: true,
        error: null
      };
    } catch (err) {
      console.error(`Error updating budget status ${code}:`, err);
      return {
        data: false,
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene los servicios incluidos en un presupuesto
   */
  async getBudgetServices(budgetId: string): Promise<RepositoryResult<BudgetService[]>> {
    try {
      const { data, error } = await supabase
        .from('budget_services')
        .select('*')
        .eq('budget_id', budgetId);
      
      if (error) throw error;
      
      return {
        data: data || [],
        error: null
      };
    } catch (err) {
      console.error(`Error fetching budget services for ${budgetId}:`, err);
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Error desconocido'
      };
    }
  }
}

// Singletons
let serviceCategoryRepositoryInstance: SupabaseServiceCategoryRepository | null = null;
let serviceRepositoryInstance: SupabaseServiceRepository | null = null;
let budgetRepositoryInstance: SupabaseBudgetRepository | null = null;

export function getSupabaseServiceCategoryRepository(): IServiceCategoryRepository {
  if (!serviceCategoryRepositoryInstance) {
    serviceCategoryRepositoryInstance = new SupabaseServiceCategoryRepository();
  }
  return serviceCategoryRepositoryInstance;
}

export function getSupabaseServiceRepository(): IServiceRepository {
  if (!serviceRepositoryInstance) {
    serviceRepositoryInstance = new SupabaseServiceRepository();
  }
  return serviceRepositoryInstance;
}

export function getSupabaseBudgetRepository(): IBudgetRepository {
  if (!budgetRepositoryInstance) {
    budgetRepositoryInstance = new SupabaseBudgetRepository();
  }
  return budgetRepositoryInstance;
}
