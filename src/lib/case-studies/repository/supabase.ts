import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';
import { ICaseStudyRepository } from './types';
import * as supabaseService from '../supabase-service';

/**
 * Implementación del repositorio usando Supabase
 * Conecta con la base de datos real en Supabase
 */
export class SupabaseCaseStudyRepository implements ICaseStudyRepository {
  
  /**
   * Obtiene todos los case studies
   */
  async getAll(): Promise<CaseStudy[]> {
    return supabaseService.getAllCaseStudies();
  }

  /**
   * Obtiene un case study por su slug
   */
  async getBySlug(slug: string): Promise<CaseStudy | null> {
    return supabaseService.getCaseStudyBySlug(slug);
  }

  /**
   * Crea un nuevo case study
   */
  async create(caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
    return supabaseService.createCaseStudy(caseStudyData);
  }

  /**
   * Actualiza un case study existente
   */
  async update(id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy> {
    return supabaseService.updateCaseStudy(id, caseStudyData);
  }

  /**
   * Elimina un case study
   */
  async delete(id: string): Promise<void> {
    return supabaseService.deleteCaseStudy(id);
  }

  /**
   * Actualiza el estado de destacado de los case studies
   */
  async updateFeatured(updates: FeaturedCaseUpdate[]): Promise<void> {
    return supabaseService.updateFeaturedCaseStudies(updates);
  }

  /**
   * Obtiene los case studies destacados
   */
  async getFeatured(): Promise<CaseStudy[]> {
    return supabaseService.getFeaturedCaseStudies();
  }
}
