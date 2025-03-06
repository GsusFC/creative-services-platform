import { CaseStudy, FeaturedCaseUpdate } from "@/types/case-study";

// Base URL para las peticiones API
const API_BASE_URL = "/api/cms/case-studies";

/**
 * Obtiene todos los case studies
 * @returns Promise con el arreglo de case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    // En Next.js, cuando se ejecuta en el servidor, necesitamos una URL absoluta
    // Como solución alternativa, vamos a usar directamente el servicio mock
    // para evitar problemas con las URLs relativas en el servidor
    const { getMockCaseStudies } = await import('./mock-service');
    return await getMockCaseStudies();
    
    /* Código original comentado:
    const res = await fetch(API_BASE_URL, {
      next: { revalidate: 60 } // ISR - revalidar cada 60 segundos
    });

    if (!res.ok) {
      throw new Error("Error al obtener los case studies");
    }

    return await res.json();
    */
  } catch (error) {
    console.error("Error al obtener los case studies:", error);
    return [];
  }
}

/**
 * Obtiene un case study por su slug
 * @param slug El slug del case study
 * @returns Promise con el case study o null si no existe
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    // Como solución alternativa, vamos a usar directamente el servicio mock
    const { getMockCaseStudyBySlug } = await import('./mock-service');
    return await getMockCaseStudyBySlug(slug);
    
    /* Código original comentado:
    const res = await fetch(`${API_BASE_URL}/${slug}`, {
      next: { revalidate: 60 } // ISR - revalidar cada 60 segundos
    });

    if (!res.ok) {
      throw new Error(`Error al obtener el case study con slug ${slug}`);
    }

    return await res.json();
    */
  } catch (error) {
    console.error(`Error al obtener el case study con slug ${slug}:`, error);
    return null;
  }
}

/**
 * Obtiene los case studies destacados para la home
 * @returns Promise con el arreglo de case studies destacados
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  try {
    // Como solución alternativa, vamos a usar directamente el servicio mock
    const { getMockFeaturedCaseStudies } = await import('./mock-service');
    return await getMockFeaturedCaseStudies();
    
    /* Código original comentado:
    const res = await fetch(`${API_BASE_URL}/featured`, {
      next: { revalidate: 60 } // ISR - revalidar cada 60 segundos
    });

    if (!res.ok) {
      throw new Error("Error al obtener los case studies destacados");
    }

    return await res.json();
    */
  } catch (error) {
    console.error("Error al obtener los case studies destacados:", error);
    return [];
  }
}

/**
 * Crea un nuevo case study
 * @param caseStudy El case study a crear
 * @returns Promise con el case study creado
 */
export async function createCaseStudy(caseStudy: Omit<CaseStudy, "id">): Promise<CaseStudy | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caseStudy),
    });

    if (!res.ok) {
      throw new Error("Error al crear el case study");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al crear el case study:", error);
    return null;
  }
}

/**
 * Actualiza un case study existente
 * @param slug El slug del case study a actualizar
 * @param caseStudy Los datos a actualizar
 * @returns Promise con el case study actualizado
 */
export async function updateCaseStudy(slug: string, caseStudy: Partial<CaseStudy>): Promise<CaseStudy | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caseStudy),
    });

    if (!res.ok) {
      throw new Error(`Error al actualizar el case study con slug ${slug}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al actualizar el case study con slug ${slug}:`, error);
    return null;
  }
}

/**
 * Publica un case study
 * @param slug El slug del case study a publicar
 * @returns Promise con el case study publicado
 */
export async function publishCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${slug}/publish`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error(`Error al publicar el case study con slug ${slug}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al publicar el case study con slug ${slug}:`, error);
    return null;
  }
}

/**
 * Actualiza los case studies destacados
 * @param updates Arreglo con las actualizaciones de los case studies destacados
 * @returns Promise con el resultado de la operación
 */
export async function updateFeaturedCaseStudies(updates: FeaturedCaseUpdate[]): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/featured`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cases: updates }),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar los case studies destacados");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al actualizar los case studies destacados:", error);
    return { success: false };
  }
}

/**
 * Elimina un case study
 * @param slug El slug del case study a eliminar
 * @returns Promise con el resultado de la operación
 */
export async function deleteCaseStudy(slug: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Error al eliminar el case study con slug ${slug}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al eliminar el case study con slug ${slug}:`, error);
    return { success: false };
  }
}
