/**
 * Hook simplificado para obtener servicios
 * En una implementación real, esto se conectaría a Notion
 */
import { useState, useEffect } from 'react';
import { mockServiceApi } from '../mocks/mockData';
import { Category, Service, ServicesHookResult } from '../types/services';

export function useNotionServices() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar categorías y servicios desde el mock
        // En implementación real, esto se conectaría a Notion
        const categoriesData = await mockServiceApi.getCategories();
        const servicesData = await mockServiceApi.getServices();
        
        setCategories(categoriesData);
        setServices(servicesData);
      } catch (err) {
        console.error('Error loading services', err);
        setError('Error cargando los servicios. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filtrar servicios por categoría
  const getServicesByCategory = (categoryId) => {
    return services.filter(service => service.category_id === categoryId);
  };

  // Obtener servicio por ID
  const getServiceById = (serviceId) => {
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
