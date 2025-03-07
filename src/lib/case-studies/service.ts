import { v4 as uuidv4 } from 'uuid';
import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';
import { getMockCaseStudies, getMockCaseStudyBySlug } from './mock-service';

// Almacenamiento temporal para simular una base de datos
let localCaseStudies: CaseStudy[] = [];

// Inicializar con los case studies de mock
(async () => {
  try {
    // Cargamos los datos mock solo si no tenemos datos
    if (localCaseStudies.length === 0) {
      localCaseStudies = await getMockCaseStudies();
      console.log('Case studies inicializados con datos mock:', localCaseStudies.length);
    }
  } catch (error) {
    console.error('Error al inicializar case studies:', error);
  }
})();

/**
 * Obtener todos los case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  // Si no hay datos locales, intentamos obtener los datos mock como fallback
  if (localCaseStudies.length === 0) {
    try {
      localCaseStudies = await getMockCaseStudies();
    } catch (error) {
      console.error('Error al obtener case studies mock:', error);
    }
  }

  return [...localCaseStudies].sort((a, b) => a.order - b.order);
}

/**
 * Obtener un case study por su slug
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  // Intentamos primero en el almacenamiento local
  const caseStudy = localCaseStudies.find(cs => cs.slug === slug);
  
  if (!caseStudy) {
    // Intentar obtener del servicio de mock como fallback
    try {
      const mockCaseStudy = await getMockCaseStudyBySlug(slug);
      
      // Si encontramos el caso en los datos mock, lo añadimos a nuestro almacenamiento local
      if (mockCaseStudy && !localCaseStudies.some(cs => cs.id === mockCaseStudy.id)) {
        localCaseStudies.push(mockCaseStudy);
      }
      
      return mockCaseStudy;
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
    featuredOrder: caseStudyData.featuredOrder || 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Agregar a nuestro almacenamiento local
  localCaseStudies.push(newCaseStudy);
  console.log('Nuevo case study creado:', newCaseStudy.title);
  
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
    id, // Asegurar que el ID no cambie
    updatedAt: new Date().toISOString() // Actualizar la fecha de modificación
  };
  
  // Actualizar en nuestro almacenamiento local
  localCaseStudies[index] = updatedCaseStudy;
  console.log('Case study actualizado:', updatedCaseStudy.title);
  
  return updatedCaseStudy;
}

/**
 * Eliminar un case study
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  // Filtrar el case study a eliminar
  const caseStudyToDelete = localCaseStudies.find(cs => cs.id === id);
  if (caseStudyToDelete) {
    console.log('Case study eliminado:', caseStudyToDelete.title);
  }
  
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
        featuredOrder: update.featuredOrder,
        updatedAt: new Date().toISOString() // Actualizar la fecha de modificación
      };
      console.log('Estado destacado actualizado para:', localCaseStudies[index].title);
    }
  }
}

/**
 * Obtener los case studies destacados
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  // Si no hay datos locales o hay pocos datos, cargar los mock
  if (localCaseStudies.length === 0) {
    try {
      localCaseStudies = await getMockCaseStudies();
    } catch (error) {
      console.error('Error al obtener case studies mock:', error);
    }
  }

  return localCaseStudies
    .filter(cs => cs.featured && cs.status === 'published')
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}
