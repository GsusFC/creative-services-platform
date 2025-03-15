import { ICaseStudyRepository } from './types';
import { InMemoryCaseStudyRepository } from './in-memory';
import { SupabaseCaseStudyRepository } from './supabase';

// Instancia singleton del repositorio
let repository: ICaseStudyRepository | null = null;

/**
 * Obtiene la instancia del repositorio de case studies
 * Utiliza un patrón singleton para compartir la misma instancia
 */
export function getCaseStudyRepository(): ICaseStudyRepository {
  if (!repository) {
    try {
      // Usamos la implementación de Supabase para conectar con la base de datos real
      repository = new SupabaseCaseStudyRepository();
      console.log('Usando repositorio de Supabase para Case Studies');
    } catch (error) {
      // Fallback a datos en memoria si hay algún problema con Supabase
      console.warn('Error conectando con Supabase, usando repositorio en memoria como fallback:', error);
      repository = new InMemoryCaseStudyRepository();
    }
  }
  
  return repository;
}

// Exportamos tipos e interfaces para facilitar su uso
export * from './types';
