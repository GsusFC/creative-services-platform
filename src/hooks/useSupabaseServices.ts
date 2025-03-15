'use client';

import { useState, useEffect } from 'react';
import { 
  getDepartamentos,
  getServicios
} from '../lib/do-it-yourself/services';
import { ServiceCategory, Service } from '@/types/services-supabase';

/**
 * Hook para obtener servicios y categorías de Supabase
 * con fallback a datos simulados si la base de datos aún no tiene datos
 */
export function useSupabaseServices() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener departamentos (equivalente a categorías)
        const departamentosResult = await getDepartamentos();
        
        // Obtener servicios
        const serviciosResult = await getServicios();
        
        if (departamentosResult.error || serviciosResult.error) {
          console.warn('Error obteniendo datos de Supabase, usando datos de respaldo');
          setError('Error al cargar datos. Usando datos predeterminados.');
          
          // Datos predeterminados en caso de error
          const defaultCategories: ServiceCategory[] = [
            { id: '1', name: 'Diseño', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', name: 'Desarrollo Web', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '3', name: 'Marketing', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ];
          
          const defaultServices: Service[] = [
            { id: '1', name: 'Diseño de Logo', description: 'Creación de identidad de marca', category_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', name: 'Sitio Web', description: 'Desarrollo de sitio web profesional', category_id: '2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '3', name: 'SEO', description: 'Optimización para motores de búsqueda', category_id: '3', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ];
          
          setCategories(defaultCategories);
          setServices(defaultServices);
        } else {
          // Mapear los departamentos a categorías
          const mappedCategories: ServiceCategory[] = departamentosResult.departamentos.map((dept): ServiceCategory => ({
            id: dept.id.toString(),
            name: dept.nombre,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
          
          // Mapear los servicios
          const mappedServices: Service[] = serviciosResult.servicios.map((serv): Service => ({
            id: serv.id.toString(),
            name: serv.nombre,
            description: serv.descripcion || '',
            category_id: serv.departamento_id.toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
          
          setCategories(mappedCategories);
          setServices(mappedServices);
        }
      } catch (e) {
        console.error('Error cargando datos:', e);
        setError('Error al cargar los datos: ' + (e instanceof Error ? e.message : String(e)));
        
        // Establecer datos vacíos en caso de error
        setCategories([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filtrar servicios por categoría
  const getServicesByCategory = (categoryId: string): Service[] => {
    return services.filter(service => service.category_id === categoryId);
  };

  // Obtener servicio por ID
  const getServiceById = (serviceId: string): Service | undefined => {
    return services.find(service => service.id === serviceId);
  };

  return {
    categories,
    services,
    loading,
    error,
    getServicesByCategory,
    getServiceById
  };
}
