import { v4 as uuidv4 } from 'uuid';
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
 * Implementación del repositorio de categorías de servicios en memoria
 */
export class InMemoryServiceCategoryRepository implements IServiceCategoryRepository {
  private categories: ServiceCategory[] = [];
  private initialized = false;
  
  private async initialize() {
    if (this.initialized) return;
    
    // Datos iniciales
    this.categories = [
      {
        id: 'strategy',
        name: 'Estrategia',
        description: 'Planificación estratégica y consultoría de marca',
        icon: 'trending-up',
        order_num: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'branding',
        name: 'Branding',
        description: 'Servicios de identidad visual y diseño de marca',
        icon: 'palette',
        order_num: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'digital',
        name: 'Digital Product',
        description: 'Diseño y desarrollo de productos digitales',
        icon: 'code',
        order_num: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'motion',
        name: 'Motion',
        description: 'Animación y efectos visuales para video',
        icon: 'video',
        order_num: 40,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    this.initialized = true;
  }
  
  /**
   * Obtiene todas las categorías de servicios
   */
  async getAll(): Promise<RepositoryResult<ServiceCategory[]>> {
    try {
      await this.initialize();
      return {
        data: [...this.categories],
        error: null
      };
    } catch (error) {
      console.error('Error fetching service categories:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene una categoría de servicio por su ID
   */
  async getById(id: string): Promise<RepositoryResult<ServiceCategory | null>> {
    try {
      await this.initialize();
      const category = this.categories.find(c => c.id === id);
      
      return {
        data: category || null,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching service category ${id}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

/**
 * Implementación del repositorio de servicios en memoria
 */
export class InMemoryServiceRepository implements IServiceRepository {
  private services: Service[] = [];
  private initialized = false;
  
  private async initialize() {
    if (this.initialized) return;
    
    // Datos iniciales
    this.services = [
      // Estrategia
      {
        id: 'strategy-brand',
        name: 'Estrategia de Marca',
        description: 'Definición de posicionamiento, valores y propuesta de valor única para tu marca.',
        price: 2500,
        category_id: 'strategy',
        is_active: true,
        order_num: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'strategy-research',
        name: 'Investigación',
        description: 'Análisis de mercado, competencia y audiencia para fundamentar decisiones estratégicas.',
        price: 1800,
        category_id: 'strategy',
        is_active: true,
        order_num: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'strategy-naming',
        name: 'Naming',
        description: 'Creación de nombre para tu marca, producto o servicio con estudio de disponibilidad.',
        price: 950,
        category_id: 'strategy',
        is_active: true,
        order_num: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      
      // Branding
      {
        id: 'branding-identity',
        name: 'Identidad Visual',
        description: 'Sistema visual completo con logo, colores, tipografía y elementos gráficos.',
        price: 3200,
        category_id: 'branding',
        is_active: true,
        order_num: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'branding-logo',
        name: 'Logo Design',
        description: 'Diseño de símbolo visual que representa la esencia de tu marca.',
        price: 1200,
        category_id: 'branding',
        is_active: true,
        order_num: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      
      // Digital
      {
        id: 'digital-ux',
        name: 'UX Design',
        description: 'Diseño de experiencia de usuario para productos digitales centrados en el usuario.',
        price: 2600,
        category_id: 'digital',
        is_active: true,
        order_num: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'digital-web',
        name: 'Web Development',
        description: 'Desarrollo frontend y backend para sitios web y aplicaciones.',
        price: 4500,
        category_id: 'digital',
        is_active: true,
        order_num: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      
      // Motion
      {
        id: 'motion-animation',
        name: 'Motion Graphics',
        description: 'Animación de gráficos y elementos visuales para dar vida a tu marca.',
        price: 1800,
        category_id: 'motion',
        is_active: true,
        order_num: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    this.initialized = true;
  }
  
  /**
   * Obtiene todos los servicios activos
   */
  async getAll(): Promise<RepositoryResult<Service[]>> {
    try {
      await this.initialize();
      const activeServices = this.services.filter(s => s.is_active);
      
      return {
        data: activeServices,
        error: null
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene un servicio por su ID
   */
  async getById(id: string): Promise<RepositoryResult<Service | null>> {
    try {
      await this.initialize();
      const service = this.services.find(s => s.id === id);
      
      return {
        data: service || null,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene servicios filtrados por categoría
   */
  async getByCategory(categoryId: string): Promise<RepositoryResult<Service[]>> {
    try {
      await this.initialize();
      const filteredServices = this.services.filter(
        s => s.category_id === categoryId && s.is_active
      );
      
      return {
        data: filteredServices,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching services for category ${categoryId}:`, error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

/**
 * Implementación del repositorio de presupuestos en memoria
 */
export class InMemoryBudgetRepository implements IBudgetRepository {
  private budgets: Budget[] = [];
  private budgetServices: BudgetService[] = [];
  
  /**
   * Crea un nuevo presupuesto
   * @returns El código del presupuesto creado
   */
  async create(budgetData: BudgetCreateData): Promise<RepositoryResult<string>> {
    try {
      // Generar ID y código único
      const budgetId = uuidv4();
      const prefix = 'P';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const code = `${prefix}${timestamp}${random}`;
      
      // Crear objeto de presupuesto
      const newBudget: Budget = {
        id: budgetId,
        code,
        client_name: budgetData.client.name,
        client_email: budgetData.client.email,
        client_phone: budgetData.client.phone || null,
        client_company: budgetData.client.company || null,
        project_description: budgetData.project.description || null,
        project_timeline: budgetData.project.timeline,
        contact_preference: budgetData.project.contactPreference,
        total_price: budgetData.totalPrice,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Guardar el presupuesto
      this.budgets.push(newBudget);
      
      // Crear y guardar los servicios del presupuesto
      for (const service of budgetData.services) {
        const budgetService: BudgetService = {
          id: uuidv4(),
          budget_id: budgetId,
          service_id: service.id,
          service_name: service.name,
          service_description: service.description,
          price: service.price,
          notes: service.notes || null,
          created_at: new Date().toISOString()
        };
        
        this.budgetServices.push(budgetService);
      }
      
      return {
        data: code,
        error: null
      };
    } catch (error) {
      console.error('Error creating budget:', error);
      return {
        data: '',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene un presupuesto por su código
   */
  async getByCode(code: string): Promise<RepositoryResult<Budget | null>> {
    try {
      const budget = this.budgets.find(b => b.code === code);
      
      return {
        data: budget || null,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching budget ${code}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene todos los presupuestos
   */
  async getAll(): Promise<RepositoryResult<Budget[]>> {
    try {
      // Ordenar por fecha de creación (más recientes primero)
      const sortedBudgets = [...this.budgets].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      return {
        data: sortedBudgets,
        error: null
      };
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Actualiza el estado de un presupuesto
   */
  async updateStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<RepositoryResult<boolean>> {
    try {
      const budgetIndex = this.budgets.findIndex(b => b.code === code);
      
      if (budgetIndex === -1) {
        return {
          data: false,
          error: `Presupuesto con código ${code} no encontrado`
        };
      }
      
      // Actualizar estado
      this.budgets[budgetIndex] = {
        ...this.budgets[budgetIndex],
        status,
        updated_at: new Date().toISOString()
      };
      
      return {
        data: true,
        error: null
      };
    } catch (error) {
      console.error(`Error updating budget status ${code}:`, error);
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  /**
   * Obtiene los servicios incluidos en un presupuesto
   */
  async getBudgetServices(budgetId: string): Promise<RepositoryResult<BudgetService[]>> {
    try {
      const services = this.budgetServices.filter(bs => bs.budget_id === budgetId);
      
      return {
        data: services,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching budget services for ${budgetId}:`, error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Singletons
let serviceCategoryRepositoryInstance: InMemoryServiceCategoryRepository | null = null;
let serviceRepositoryInstance: InMemoryServiceRepository | null = null;
let budgetRepositoryInstance: InMemoryBudgetRepository | null = null;

export function getInMemoryServiceCategoryRepository(): IServiceCategoryRepository {
  if (!serviceCategoryRepositoryInstance) {
    serviceCategoryRepositoryInstance = new InMemoryServiceCategoryRepository();
  }
  return serviceCategoryRepositoryInstance;
}

export function getInMemoryServiceRepository(): IServiceRepository {
  if (!serviceRepositoryInstance) {
    serviceRepositoryInstance = new InMemoryServiceRepository();
  }
  return serviceRepositoryInstance;
}

export function getInMemoryBudgetRepository(): IBudgetRepository {
  if (!budgetRepositoryInstance) {
    budgetRepositoryInstance = new InMemoryBudgetRepository();
  }
  return budgetRepositoryInstance;
}
