import { v4 as uuidv4 } from 'uuid';
import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';
import { getMockCaseStudies, getMockCaseStudyBySlug } from './mock-service';

// Almacenamiento temporal para simular una base de datos
let localCaseStudies: CaseStudy[] = [];

// Inicializar con los case studies de mock
(async () => {
  try {
    localCaseStudies = await getMockCaseStudies();
  } catch (error) {
    console.error('Error al inicializar case studies:', error);
  }
})();

/**
 * Obtener todos los case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return [...localCaseStudies].sort((a, b) => a.order - b.order);
}

/**
 * Obtener un case study por su slug
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const caseStudy = localCaseStudies.find(cs => cs.slug === slug);
  
  if (!caseStudy) {
    // Intentar obtener del servicio de mock como fallback
    try {
      return await getMockCaseStudyBySlug(slug);
    } catch (error) {
      console.error(`Error al obtener case study por slug ${slug}:`, error);
      return null;
    }
  }
  
  return caseStudy;
}

/**
 * Crear un nuevo case study
 */
export async function createCaseStudy(caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
  // Generar un ID único
  const id = uuidv4();
  
  // Crear el nuevo case study con valores por defecto para campos faltantes
  const newCaseStudy: CaseStudy = {
    id,
    title: caseStudyData.title,
    client: caseStudyData.client,
    description: caseStudyData.description,
    description2: caseStudyData.description2 || '',
    mediaItems: caseStudyData.mediaItems || [],
    tags: caseStudyData.tags || [],
    order: caseStudyData.order || localCaseStudies.length + 1,
    slug: caseStudyData.slug || `case-study-${id.substring(0, 8)}`,
    status: caseStudyData.status || 'draft',
    featured: caseStudyData.featured || false,
    featuredOrder: caseStudyData.featuredOrder || 999
  };
  
  // Agregar a nuestro almacenamiento local
  localCaseStudies.push(newCaseStudy);
  
  return newCaseStudy;
}

/**
 * Actualizar un case study existente
 */
export async function updateCaseStudy(id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy> {
  // Buscar el índice del case study en nuestro almacenamiento local
  const index = localCaseStudies.findIndex(cs => cs.id === id);
  
  if (index === -1) {
    throw new Error(`Case study con ID ${id} no encontrado`);
  }
  
  // Actualizar el case study, manteniendo el ID original
  const updatedCaseStudy: CaseStudy = {
    ...localCaseStudies[index],
    ...caseStudyData,
    id // Asegurar que el ID no cambie
  };
  
  // Actualizar en nuestro almacenamiento local
  localCaseStudies[index] = updatedCaseStudy;
  
  return updatedCaseStudy;
}

/**
 * Eliminar un case study
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  // Filtrar el case study a eliminar
  localCaseStudies = localCaseStudies.filter(cs => cs.id !== id);
}

/**
 * Actualizar el estado de destacado de los case studies
 */
export async function updateFeaturedCaseStudies(updates: FeaturedCaseUpdate[]): Promise<void> {
  // Para cada actualización, modificar el case study correspondiente
  for (const update of updates) {
    const index = localCaseStudies.findIndex(cs => cs.id === update.id);
    
    if (index !== -1) {
      localCaseStudies[index] = {
        ...localCaseStudies[index],
        featured: update.featured,
        featuredOrder: update.featuredOrder
      };
    }
  }
}

/**
 * Obtener los case studies destacados
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  return localCaseStudies
    .filter(cs => cs.featured && cs.status === 'published')
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}
