import { NotionService } from '../notion/service';
import { CaseStudy } from '@/types/case-study';

const notionService = new NotionService();

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return notionService.getAllCaseStudies();
}

export async function createCaseStudy(caseStudy: Partial<CaseStudy>): Promise<CaseStudy> {
  return notionService.createCaseStudy(caseStudy);
}

export async function updateCaseStudy(id: string, caseStudy: Partial<CaseStudy>): Promise<CaseStudy> {
  return notionService.updateCaseStudy(id, caseStudy);
}

export async function deleteCaseStudy(id: string): Promise<void> {
  return notionService.deleteCaseStudy(id);
}
