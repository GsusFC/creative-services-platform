import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';

/**
 * Interfaz que define las operaciones disponibles para el repositorio de Case Studies
 */
export interface ICaseStudyRepository {
  /**
   * Obtiene todos los case studies
   */
  getAll(): Promise<CaseStudy[]>;
  
  /**
   * Obtiene un case study por su slug
   */
  getBySlug(slug: string): Promise<CaseStudy | null>;
  
  /**
   * Crea un nuevo case study
   */
  create(caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy>;
  
  /**
   * Actualiza un case study existente
   */
  update(id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy>;
  
  /**
   * Elimina un case study
   */
  delete(id: string): Promise<void>;
  
  /**
   * Actualiza el estado de destacado de los case studies
   */
  updateFeatured(updates: FeaturedCaseUpdate[]): Promise<void>;
  
  /**
   * Obtiene los case studies destacados
   */
  getFeatured(): Promise<CaseStudy[]>;
}
