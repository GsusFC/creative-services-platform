/**
 * Implementación de repositorios utilizando Supabase
 * 
 * Estas implementaciones utilizan la conexión a Supabase para
 * obtener datos reales de la base de datos.
 */

import { supabase } from '@/lib/supabase';
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

/**
 * Función auxiliar para manejar errores de Supabase
 */
const handleSupabaseError = (error: Error | unknown): string => {
  console.error('Error en operación de Supabase:', error);
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error en la operación con Supabase';
};

/**
 * Implementación de repositorio de departamentos con Supabase
 */
export class SupabaseDepartamentoRepository implements DepartamentoRepository {
  async getAll(): Promise<RepositoryResult<Departamento[]>> {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('nombre');
        
      if (error) throw error;
      
      // Mapear a la estructura interna del módulo DIY
      const departamentos: Departamento[] = data.map(d => ({
        id: d.id,
        nombre: d.nombre,
        descripcion: d.descripcion
      }));
      
      return {
        data: departamentos,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getById(id: number): Promise<RepositoryResult<Departamento | null>> {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Mapear a la estructura interna
      const departamento: Departamento = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion
      };
      
      return {
        data: departamento,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: handleSupabaseError(error)
      };
    }
  }
}

/**
 * Implementación de repositorio de servicios con Supabase
 */
