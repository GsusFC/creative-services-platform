import { v4 as uuidv4 } from 'uuid';
import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';
import { ICaseStudyRepository } from './types';
import { getMockCaseStudies, getMockCaseStudyBySlug } from '../mock-service';

/**
 * Implementación en memoria del repositorio de Case Studies
 * Utiliza un array local como almacenamiento temporal
 */
export class InMemoryCaseStudyRepository implements ICaseStudyRepository {
  private caseStudies: CaseStudy[] = [];
  private initialized = false;

  /**
   * Inicializa el repositorio con datos mock si es necesario
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Solo cargamos datos mock si no tenemos datos
      if (this.caseStudies.length === 0) {
        this.caseStudies = await getMockCaseStudies();
        console.log('Case studies inicializados con datos mock:', this.caseStudies.length);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error al inicializar case studies:', error);
      // Inicializar con array vacío para evitar errores posteriores
      this.caseStudies = [];
      this.initialized = true;
    }
  }

  /**
   * Obtiene todos los case studies
   */
  async getAll(): Promise<CaseStudy[]> {
    await this.initialize();
    return [...this.caseStudies].sort((a, b) => a.order - b.order);
  }

  /**
   * Obtiene un case study por su slug
   */
  async getBySlug(slug: string): Promise<CaseStudy | null> {
    await this.initialize();
    
    // Buscar en el almacenamiento local
    const caseStudy = this.caseStudies.find(cs => cs.slug === slug);
    
    if (!caseStudy) {
      // Intentar obtener del servicio de mock como fallback
      try {
        const mockCaseStudy = await getMockCaseStudyBySlug(slug);
        
        // Si encontramos el caso en los datos mock, lo añadimos a nuestro almacenamiento local
        if (mockCaseStudy && !this.caseStudies.some(cs => cs.id === mockCaseStudy.id)) {
          this.caseStudies.push(mockCaseStudy);
          return mockCaseStudy;
        }
      } catch (error) {
        console.error(`Error al obtener case study mock con slug ${slug}:`, error);
      }
      
      return null;
    }
    
    return caseStudy;
  }

  /**
   * Crea un nuevo case study
   */
  async create(caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
    await this.initialize();
    
    // Crear nuevo case study con ID único
    const newCaseStudy: CaseStudy = {
      ...caseStudyData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Asignar valores predeterminados para props que podrían faltar
      description2: caseStudyData.description2 || '',
      mediaItems: caseStudyData.mediaItems || [],
      tags: caseStudyData.tags || [],
      slug: caseStudyData.slug || `case-study-${uuidv4().substring(0, 8)}`,
      status: caseStudyData.status || 'draft',
      featured: caseStudyData.featured || false,
      featuredOrder: caseStudyData.featuredOrder || 999
    };
    
    // Asignar orden si no se proporcionó
    if (typeof newCaseStudy.order !== 'number') {
      const maxOrder = this.caseStudies.length > 0 
        ? Math.max(...this.caseStudies.map(cs => cs.order)) 
        : 0;
      newCaseStudy.order = maxOrder + 1;
    }
    
    // Añadir al almacenamiento local
    this.caseStudies.push(newCaseStudy);
    
    return newCaseStudy;
  }

  /**
   * Actualiza un case study existente
   */
  async update(id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy> {
    await this.initialize();
    
    // Buscar el case study por ID
    const index = this.caseStudies.findIndex(cs => cs.id === id);
    
    if (index === -1) {
      throw new Error(`Case study con id ${id} no encontrado.`);
    }
    
    // Actualizar el case study con los nuevos datos
    const updatedCaseStudy: CaseStudy = {
      ...this.caseStudies[index],
      ...caseStudyData,
      updatedAt: new Date().toISOString()
    };
    
    // Reemplazar en el almacenamiento local
    this.caseStudies[index] = updatedCaseStudy;
    
    return updatedCaseStudy;
  }

  /**
   * Elimina un case study
   */
  async delete(id: string): Promise<void> {
    await this.initialize();
    
    // Filtrar para eliminar el case study
    const initialLength = this.caseStudies.length;
    this.caseStudies = this.caseStudies.filter(cs => cs.id !== id);
    
    // Verificar si se eliminó algún elemento
    if (this.caseStudies.length === initialLength) {
      throw new Error(`Case study con id ${id} no encontrado.`);
    }
  }

  /**
   * Actualiza el estado de destacado de los case studies
   */
  async updateFeatured(updates: FeaturedCaseUpdate[]): Promise<void> {
    await this.initialize();
    
    // Actualizar cada case study según las actualizaciones proporcionadas
    for (const update of updates) {
      const caseStudy = this.caseStudies.find(cs => cs.id === update.id);
      
      if (caseStudy) {
        caseStudy.featured = update.featured;
        caseStudy.featuredOrder = update.featuredOrder;
        caseStudy.updatedAt = new Date().toISOString();
      }
    }
  }

  /**
   * Obtiene los case studies destacados
   */
  async getFeatured(): Promise<CaseStudy[]> {
    await this.initialize();
    
    // Filtrar los case studies destacados y ordenarlos por featuredOrder
    return this.caseStudies
      .filter(cs => cs.featured)
      .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
  }
}
