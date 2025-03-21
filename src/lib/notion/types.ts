import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { CaseStudy as ProjectCaseStudy } from '@/types/case-study';

export type CaseStudy = ProjectCaseStudy;

export interface NotionCaseStudy {
  id: string;
  client: string;           // title
  description: string;      // rich_text
  status: 'Sin empezar' | 'En progreso' | 'Listo';  // status
  language: string[];      // multi_select ['🇪🇸 ES', '🇬🇧 EN']
  services: string[];      // multi_select
  slug: string;            // rich_text
  highlighted: boolean;    // checkbox
  cover: {
    url: string;
    name: string;
  }[];                    // files
  avatar: {
    url: string;
    name: string;
  }[];                    // files
  website?: string;       // url
  video1?: string;        // url
  video2?: string;        // url
  createdAt: string;
  updatedAt: string;
}

export type CreateCaseStudyInput = Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCaseStudyInput = Partial<CreateCaseStudyInput> & { id: string; };

export type NotionPage = PageObjectResponse;
