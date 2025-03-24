import { CaseStudy, FeaturedCaseUpdate } from '@/types/case-study';
import { transformNotionToCaseStudy, transformCaseStudyToNotion } from './transformer';
import { Client as NotionClient } from '@notionhq/client';
import { isFullPage } from '@notionhq/client';
import { 
  saveCaseStudy, 
  getAllLocalStudies, 
  getLocalStudy, 
  getLocalStudyBySlug, 
  getFeaturedLocalStudies
} from '../storage/case-studies';

export class NotionService {
  private client: NotionClient;
  private databaseId: string;

  constructor() {
    this.client = new NotionClient({
      auth: process.env['NEXT_PUBLIC_NOTION_API_KEY'] || ''
    });
    this.databaseId = process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] || '';
  }
  /**
   * Crea un nuevo case study
   */
  async createCaseStudy(data: Partial<CaseStudy>): Promise<CaseStudy> {
    try {
      const properties = await transformCaseStudyToNotion(data);
      const response = await this.client.pages.create({
        parent: { database_id: process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] || '' },
        properties
      });
      
      if (!isFullPage(response)) {
        throw new Error('Invalid response from Notion');
      }
      
      const caseStudy = await transformNotionToCaseStudy(response);
      await saveCaseStudy(caseStudy);
      return caseStudy;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al crear case study en Notion:', error.message);
      }

      const caseStudy: CaseStudy = {
        id: `local-${Date.now()}`,
        title: data.title || 'Nuevo Case Study',
        client: data.client || data.title || 'Nuevo Cliente',
        description: data.description || '',
        tagline: data.tagline || '',
        closingClaim: data.closingClaim || '',
        mediaItems: data.mediaItems || [],
        tags: data.tags || [],
        order: data.order || 0,
        slug: data.slug || `case-study-${Date.now()}`,
        status: data.status || 'draft',
        featured: data.featured || false,
        featuredOrder: data.featuredOrder || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false,
        website: data.website
      };
      
      await saveCaseStudy(caseStudy);
      return caseStudy;
    }
  }

  /**
   * Elimina un case study
   */
  async deleteCaseStudy(id: string): Promise<void> {
    try {
      await this.client.pages.update({
        page_id: id,
        archived: true
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al eliminar case study en Notion:', error.message);
      }
    }
    
    try {
      const study = await getLocalStudy(id);
      if (study) {
        study.status = 'draft';
        study.updatedAt = new Date().toISOString();
        await saveCaseStudy(study);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al eliminar case study localmente:', error.message);
      }
      throw error;
    }
  }


  /**
   * Obtiene todos los case studies
   */
  async getAllCaseStudies(): Promise<CaseStudy[]> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId
      });

      if (!response.results.every(isFullPage)) {
        throw new Error('Invalid response from Notion');
      }

      const notionStudies = await Promise.all(
        response.results.map(transformNotionToCaseStudy)
      );

      await Promise.all(
        notionStudies.map((study) =>
          saveCaseStudy({
            ...study,
            synced: true,
            updatedAt: new Date().toISOString()
          })
        )
      );

      return notionStudies;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al obtener case studies:', error.message);
      }
      return await getAllLocalStudies();
    }
  }

  /**
   * Obtiene un case study por su slug
   */
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
    console.log(`Buscando case study con slug: "${slug}"`);
    
    try {
      // Primero intentamos obtener el case study localmente
      const localStudy = await getLocalStudyBySlug(slug);
      
      // Si lo encontramos localmente y está sincronizado, lo devolvemos directamente
      if (localStudy && localStudy.synced) {
        console.log(`Case study con slug "${slug}" encontrado localmente y está sincronizado`);
        return localStudy;
      }
      
      // Intentamos obtenerlo de Notion
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Slug',
          rich_text: {
            equals: slug
          }
        }
      });

      const page = response.results[0];
      if (page && isFullPage(page)) {
        const notionStudy = await transformNotionToCaseStudy(page);
        await saveCaseStudy({
          ...notionStudy,
          synced: true,
          updatedAt: new Date().toISOString()
        });
        return notionStudy;
      }
      
      // Si no lo encontramos en Notion o no tenemos acceso, devolvemos el local aunque no esté sincronizado
      if (localStudy) {
        console.log(`Case study con slug "${slug}" encontrado solo localmente`);
        return localStudy;
      }
      
      console.log(`Case study con slug "${slug}" no encontrado`);
      return null;
    } catch (error) {
      console.error(`Error al buscar case study con slug "${slug}":`, error);
      return null;
    }
  }

  /**
   * Obtiene los case studies destacados
   */
  async getFeaturedCaseStudies(): Promise<CaseStudy[]> {
    try {
      const studies = await this.getAllCaseStudies();
      return studies
        .filter((study: CaseStudy) => study.featured)
        .sort((a: CaseStudy, b: CaseStudy) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al obtener case studies destacados:', error.message);
      }
      return await getFeaturedLocalStudies();
    }
  }

  /**
   * Actualiza un case study
   */
  async updateCaseStudy(id: string, data: Partial<CaseStudy>): Promise<CaseStudy> {
    try {
      const properties = await transformCaseStudyToNotion(data);
      const response = await this.client.pages.update({
        page_id: id,
        properties
      });

      if (!isFullPage(response)) {
        throw new Error('Invalid response from Notion');
      }

      const updatedStudy = await transformNotionToCaseStudy(response);
      await saveCaseStudy({
        ...updatedStudy,
        synced: true,
        updatedAt: new Date().toISOString()
      });
      return updatedStudy;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error al actualizar case study con id ${id}:`, error.message);
      }
      throw error;
    }
  }

  /**
   * Actualiza el estado de destacado de varios case studies
   */
  async updateFeaturedCaseStudies(updates: FeaturedCaseUpdate[]): Promise<void> {
    try {
      await Promise.all(
        updates.map(async (update: FeaturedCaseUpdate) => {
          const study = await this.getCaseStudyBySlug(update.slug);
          if (study) {
            await this.updateCaseStudy(study.id, {
              featured: update.featured,
              featuredOrder: update.featuredOrder
            });
          }
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al actualizar case studies destacados:', error.message);
      }
      throw error;
    }
  }
}
