/**
 * Servicio unificado para interactuar con el CMS de Case Studies
 * Este servicio centraliza todas las interacciones con el CMS para mantener
 * la consistencia y facilitar el mantenimiento
 */

import { CaseStudyDetail } from "../case-studies/mock-service";

// Interfaces y tipos
export interface CaseStudyListItem {
  slug: string;
  title: string;
  image: string;
  description: string;
  category: string;
  tags: string[];
  featured?: boolean;
  publishedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Opciones para getAll y featured
export interface CaseStudyOptions {
  preview?: boolean; // Para ver casos no publicados (admin)
  cache?: "force-cache" | "no-store" | number; // Opciones de caché
}

// Interfaz para los datos de la API pública
export interface PublicCaseStudyData {
  slug: string;
  title: string;
  image?: string;
  heroImage?: string;
  description: string;
  category: string;
  tags: string[];
  gallery?: Array<{url: string} | string>;
  [key: string]: unknown;
}

// Interfaz para las versiones de un caso de estudio
export interface CaseStudyVersion {
  version: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: string;
  status: 'draft' | 'published' | 'archived';
  data?: Partial<CaseStudyDetail>;
}

/**
 * Servicio principal para el CMS de Case Studies
 */
class CaseStudiesService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  private defaultCache: RequestCache = "force-cache";

