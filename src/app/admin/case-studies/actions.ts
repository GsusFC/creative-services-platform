'use server';

import { CaseStudy } from '@/types/case-study';
import { getCaseStudy as getNotionCaseStudy, updateCaseStudy as updateNotionCaseStudy } from '@/lib/notion/client';

/**
 * Obtiene un caso de estudio por su ID
 */
export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  console.log(`[Server Action] Obteniendo caso de estudio con ID: ${id}`);
  
  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.error('ID inválido proporcionado a getCaseStudy:', id);
    throw new Error('ID de caso de estudio inválido');
  }
  
  try {
    const study = await getNotionCaseStudy(id);
    console.log('[Server Action] Caso de estudio obtenido correctamente');
    return study;
  } catch (error) {
    console.error(`[Server Action] Error al obtener caso de estudio (ID: ${id}):`, error);
    throw new Error(error instanceof Error ? error.message : 'Error al obtener el caso de estudio');
  }
}

/**
 * Actualiza un caso de estudio
 */
export async function updateCaseStudy(study: Partial<CaseStudy> & { id: string }): Promise<CaseStudy> {
  console.log(`[Server Action] Actualizando caso de estudio con ID: ${study.id}`);
  
  if (!study.id || typeof study.id !== 'string' || study.id.trim() === '') {
    console.error('ID inválido proporcionado a updateCaseStudy');
    throw new Error('ID de caso de estudio inválido');
  }
  
  try {
    const updatedStudy = await updateNotionCaseStudy(study);
    console.log('[Server Action] Caso de estudio actualizado correctamente');
    return updatedStudy;
  } catch (error) {
    console.error(`[Server Action] Error al actualizar caso de estudio (ID: ${study.id}):`, error);
    throw new Error(error instanceof Error ? error.message : 'Error al actualizar el caso de estudio');
  }
}
