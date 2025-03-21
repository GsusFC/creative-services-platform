import { CaseStudy } from '@/types/case-study';
import { getAllCaseStudies as getDatabase, getCaseStudy as getPage, updateCaseStudy as updatePage } from './client';
import { transformNotionToCaseStudy, transformCaseStudyToNotion } from './transformer';
import { notion } from './notion-client';
import { isFullPage } from '@notionhq/client';

export class NotionService {
  /**
   * Crea un nuevo case study
   */
  async createCaseStudy(data: Partial<CaseStudy>): Promise<CaseStudy> {
    const properties = transformCaseStudyToNotion(data);
    const response = await notion.pages.create({
      parent: { database_id: process.env['NOTION_DATABASE_ID']! },
      properties: properties || {}
    });
    
    if (!isFullPage(response)) {
      throw new Error('Invalid response from Notion');
    }
    
    return transformNotionToCaseStudy(response);
  }

  /**
   * Elimina un case study
   */
  async deleteCaseStudy(id: string): Promise<void> {
    await notion.pages.update({
      page_id: id,
      archived: true
    });
  }


  /**
   * Obtiene todos los case studies
   */
  async getAllCaseStudies(): Promise<CaseStudy[]> {
    return await getDatabase();
  }

  /**
   * Obtiene un case study por su slug
   */
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
    const studies = await getDatabase();
    return studies.find(study => study.slug === slug) || null;
  }

  /**
   * Obtiene los case studies destacados
   */
  async getFeaturedCaseStudies(): Promise<CaseStudy[]> {
    const studies = await getDatabase();
    return studies
      .filter(study => study.featured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
  }

  /**
   * Actualiza un case study
   */
  async updateCaseStudy(id: string, data: Partial<CaseStudy>): Promise<CaseStudy> {
    return await updatePage({ id, ...data });
  }

  /**
   * Actualiza el estado de destacado de varios case studies
   */
  async updateFeaturedCaseStudies(updates: { id: string; featured: boolean; featuredOrder: number }[]) {
    const promises = updates.map(update => 
      this.updateCaseStudy(update.id, {
        featured: update.featured,
        featuredOrder: update.featuredOrder
      })
    );

    await Promise.all(promises);
  }
}
