import { CaseStudy } from '@/types/case-study';
import { notion, getDatabase, getPage, updatePage } from './client';
import { transformNotionToCaseStudy, transformCaseStudyToNotion } from './transformer';

export class NotionService {
  /**
   * Obtiene todos los case studies
   */
  async getAllCaseStudies(): Promise<CaseStudy[]> {
    const response = await getDatabase();
    if (!response) return [];
    
    return response.results.map(page => transformNotionToCaseStudy(page));
  }

  /**
   * Obtiene un case study por su slug
   */
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
    const response = await getDatabase();
    if (!response) return null;

    const page = response.results.find(
      page => transformNotionToCaseStudy(page).slug === slug
    );

    return page ? transformNotionToCaseStudy(page) : null;
  }

  /**
   * Obtiene los case studies destacados
   */
  async getFeaturedCaseStudies(): Promise<CaseStudy[]> {
    const response = await getDatabase();
    if (!response) return [];

    const featured = response.results
      .map(page => transformNotionToCaseStudy(page))
      .filter(study => study.featured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

    return featured;
  }

  /**
   * Actualiza un case study
   */
  async updateCaseStudy(id: string, data: Partial<CaseStudy>): Promise<CaseStudy> {
    const notionProperties = transformCaseStudyToNotion(data);
    const response = await updatePage(id, notionProperties);
    
    if (!response) {
      throw new Error('Failed to update case study in Notion');
    }

    return transformNotionToCaseStudy(response);
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
