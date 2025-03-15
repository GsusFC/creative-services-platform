import axios from 'axios';
import { FeaturedCase, FeaturedCasesResponse } from '@/types/featuredCases';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TIMEOUT_MS = 10000; // 10 segundos de timeout

// Cliente axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtiene todos los casos destacados
 */
export const fetchFeaturedCases = async (): Promise<FeaturedCase[]> => {
  try {
    const response = await apiClient.get<FeaturedCasesResponse>('/featured-cases');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al obtener los casos destacados');
    }
    
    return response.data.cases;
  } catch (error) {
    console.error('Error fetching featured cases:', error);
    throw error;
  }
};

/**
 * Actualiza el orden de los casos destacados
 */
export const updateFeaturedCasesOrder = async (cases: FeaturedCase[]): Promise<FeaturedCase[]> => {
  try {
    const response = await apiClient.put<FeaturedCasesResponse>('/featured-cases/order', { cases });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al actualizar el orden de los casos destacados');
    }
    
    return response.data.cases;
  } catch (error) {
    console.error('Error updating featured cases order:', error);
    throw error;
  }
};

/**
 * Añade un nuevo caso destacado
 */
export const addFeaturedCase = async (caseData: Omit<FeaturedCase, 'id'>): Promise<FeaturedCase> => {
  try {
    const response = await apiClient.post<{ case: FeaturedCase; success: boolean; error?: string }>('/featured-cases', caseData);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al añadir el caso destacado');
    }
    
    return response.data.case;
  } catch (error) {
    console.error('Error adding featured case:', error);
    throw error;
  }
};

/**
 * Elimina un caso destacado
 */
export const deleteFeaturedCase = async (id: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete<{ success: boolean; error?: string }>(`/featured-cases/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar el caso destacado');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting featured case:', error);
    throw error;
  }
};