  /**
   * Obtiene un caso de estudio específico por su slug
   */
  async getCaseStudy(
    slug: string,
    options: CaseStudyOptions = {}
  ): Promise<CaseStudyDetail | null> {
    try {
      // Primero intentamos con la API del CMS
      const cmsResponse = await fetch(
        `${this.apiUrl}/api/cms/case-studies/${slug}`,
        {
          cache: options.cache ? options.cache as RequestCache : this.defaultCache,
          next: { tags: [`case-study-${slug}`] },
        }
      );

      // Si el caso existe en el CMS, lo devolvemos
      if (cmsResponse.ok) {
        const data = await cmsResponse.json();
        if (data.success) {
          return data.caseStudy;
        }
      }

      // Si no está en el CMS, probamos con la API pública
      const publicResponse = await fetch(
        `${this.apiUrl}/api/case-studies/${slug}`,
        {
          cache: options.cache ? options.cache as RequestCache : this.defaultCache,
          next: { tags: [`case-study-${slug}`] },
        }
      );

      if (publicResponse.ok) {
        const data = await publicResponse.json();
        if (data.success) {
          // Adaptamos los datos al formato esperado si es necesario
          return this.adaptPublicToCms(data.caseStudy);
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching case study:", error);
      return null;
    }
  }

  /**
   * Obtiene todos los casos de estudio con paginación y filtros
   */
  async getAllCaseStudies(
    params: PaginationParams = {},
    options: CaseStudyOptions = {}
  ): Promise<PaginatedResponse<CaseStudyListItem>> {
    try {
      // Construimos los query params
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.category) queryParams.append("category", params.category);
      if (params.tag) queryParams.append("tag", params.tag);
      if (params.search) queryParams.append("search", params.search);
      if (options.preview) queryParams.append("preview", "true");

      // Primero intentamos con la API del CMS
      const url = `${this.apiUrl}/api/cms/case-studies?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        cache: options.cache ? options.cache as RequestCache : this.defaultCache,
        next: { tags: ["case-studies-list"] },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            items: data.caseStudies,
            totalItems: data.totalItems || data.caseStudies.length,
            totalPages: data.totalPages || 1,
            currentPage: data.currentPage || 1,
          };
        }
      }

      // Fallback a la API pública si el CMS falla
      const fallbackUrl = `${this.apiUrl}/api/case-studies`;
      const fallbackResponse = await fetch(fallbackUrl, {
        cache: options.cache ? options.cache as RequestCache : this.defaultCache,
      });

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        if (data.success) {
          // Con la API pública, no tenemos paginación, así que la simulamos
          const page = params.page || 1;
          const limit = params.limit || 10;
          const allItems = data.caseStudies;
          
          // Aplicamos filtros localmente
          let filteredItems = [...allItems];
          if (params.category) {
            filteredItems = filteredItems.filter(
              item => item.category === params.category
            );
          }
          if (params.tag) {
            filteredItems = filteredItems.filter(
              item => item.tags && item.tags.includes(params.tag!)
            );
          }
          if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredItems = filteredItems.filter(
              item => 
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower)
            );
          }
          
          // Aplicamos paginación
          const start = (page - 1) * limit;
          const end = start + limit;
          const paginatedItems = filteredItems.slice(start, end);
          
          return {
            items: paginatedItems,
            totalItems: filteredItems.length,
            totalPages: Math.ceil(filteredItems.length / limit),
            currentPage: page,
          };
        }
      }

      // Si todo falla, devolvemos una lista vacía
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
      };
    } catch (error) {
      console.error("Error fetching case studies:", error);
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
      };
    }
  }

  /**
   * Obtiene casos de estudio destacados
   */
  async getFeaturedCaseStudies(
    limit: number = 4,
    options: CaseStudyOptions = {}
  ): Promise<CaseStudyListItem[]> {
    try {
      // En el futuro, podemos crear un endpoint específico para esto
      // Por ahora, obtenemos todos y filtramos los destacados
      
      // Intentamos primero con un endpoint específico para featured si existe
      const featuredUrl = `${this.apiUrl}/api/cms/case-studies/featured?limit=${limit}`;
      
      try {
        const featuredResponse = await fetch(featuredUrl, {
          cache: options.cache ? options.cache as RequestCache : this.defaultCache,
          next: { tags: ["featured-case-studies"] },
        });
        
        if (featuredResponse.ok) {
          const data = await featuredResponse.json();
          if (data.success && data.caseStudies && data.caseStudies.length > 0) {
            return data.caseStudies;
          }
        }
      } catch (e) {
        // Si no existe el endpoint específico, continuamos con el plan B
        console.log("Featured endpoint not available, falling back to filtering");
      }
      
      // Plan B: Obtenemos todos y filtramos
      const { items } = await this.getAllCaseStudies(
        { limit: 20 }, // Obtenemos más para poder filtrar
        options
      );
      
      // Primero intentamos encontrar casos marcados como featured
      let featuredItems = items.filter(item => item.featured === true);
      
      // Si no hay suficientes marcados como featured, completamos con otros
      if (featuredItems.length < limit) {
        const nonFeatured = items.filter(item => item.featured !== true);
        featuredItems = [
          ...featuredItems,
          ...nonFeatured.slice(0, limit - featuredItems.length)
        ];
      }
      
      return featuredItems.slice(0, limit);
    } catch (error) {
      console.error("Error fetching featured case studies:", error);
      return [];
    }
  }

  /**
   * Adapta el formato de la API pública al formato del CMS
   */
  private adaptPublicToCms(publicData: PublicCaseStudyData): CaseStudyDetail {
    // Convertimos las propiedades según sea necesario
    if (publicData.image && !publicData.heroImage) {
      publicData.heroImage = publicData.image;
    }

    // Convertimos gallery de objetos a strings si es necesario
    if (publicData.gallery && publicData.gallery.length > 0) {
      publicData.gallery = publicData.gallery.map((item) => {
        if (typeof item === 'object' && item !== null && 'url' in item) {
          return item.url;
        }
        return item as string;
      }) as string[];
    }

    return publicData as unknown as CaseStudyDetail;
  }

  /**
   * Obtiene versiones de un caso de estudio
   */
  async getCaseStudyVersions(slug: string): Promise<CaseStudyVersion[]> {
    try {
      const url = `${this.apiUrl}/api/cms/case-studies/${slug}/versions`;
      const response = await fetch(url, {
        cache: 'no-store', // Siempre fresco para versiones
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.versions;
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching case study versions:", error);
      return [];
    }
  }
}

// Singleton instance
export const caseStudiesService = new CaseStudiesService();
export default caseStudiesService;
