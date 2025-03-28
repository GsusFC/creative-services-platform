'use server';

import { CaseStudy } from '@/types/case-study';
// Importar las funciones necesarias del servicio refactorizado
import { getRawCaseStudyById } from '@/lib/notion/service'; 
// Necesitamos importar processMediaItems, pero es interna. 
// Alternativa: Usar getCaseStudyBySlug si podemos obtener el slug, o refactorizar service.ts
// Por ahora, intentaremos obtener el slug del estudio local para usar getCaseStudyBySlug
import { getLocalStudy } from '@/lib/storage/case-studies';
import { getCaseStudyBySlug } from '@/lib/notion/service'; // Usaremos esta que ya procesa

/**
 * Obtiene un caso de estudio por su ID, asegurando que los medios estén procesados.
 */
export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  console.log(`[Server Action] Obteniendo y procesando caso de estudio con ID: ${id}`);
  
  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.error('ID inválido proporcionado a getCaseStudy:', id);
    throw new Error('ID de caso de estudio inválido');
  }
  
  try {
    // 1. Intentar obtener el estudio local para conseguir el slug
    const localStudy = await getLocalStudy(id);
    if (!localStudy || !localStudy.slug) {
      // Fallback: Intentar obtener raw de Notion y procesar (requeriría exportar processMediaItems o duplicar lógica)
      // Por simplicidad, si no hay slug local, lanzamos error o devolvemos null.
      console.warn(`[Server Action] No se encontró estudio local o slug para ID: ${id}. No se pueden procesar medios.`);
      // Podríamos intentar getRawCaseStudyById y devolverlo sin procesar, pero las imágenes no funcionarían.
      // Devolvemos null para indicar que no se pudo obtener la versión procesada.
      return null; 
      // Alternativamente:
      // const rawStudy = await getRawCaseStudyById(id);
      // return rawStudy; // Devolvería datos raw con URLs S3
    }

    // 2. TEMPORALMENTE: Devolver solo el estudio local para diagnosticar error 500
    console.log(`[DIAGNÓSTICO] Devolviendo solo localStudy para ID: ${id}`);
    return localStudy; 

    // // 2. Usar getCaseStudyBySlug que ya maneja la lógica de obtener, procesar y guardar
    // console.log(`[Server Action] Usando slug "${localStudy.slug}" para obtener estudio procesado.`);
    // const processedStudy = await getCaseStudyBySlug(localStudy.slug);
    
    // if (!processedStudy) {
    //    console.warn(`[Server Action] getCaseStudyBySlug no devolvió estudio para slug: ${localStudy.slug}`);
    //    // Podríamos devolver el localStudy como fallback si existe
    //    return localStudy; 
    // }

    // console.log('[Server Action] Caso de estudio procesado obtenido correctamente');
    // return processedStudy;

  } catch (error) {
    console.error(`[Server Action] Error CATCH GENERAL en getCaseStudy (ID: ${id}):`, error);
    throw new Error(error instanceof Error ? error.message : 'Error al obtener el caso de estudio');
  }
}

/**
 * Actualiza un caso de estudio
 * // TODO: Esta función necesita ser revisada ya que updateNotionCaseStudy no existe en client.ts
 */
/* // Comentamos la función entera para evitar errores de compilación
export async function updateCaseStudy(study: Partial<CaseStudy> & { id: string }): Promise<CaseStudy> {
  console.log(`[Server Action] Actualizando caso de estudio con ID: ${study.id}`);
  
  if (!study.id || typeof study.id !== 'string' || study.id.trim() === '') {
    console.error('ID inválido proporcionado a updateCaseStudy');
    throw new Error('ID de caso de estudio inválido');
  }
  
  try {
    // La siguiente línea causará error porque updateNotionCaseStudy no está definida tras comentar la importación
    // const updatedStudy = await updateNotionCaseStudy(study); 
    // console.log('[Server Action] Caso de estudio actualizado correctamente');
    // return updatedStudy;
    
    // Placeholder mientras se corrige la lógica de actualización
    console.warn("[Server Action] La función updateCaseStudy necesita ser implementada correctamente.");
    // Devolvemos el estudio parcial recibido como apaño temporal
    // En una implementación real, aquí iría la lógica para actualizar en Notion si existiera
    // o se llamaría a una función diferente si la lógica está en otro sitio.
    const currentStudy = await getNotionCaseStudy(study.id);
    if (!currentStudy) {
      throw new Error('No se encontró el estudio para actualizar');
    }
    // Simula una actualización parcial (esto NO actualiza Notion)
    const simulatedUpdate = { ...currentStudy, ...study }; 
    return simulatedUpdate;

  } catch (error) {
    console.error(`[Server Action] Error al actualizar caso de estudio (ID: ${study.id}):`, error);
    throw new Error(error instanceof Error ? error.message : 'Error al actualizar el caso de estudio');
  }
}
*/
