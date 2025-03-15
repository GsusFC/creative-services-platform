/**
 * Implementación en memoria de los repositorios
 * 
 * Esta implementación utiliza datos en memoria para desarrollo y pruebas.
 * No requiere conexión a Supabase u otra fuente de datos externa.
 */

import {
  DepartamentoRepository,
  ServicioRepository,
  ProductoRepository,
  PaqueteRepository,
  ElementoPresupuestoRepository,
  BudgetRepository,
  RepositoryResult
} from './interfaces';

import {
  Departamento,
  Servicio,
  Producto,
  Paquete,
  ElementoPresupuesto,
  TipoElemento
} from '@/types/do-it-yourself';

// Datos de departamentos para pruebas
const departamentosMock: Departamento[] = [
  { id: 1, nombre: 'Diseño Gráfico', descripcion: null },
  { id: 2, nombre: 'Desarrollo Web', descripcion: null },
  { id: 3, nombre: 'Marketing Digital', descripcion: null },
  { id: 4, nombre: 'Producción Audiovisual', descripcion: null }
];

// Datos de servicios para pruebas
const serviciosMock: Servicio[] = [
  { 
    id: 101, 
    nombre: 'Diseño de Logo', 
    descripcion: 'Creación de identidad visual para tu marca', 
    precio: 300, 
    tiempo_estimado: '5 días', 
    es_independiente: true 
  },
  { 
    id: 102, 
    nombre: 'Diseño de Tarjetas', 
    descripcion: 'Tarjetas de presentación para tu negocio', 
    precio: 150, 
    tiempo_estimado: '3 días', 
    es_independiente: true 
  },
  { 
    id: 201, 
    nombre: 'Desarrollo Frontend', 
    descripcion: 'Implementación de interfaces de usuario', 
    precio: 500, 
    tiempo_estimado: '10 días', 
    es_independiente: true 
  },
  { 
    id: 202, 
    nombre: 'Desarrollo Backend', 
    descripcion: 'Implementación de lógica de servidor y base de datos', 
    precio: 600, 
    tiempo_estimado: '12 días', 
    es_independiente: true 
  },
  { 
    id: 301, 
    nombre: 'Gestión de Redes Sociales', 
    descripcion: 'Administración de contenido en plataformas sociales', 
    precio: 250, 
    tiempo_estimado: '8 días', 
    es_independiente: true 
  }
];

// Datos de productos para pruebas
const productosMock: Producto[] = [
  { 
    id: 401, 
    nombre: 'Identidad Corporativa Básica', 
    descripcion: 'Incluye logo, tarjetas y papelería básica', 
    precio: 500, 
    tiempo_estimado: '7 días', 
    servicios: [101, 102]
  },
  { 
    id: 402, 
    nombre: 'Sitio Web Informativo', 
    descripcion: 'Sitio web de 5 páginas con información de la empresa', 
    precio: 1200, 
    tiempo_estimado: '15 días', 
    servicios: [201, 202]
  },
  { 
    id: 403, 
    nombre: 'Plan de Marketing Básico', 
    descripcion: 'Estrategia básica para redes sociales', 
    precio: 800, 
    tiempo_estimado: '10 días', 
    servicios: [301]
  }
];

// Datos de paquetes para pruebas
const paquetesMock: Paquete[] = [
  { 
    id: 501, 
    nombre: 'Paquete Emprendedor', 
    descripcion: 'Todo lo necesario para comenzar tu negocio', 
    precio: 2000, 
    tiempo_estimado: '30 días', 
    productos: [401, 402]
  },
  { 
    id: 502, 
    nombre: 'Paquete Corporativo', 
    descripcion: 'Solución completa para empresas establecidas', 
    precio: 3500, 
    tiempo_estimado: '45 días', 
    productos: [401, 402, 403]
  }
];

/**
 * Implementación en memoria del repositorio de departamentos
 */
export class MemoryDepartamentoRepository implements DepartamentoRepository {
  async getAll(): Promise<RepositoryResult<Departamento[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: [...departamentosMock],
      error: null
    };
  }
  
  async getById(id: number): Promise<RepositoryResult<Departamento | null>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const departamento = departamentosMock.find(d => d.id === id);
    
    return {
      data: departamento || null,
      error: departamento ? null : 'Departamento no encontrado'
    };
  }
}

/**
 * Implementación en memoria del repositorio de servicios
 */
export class MemoryServicioRepository implements ServicioRepository {
  async getAll(): Promise<RepositoryResult<Servicio[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      data: [...serviciosMock],
      error: null
    };
  }
  
  async getById(id: number): Promise<RepositoryResult<Servicio | null>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const servicio = serviciosMock.find(s => s.id === id);
    
    return {
      data: servicio || null,
      error: servicio ? null : 'Servicio no encontrado'
    };
  }
  
  async getByDepartamento(departamentoId: number): Promise<RepositoryResult<Servicio[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En esta implementación de memoria, simulamos filtrar por departamento
    // Devolvemos todos los servicios cuando se solicita un departamento válido
    const servicios = departamentoId > 0 ? [...serviciosMock] : [];
    
    return {
      data: servicios,
      error: null
    };
  }
}

