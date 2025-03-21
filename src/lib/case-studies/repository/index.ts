import { ICaseStudyRepository } from './types';
import { InMemoryCaseStudyRepository } from './in-memory';

// Instancia singleton del repositorio
let repository: ICaseStudyRepository | null = null;

/**
 * Obtiene la instancia del repositorio de case studies
 * Utiliza un patrón singleton para compartir la misma instancia
 */
export function getCaseStudyRepository(): ICaseStudyRepository {
  if (!repository) {
    repository = new InMemoryCaseStudyRepository();
  }
  
  return repository;
}

// Exportamos tipos e interfaces para facilitar su uso
export * from './types';
