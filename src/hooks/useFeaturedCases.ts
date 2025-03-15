import { useState, useEffect, useCallback } from 'react';
import { FeaturedCase } from '@/types/featuredCases';
import { 
  fetchFeaturedCases, 
  updateFeaturedCasesOrder, 
  addFeaturedCase, 
  deleteFeaturedCase 
} from '@/api/featuredCasesService';

export const useFeaturedCases = () => {
  const [cases, setCases] = useState<FeaturedCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar casos destacados
  const loadFeaturedCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeaturedCases();
      setCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los casos destacados');
      console.error('Error en useFeaturedCases:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar orden de casos
  const updateOrder = useCallback(async (updatedCases: FeaturedCase[]) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateFeaturedCasesOrder(updatedCases);
      setCases(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el orden');
      console.error('Error en updateOrder:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Añadir nuevo caso
  const addCase = useCallback(async (caseData: Omit<FeaturedCase, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newCase = await addFeaturedCase(caseData);
      setCases(prev => [...prev, newCase]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al añadir el caso');
      console.error('Error en addCase:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar caso
  const deleteCase = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await deleteFeaturedCase(id);
      if (success) {
        setCases(prev => prev.filter(c => c.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el caso');
      console.error('Error en deleteCase:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar casos al montar el componente
  useEffect(() => {
    loadFeaturedCases();
  }, [loadFeaturedCases]);

  return {
    cases,
    loading,
    error,
    loadFeaturedCases,
    updateOrder,
    addCase,
    deleteCase
  };
};