/**
 * Implementación en memoria del repositorio de productos
 */
export class MemoryProductoRepository implements ProductoRepository {
  async getAll(): Promise<RepositoryResult<Producto[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      data: [...productosMock],
      error: null
    };
  }
  
  async getById(id: number): Promise<RepositoryResult<Producto | null>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const producto = productosMock.find(p => p.id === id);
    
    return {
      data: producto || null,
      error: producto ? null : 'Producto no encontrado'
    };
  }
  
  async getByDepartamento(departamentoId: number): Promise<RepositoryResult<Producto[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En esta implementación de memoria, simulamos que todos los productos
    // pertenecen al departamento solicitado
    const productos = departamentoId > 0 ? [...productosMock] : [];
    
    return {
      data: productos,
      error: null
    };
  }
  
  async getByServicio(servicioId: number): Promise<RepositoryResult<Producto[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const productos = productosMock.filter(p => p.servicios?.includes(servicioId) || false);
    
    return {
      data: productos,
      error: null
    };
  }
}

/**
 * Implementación en memoria del repositorio de paquetes
 */
export class MemoryPaqueteRepository implements PaqueteRepository {
  async getAll(): Promise<RepositoryResult<Paquete[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      data: [...paquetesMock],
      error: null
    };
  }
  
  async getById(id: number): Promise<RepositoryResult<Paquete | null>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const paquete = paquetesMock.find(p => p.id === id);
    
    return {
      data: paquete || null,
      error: paquete ? null : 'Paquete no encontrado'
    };
  }
  
  async getByDepartamento(departamentoId: number): Promise<RepositoryResult<Paquete[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En esta implementación de memoria, simplemente devolvemos todos los paquetes
    // cuando se solicita un departamento válido
    const paquetes = departamentoId > 0 ? [...paquetesMock] : [];
    
    return {
      data: paquetes,
      error: null
    };
  }
  
  async getByProducto(productoId: number): Promise<RepositoryResult<Paquete[]>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Manejamos el caso donde productos puede ser undefined
    const paquetes = paquetesMock.filter(p => p.productos?.includes(productoId) || false);
    
    return {
      data: paquetes,
      error: null
    };
  }
}

/**
 * Implementación del repositorio de presupuestos en memoria
 */
export class MemoryBudgetRepository implements BudgetRepository {
  async updateStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<RepositoryResult<boolean>> {
    // Simular retraso para mostrar estados de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En esta implementación de memoria, simulamos una actualización exitosa
    // En un entorno real, aquí se actualizaría el estado en la base de datos
    console.log(`Actualizando presupuesto ${code} a estado ${status}`);
    
    return {
      data: true, // Siempre devolvemos éxito en esta implementación
      error: null
    };
  }
}

/**
 * Implementación en memoria del repositorio de elementos de presupuesto
 */

export class MemoryElementoPresupuestoRepository implements ElementoPresupuestoRepository {
  private servicioRepo: ServicioRepository;
  private productoRepo: ProductoRepository;
  private paqueteRepo: PaqueteRepository;
  
  constructor() {
    this.servicioRepo = new MemoryServicioRepository();
    this.productoRepo = new MemoryProductoRepository();
    this.paqueteRepo = new MemoryPaqueteRepository();
  }
  
  async getAll(): Promise<RepositoryResult<ElementoPresupuesto[]>> {
    try {
      // Simular retraso para mostrar estados de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const [serviciosResult, productosResult, paquetesResult] = await Promise.all([
        this.servicioRepo.getAll(),
        this.productoRepo.getAll(),
        this.paqueteRepo.getAll()
      ]);
      
      // Verificar errores en alguno de los repositorios
      if (serviciosResult.error) return { data: [], error: serviciosResult.error };
      if (productosResult.error) return { data: [], error: productosResult.error };
      if (paquetesResult.error) return { data: [], error: paquetesResult.error };
      
      // Combinar resultados
      const elementos: ElementoPresupuesto[] = [
        ...serviciosResult.data,
        ...productosResult.data,
        ...paquetesResult.data
      ];
      
