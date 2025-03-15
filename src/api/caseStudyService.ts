import axios from 'axios';
import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
const TIMEOUT = 10000; // 10 segundos de timeout para todas las solicitudes

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Obtener todos los estudios de caso
 */
export const getAllCaseStudies = async (): Promise<CaseStudy[]> => {
  try {
    const response = await api.get('/case-studies');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener todos los estudios de caso:', error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.getAllCaseStudies());
  }
};

/**
 * Obtener un estudio de caso por su slug
 */
export const getCaseStudyBySlug = async (slug: string): Promise<CaseStudy | null> => {
  try {
    const response = await api.get(`/case-studies/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error al obtener estudio por slug ${slug}:`, error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.getCaseStudyBySlug(slug));
  }
};

/**
 * Crear un nuevo estudio de caso
 */
export const createCaseStudy = async (caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> => {
  try {
    const response = await api.post('/case-studies', caseStudyData);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear estudio de caso:', error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.createCaseStudy(caseStudyData));
  }
};

/**
 * Actualizar un estudio de caso existente
 */
export const updateCaseStudy = async (id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy> => {
  try {
    const response = await api.put(`/case-studies/${id}`, caseStudyData);
    return response.data;
  } catch (error: any) {
    console.error(`Error al actualizar estudio con id ${id}:`, error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.updateCaseStudy(id, caseStudyData));
  }
};

/**
 * Eliminar un estudio de caso
 */
export const deleteCaseStudy = async (id: string): Promise<void> => {
  try {
    await api.delete(`/case-studies/${id}`);
  } catch (error: any) {
    console.error(`Error al eliminar estudio con id ${id}:`, error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.deleteCaseStudy(id));
  }
};

/**
 * Obtener estudios de caso destacados
 */
export const getFeaturedCaseStudies = async (): Promise<CaseStudy[]> => {
  try {
    const response = await api.get('/case-studies/featured');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener estudios destacados:', error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.getFeaturedCaseStudies());
  }
};

/**
 * Actualizar el estado destacado de varios estudios de caso
 */
export const updateFeaturedCaseStudies = async (updates: FeaturedCaseUpdate[]): Promise<void> => {
  try {
    await api.put('/case-studies/featured', { updates });
  } catch (error: any) {
    console.error('Error al actualizar estudios destacados:', error.message);
    // Usar el servicio de mockup como fallback temporal hasta tener backend
    return import('@/lib/case-studies/service').then(service => service.updateFeaturedCaseStudies(updates));
  }
};
