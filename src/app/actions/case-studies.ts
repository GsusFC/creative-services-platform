import { CaseStudy } from '@/types/case-study'
import { getCaseStudy as getNotionCaseStudy, updateCaseStudy as updateNotionCaseStudy } from '@/lib/notion/client'

// Cada función debe tener su propia directiva 'use server'

/**
 * Obtiene un caso de estudio por su ID
 */
export async function getCaseStudy(id: string): Promise<CaseStudy> {
  'use server';
  
  console.log(`[Server Action] Obteniendo caso de estudio con ID: ${id}`);
  
  try {
    return await getNotionCaseStudy(id)
  } catch (error) {
    console.error(`Error al obtener caso de estudio (ID: ${id}):`, error)
    throw new Error(error instanceof Error ? error.message : 'Error al obtener el caso de estudio')
  }
}

/**
 * Actualiza un caso de estudio
 */
export async function updateCaseStudy(study: Partial<CaseStudy> & { id: string }): Promise<CaseStudy> {
  'use server';
  
  console.log(`[Server Action] Actualizando caso de estudio con ID: ${study.id}`);
  
  try {
    return await updateNotionCaseStudy(study)
  } catch (error) {
    console.error(`Error al actualizar caso de estudio (ID: ${study.id}):`, error)
    throw new Error(error instanceof Error ? error.message : 'Error al actualizar el caso de estudio')
  }
}
