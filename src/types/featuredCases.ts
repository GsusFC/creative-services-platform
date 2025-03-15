import { MediaItem } from './case-study';

export interface FeaturedCase {
  id: string;
  title: string;
  slug: string;
  description?: string;
  description2?: string;
  client: string;
  imageUrl?: string;
  mediaItems?: MediaItem[];
  tags?: string[];
  order: number;
  status?: 'draft' | 'published';
  featured: boolean;
  featuredOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeaturedCasesResponse {
  cases: FeaturedCase[];
  success: boolean;
  error?: string;
}