export class SupabaseServicioRepository implements ServicioRepository {
  async getAll(): Promise<RepositoryResult<Servicio[]>> {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .order('nombre');
        
      if (error) throw error;
      
      // Mapear a la estructura interna
      const servicios: Servicio[] = data.map(s => ({
        id: s.id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        precio: s.precio,
        tiempo_estimado: s.tiempo_estimado,
        es_independiente: s.es_independiente
      }));
      
      return {
        data: servicios,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getById(id: number): Promise<RepositoryResult<Servicio | null>> {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Mapear a la estructura interna
      const servicio: Servicio = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        tiempo_estimado: data.tiempo_estimado,
        es_independiente: data.es_independiente
      };
      
      return {
        data: servicio,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getByDepartamento(departamentoId: number): Promise<RepositoryResult<Servicio[]>> {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('departamento_id', departamentoId)
        .order('nombre');
        
      if (error) throw error;
      
      // Mapear a la estructura interna
      const servicios: Servicio[] = data.map(s => ({
        id: s.id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        precio: s.precio,
        tiempo_estimado: s.tiempo_estimado,
        es_independiente: s.es_independiente
      }));
      
      return {
        data: servicios,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
}

/**
 * Implementación de repositorio de productos con Supabase
 */
export class SupabaseProductoRepository implements ProductoRepository {
  async getAll(): Promise<RepositoryResult<Producto[]>> {
    try {
      // Obtener todos los productos
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('*')
        .order('nombre');
        
      if (productosError) throw productosError;
      
      // Para cada producto, obtener sus servicios asociados
      const productos: Producto[] = await Promise.all(
        productosData.map(async (p) => {
          // Obtener servicios asociados
          const { data: serviciosRelaciones, error: serviciosError } = await supabase
            .from('producto_servicio')
            .select('servicio_id')
            .eq('producto_id', p.id);
            
          if (serviciosError) console.error('Error al obtener servicios:', serviciosError);
          
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            tiempo_estimado: p.tiempo_estimado,
            servicios: (serviciosRelaciones || []).map(sr => sr.servicio_id)
          };
        })
      );
      
      return {
        data: productos,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getById(id: number): Promise<RepositoryResult<Producto | null>> {
    try {
      // Obtener el producto
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Obtener departamentos asociados (no usamos deptoRelaciones por ahora)
      const { error: deptoError } = await supabase
        .from('producto_departamento')
        .select('departamento_id')
        .eq('producto_id', id)
        .limit(1); // Un producto puede estar en varios departamentos, tomamos el primero
      
      if (deptoError) console.error('Error al obtener departamento:', deptoError);
      
      // Obtener servicios asociados
      const { data: serviciosRelaciones, error: serviciosError } = await supabase
        .from('producto_servicio')
        .select('servicio_id')
        .eq('producto_id', id);
        
      if (serviciosError) console.error('Error al obtener servicios:', serviciosError);
      
      // Mapear a la estructura interna
      const producto: Producto = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        tiempo_estimado: data.tiempo_estimado,
        servicios: (serviciosRelaciones || []).map(sr => sr.servicio_id)
      };
      
      return {
        data: producto,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getByDepartamento(departamentoId: number): Promise<RepositoryResult<Producto[]>> {
    try {
      // Obtener los IDs de productos relacionados con este departamento
      const { data: relaciones, error: relacionesError } = await supabase
        .from('producto_departamento')
        .select('producto_id')
        .eq('departamento_id', departamentoId);
      
      if (relacionesError) throw relacionesError;
      
      // Si no hay productos para este departamento, retornar array vacío
      if (!relaciones || relaciones.length === 0) {
        return {
          data: [],
          error: null
        };
      }
      
      // Obtener productos por sus IDs
      const productoIds = relaciones.map(r => r.producto_id);
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('*')
        .in('id', productoIds)
        .order('nombre');
      
      if (productosError) throw productosError;
      
      // Para cada producto, obtener sus servicios asociados
      const productos: Producto[] = await Promise.all(
        productosData.map(async (p) => {
          // Obtener servicios asociados
          const { data: serviciosRelaciones, error: serviciosError } = await supabase
            .from('producto_servicio')
            .select('servicio_id')
            .eq('producto_id', p.id);
            
          if (serviciosError) console.error('Error al obtener servicios:', serviciosError);
          
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            tiempo_estimado: p.tiempo_estimado,
            servicios: (serviciosRelaciones || []).map(sr => sr.servicio_id)
          };
        })
      );
      
      return {
        data: productos,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getByServicio(servicioId: number): Promise<RepositoryResult<Producto[]>> {
    try {
      // Obtener IDs de productos relacionados con este servicio
      const { data: relaciones, error: relacionesError } = await supabase
        .from('producto_servicio')
        .select('producto_id')
        .eq('servicio_id', servicioId);
      
      if (relacionesError) throw relacionesError;
      
      // Si no hay productos para este servicio, retornar array vacío
      if (!relaciones || relaciones.length === 0) {
        return {
          data: [],
          error: null
        };
      }
      
      // Obtener productos por sus IDs
      const productoIds = relaciones.map(r => r.producto_id);
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('*')
        .in('id', productoIds)
        .order('nombre');
      
      if (productosError) throw productosError;
      
      // Para cada producto, obtener sus servicios y departamentos
      const productos: Producto[] = await Promise.all(
        productosData.map(async (p) => {
          // Obtener departamentos asociados (no usamos deptoRelaciones por ahora)
          const { error: deptoError } = await supabase
            .from('producto_departamento')
            .select('departamento_id')
            .eq('producto_id', p.id)
            .limit(1);
          
          if (deptoError) console.error('Error al obtener departamento:', deptoError);
          
          // Obtener todos los servicios asociados
          const { data: serviciosRelaciones, error: serviciosError } = await supabase
            .from('producto_servicio')
            .select('servicio_id')
            .eq('producto_id', p.id);
            
          if (serviciosError) console.error('Error al obtener servicios:', serviciosError);
          
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            tiempo_estimado: p.tiempo_estimado,
            servicios: (serviciosRelaciones || []).map(sr => sr.servicio_id)
          };
        })
      );
      
      return {
        data: productos,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
}

/**
 * Implementación de repositorio de paquetes con Supabase
 */
export class SupabasePaqueteRepository implements PaqueteRepository {
  async getAll(): Promise<RepositoryResult<Paquete[]>> {
    try {
      const { data: paquetesData, error: paquetesError } = await supabase
        .from('paquetes')
        .select('*')
        .order('nombre');
        
      if (paquetesError) throw paquetesError;
      
      // Para cada paquete, obtener sus productos asociados
      const paquetes: Paquete[] = await Promise.all(
        paquetesData.map(async (p) => {
          // Obtener productos relacionados
          const { data: productosRelaciones, error: productosError } = await supabase
            .from('paquete_producto')
            .select('producto_id')
            .eq('paquete_id', p.id);
            
          if (productosError) console.error('Error al obtener productos del paquete:', productosError);
          
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            tiempo_estimado: p.tiempo_estimado,
            productos: (productosRelaciones || []).map(pr => pr.producto_id)
          };
        })
      );
      
      return {
        data: paquetes,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getById(id: number): Promise<RepositoryResult<Paquete | null>> {
    try {
      // Obtener el paquete
      const { data, error } = await supabase
        .from('paquetes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Obtener productos relacionados
      const { data: productosRelaciones, error: productosError } = await supabase
        .from('paquete_producto')
        .select('producto_id')
        .eq('paquete_id', id);
        
      if (productosError) console.error('Error al obtener productos del paquete:', productosError);
      
      // Mapear a la estructura interna
      const paquete: Paquete = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        tiempo_estimado: data.tiempo_estimado,
        productos: (productosRelaciones || []).map(pr => pr.producto_id)
      };
      
      return {
        data: paquete,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getByDepartamento(departamentoId: number): Promise<RepositoryResult<Paquete[]>> {
    try {
      // Primero, buscamos los productos asociados al departamento
      const { data: relaciones, error: relacionesError } = await supabase
        .from('producto_departamento')
        .select('producto_id')
        .eq('departamento_id', departamentoId);
        
      if (relacionesError) throw relacionesError;
      
      // Si no hay productos para este departamento, no necesitamos buscar paquetes
      if (!relaciones || relaciones.length === 0) {
        return {
          data: [],
          error: null
        };
      }
      
      // Obtenemos los IDs de productos del departamento
      const productoIds = relaciones.map(r => r.producto_id);
      
      // Buscamos los paquetes que tienen esos productos
      const { data: paqueteRelaciones, error: paqueteError } = await supabase
        .from('paquete_producto')
        .select('paquete_id')
        .in('producto_id', productoIds);
        
      if (paqueteError) throw paqueteError;
      
      // Si no hay paquetes con estos productos, retornar array vacío
      if (!paqueteRelaciones || paqueteRelaciones.length === 0) {
        return {
          data: [],
          error: null
        };
      }
      
      // Obtenemos los IDs de paquetes únicos
      const paqueteIds = [...new Set(paqueteRelaciones.map(r => r.paquete_id))];
      
      // Obtenemos los datos de los paquetes
      const { data, error } = await supabase
        .from('paquetes')
        .select('*')
        .in('id', paqueteIds)
        .order('nombre');
        
      if (error) throw error;
      
      // Para cada paquete, obtener sus productos asociados
      const paquetes: Paquete[] = await Promise.all(
        data.map(async (p) => {
          // Obtener productos relacionados
          const { data: productosRelaciones, error: productosError } = await supabase
            .from('paquete_producto')
            .select('producto_id')
            .eq('paquete_id', p.id);
            
          if (productosError) console.error('Error al obtener productos del paquete:', productosError);
          
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            tiempo_estimado: p.tiempo_estimado,
            productos: (productosRelaciones || []).map(pr => pr.producto_id)
          };
        })
      );
      
      return {
        data: paquetes,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
  
  async getByProducto(productoId: number): Promise<RepositoryResult<Paquete[]>> {
    try {
      // Buscar los paquetes que contienen este producto
      const { data: relaciones, error: relacionesError } = await supabase
        .from('paquete_producto')
        .select('paquete_id')
        .eq('producto_id', productoId);
        
      if (relacionesError) throw relacionesError;
      
      // Si no hay paquetes con este producto, retornar array vacío
      if (!relaciones || relaciones.length === 0) {
        return {
          data: [],
          error: null
        };
      }
      
      // Obtener paquetes por sus IDs
      const paqueteIds = relaciones.map(r => r.paquete_id);
      const { data, error } = await supabase
        .from('paquetes')
        .select('*')
        .in('id', paqueteIds)
        .order('nombre');
        
      if (error) throw error;
      
      // Para cada paquete, obtener sus productos asociados
      const paquetes: Paquete[] = await Promise.all(
        data.map(async (p) => {
          // Obtener productos relacionados
          const { data: productosRelaciones, error: productosError } = await supabase
            .from('paquete_producto')
            .select('producto_id')
            .eq('paquete_id', p.id);
            
          if (productosError) console.error('Error al obtener productos del paquete:', productosError);
          
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            tiempo_estimado: p.tiempo_estimado,
            productos: (productosRelaciones || []).map(pr => pr.producto_id)
          };
        })
      );
      
      return {
        data: paquetes,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: handleSupabaseError(error)
      };
    }
  }
}

/**
 * Implementación de repositorio de presupuestos con Supabase
 */
export class SupabaseBudgetRepository implements BudgetRepository {
  async updateStatus(code: string, status: 'pending' | 'approved' | 'rejected'): Promise<RepositoryResult<boolean>> {
    try {
      const { error } = await supabase
        .from('presupuestos')
        .update({ status })
        .eq('codigo', code);
      
      if (error) throw error;
      
      return {
        data: true,
        error: null
      };
    } catch (error) {
      return {
        data: false,
        error: handleSupabaseError(error)
      };
    }
  }
}

/**
 * Implementación de repositorio de elementos de presupuesto con Supabase
 */
export class SupabaseElementoPresupuestoRepository implements ElementoPresupuestoRepository {
  private servicioRepo: ServicioRepository;
  private productoRepo: ProductoRepository;
  private paqueteRepo: PaqueteRepository;
  
  constructor() {
    this.servicioRepo = new SupabaseServicioRepository();
    this.productoRepo = new SupabaseProductoRepository();
    this.paqueteRepo = new SupabasePaqueteRepository();
  }
  
  async getAll(): Promise<RepositoryResult<ElementoPresupuesto[]>> {
    try {
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
