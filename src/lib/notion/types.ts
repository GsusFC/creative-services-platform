import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { CaseStudy as ProjectCaseStudy } from '@/types/case-study';

export type CaseStudy = ProjectCaseStudy;

export interface NotionCaseStudy {
  id: string;
  title: string;
  client: string;
  description: string;
  description2?: string;
  status: 'draft' | 'published';
  mediaItems?: {
    type: 'image' | 'video';
    url: string;
    videoType?: 'vimeo' | 'local';
    thumbnailUrl?: string;
    alt: string;
    width: number;
    height: number;
    order: number;
    displayMode?: 'single' | 'dual' | 'dual_left' | 'dual_right';
  }[];
  tags: string[];
  order: number;
  featured: boolean;
  featuredOrder: number;
  createdAt: string;
  updatedAt: string;
  nextProject?: {
    slug: string;
    title?: string;
  };
}

export type CreateCaseStudyInput = Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;

export type UpdateCaseStudyInput = Partial<CreateCaseStudyInput> & { id: string; };

export type NotionPage = PageObjectResponse;