      return {
        data: elementos,
        error: null
      };
    } catch (error) {
      console.error("Error al obtener elementos:", error);
      return {
        data: [],
        error: `Error al obtener elementos: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  async getById(id: number, tipo: string): Promise<RepositoryResult<ElementoPresupuesto | null>> {
    try {
      // Simular retraso para mostrar estados de carga
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let resultado: RepositoryResult<ElementoPresupuesto | null> = { data: null, error: 'Tipo de elemento no válido' };
      
      // Obtener el elemento según su tipo
      switch (tipo) {
        case TipoElemento.SERVICIO:
          resultado = await this.servicioRepo.getById(id);
          break;
          
        case TipoElemento.PRODUCTO:
          resultado = await this.productoRepo.getById(id);
          break;
          
        case TipoElemento.PAQUETE:
          resultado = await this.paqueteRepo.getById(id);
          break;
      }
      
      return resultado;
    } catch (error) {
      console.error(`Error al obtener elemento de tipo ${tipo} con id ${id}:`, error);
      return {
        data: null,
        error: `Error al obtener elemento: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  async getByDepartamento(departamentoId: number, tipo: string): Promise<RepositoryResult<ElementoPresupuesto[]>> {
    try {
      // Simular retraso para mostrar estados de carga
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let resultado: RepositoryResult<ElementoPresupuesto[]> = { data: [], error: 'Tipo de elemento no válido' };
      
      // Obtener elementos según su tipo
      switch (tipo) {
        case TipoElemento.SERVICIO:
          resultado = await this.servicioRepo.getByDepartamento(departamentoId);
          break;
          
        case TipoElemento.PRODUCTO:
          resultado = await this.productoRepo.getByDepartamento(departamentoId);
          break;
          
        case TipoElemento.PAQUETE:
          resultado = await this.paqueteRepo.getByDepartamento(departamentoId);
          break;
          
        case 'todos':
          // Obtener todos los tipos para este departamento
          const [serviciosResult, productosResult, paquetesResult] = await Promise.all([
            this.servicioRepo.getByDepartamento(departamentoId),
            this.productoRepo.getByDepartamento(departamentoId),
            this.paqueteRepo.getByDepartamento(departamentoId)
          ]);
          
          // Verificar errores en alguno de los repositorios
          if (serviciosResult.error) return { data: [], error: serviciosResult.error };
          if (productosResult.error) return { data: [], error: productosResult.error };
          if (paquetesResult.error) return { data: [], error: paquetesResult.error };
          
          // Combinar resultados
          resultado = {
            data: [
              ...serviciosResult.data,
              ...productosResult.data,
              ...paquetesResult.data
            ],
            error: null
          };
          break;
      }
      
      return resultado;
    } catch (error) {
      console.error(`Error al obtener elementos de tipo ${tipo} para departamento ${departamentoId}:`, error);
      return {
        data: [],
        error: `Error al obtener elementos: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  async getElementosPaginados(
    departamentoId: number | null,
    tipo: string,
    pagina: number,
    elementosPorPagina: number
  ): Promise<RepositoryResult<{ elementos: ElementoPresupuesto[]; total: number; totalPaginas: number }>> {
    try {
      // Simular retraso para mostrar estados de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Obtener todos los elementos del tipo especificado
      let elementos: ElementoPresupuesto[] = [];
      let error: string | null = null;
      
      if (departamentoId !== null) {
        // Filtrar por departamento y tipo
        const resultado = await this.getByDepartamento(departamentoId, tipo);
        elementos = resultado.data;
        error = resultado.error;
      } else {
        // Solo filtrar por tipo
        switch (tipo) {
          case TipoElemento.SERVICIO:
            const serviciosResult = await this.servicioRepo.getAll();
            elementos = serviciosResult.data;
            error = serviciosResult.error;
            break;
            
          case TipoElemento.PRODUCTO:
            const productosResult = await this.productoRepo.getAll();
            elementos = productosResult.data;
            error = productosResult.error;
            break;
            
          case TipoElemento.PAQUETE:
            const paquetesResult = await this.paqueteRepo.getAll();
            elementos = paquetesResult.data;
            error = paquetesResult.error;
            break;
            
          case 'todos':
            const todosResult = await this.getAll();
            elementos = todosResult.data;
            error = todosResult.error;
            break;
            
          default:
            error = 'Tipo de elemento no válido';
        }
      }
      
      if (error) {
        return {
          data: { elementos: [], total: 0, totalPaginas: 0 },
          error
        };
      }
      
      // Calcular paginación
      const total = elementos.length;
      const totalPaginas = Math.ceil(total / elementosPorPagina);
      
      // Obtener elementos de la página actual
      const inicio = (pagina - 1) * elementosPorPagina;
      const elementosPaginados = elementos.slice(inicio, inicio + elementosPorPagina);
      
      return {
        data: {
          elementos: elementosPaginados,
          total,
          totalPaginas
        },
        error: null
      };
    } catch (error) {
      console.error("Error al obtener elementos paginados:", error);
      return {
        data: { elementos: [], total: 0, totalPaginas: 0 },
        error: `Error al obtener elementos paginados: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}
