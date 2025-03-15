import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';
import { getCaseStudyRepository } from './repository';

/**
 * Obtener todos los case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const repository = getCaseStudyRepository();
  return repository.getAll();
}

/**
 * Obtener un case study por su slug
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const repository = getCaseStudyRepository();
  return repository.getBySlug(slug);
}

/**
 * Crear un nuevo case study
 */
export async function createCaseStudy(caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
  const repository = getCaseStudyRepository();
  return repository.create(caseStudyData);
}

/**
 * Actualizar un case study existente
 */
export async function updateCaseStudy(id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy> {
  const repository = getCaseStudyRepository();
  return repository.update(id, caseStudyData);
}

/**
 * Eliminar un case study
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  const repository = getCaseStudyRepository();
  return repository.delete(id);
}

/**
 * Actualizar el estado de destacado de los case studies
 */
export async function updateFeaturedCaseStudies(updates: FeaturedCaseUpdate[]): Promise<void> {
  const repository = getCaseStudyRepository();
  return repository.updateFeatured(updates);
}

/**
 * Obtener los case studies destacados
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const repository = getCaseStudyRepository();
  return repository.getFeatured();
}
