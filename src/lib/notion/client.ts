'use server'

import { CaseStudy, MediaItem } from '@/types/case-study';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { 
  logDebug, 
  logInfo, 
  logWarn, 
  logError, 
  getCacheItem, 
  setCacheItem, 
  invalidateCache,
  checkNotionAvailability,
  fetchNotion
} from './utils';

import { downloadAndSaveImage } from '../utils/image-handler';

// Interfaces para tipado estricto
interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
  created_time?: string;
  last_edited_time?: string;
  // Campos para formato MCP
  name?: string;
  description?: string;
  tagline?: string;
  closingClaim?: string;
  slug?: string;
  website?: string | null;
  services?: string[];
  media?: {
    cover?: { url: string } | null;
    avatar?: { url: string } | null;
    hero_image?: { url: string } | null;
    images?: Array<{ url: string } | null> | null;
  } | null;
  videos?: {
    video_1?: string | null;
    video_2?: string | null;
  } | null;
  object?: string;
  // Campos adicionales para compatibilidad con PageObjectResponse
  [key: string]: any;
}

interface NotionProperty {
  id?: string;
  type: string;
  title?: Array<{ text: { content: string } }> | null;
  rich_text?: Array<{ text: { content: string } }> | null;
  multi_select?: Array<{ name: string }> | null;
  files?: Array<{ file?: { url: string } | null; external?: { url: string } | null; name?: string } | null> | null;
  url?: string | null;
  number?: number | null;
  select?: { name: string } | null;
  object?: string;
  // Campos adicionales para compatibilidad con diferentes tipos de propiedades
  [key: string]: any;
}

// Cambiamos para usar directamente la API de Notion en lugar del intermediario MCP-Notion
const NOTION_API_URL = 'https://api.notion.com/v1';

// Función para obtener variables de entorno de manera segura
function getEnvVar(name: string): string {
  // Intentamos obtener la variable de varias formas
  const value = process.env[name] || 
                (typeof window !== 'undefined' ? (window as any).__ENV__?.[name] : undefined);
  
  if (!value) {
    console.error(`Variable de entorno ${name} no está configurada`);
    return '';
  }
  
  return value;
}

// Obtenemos las variables de entorno de manera dinámica en cada llamada
function getDatabaseId(): string {
  return process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] || '';
}

function getApiKey(): string {
  return process.env['NEXT_PUBLIC_NOTION_API_KEY'] || '';
}

// Validamos las variables de entorno solo cuando se intenta usar la API
function validateEnvVars() {
  const databaseId = getDatabaseId();
  const apiKey = getApiKey();
  
  if (!databaseId) {
    throw new Error('NEXT_PUBLIC_NOTION_DATABASE_ID no está configurada');
  }
  
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_NOTION_API_KEY no está configurada');
  }
}

// Usamos checkNotionAvailability importado desde utils.ts

// Usamos fetchNotion importado desde utils.ts
// La implementación en utils.ts incluye reintentos, mejor manejo de errores y logging mejorado

// Usamos downloadFileToBase64 importado desde utils.ts

/**
 * Obtiene todos los case studies desde Notion
 * Implementa caché, paginación, procesamiento en paralelo y manejo de errores
 * @param options Opciones para la consulta (forzar refresco, filtros adicionales)
 * @returns Array de objetos CaseStudy
 */
export async function getAllCaseStudies(options?: { forceRefresh?: boolean, filters?: any }): Promise<CaseStudy[]> {
  try {
    // Validamos las variables de entorno antes de usar la API
    validateEnvVars();
    
    await logInfo('Obteniendo case studies de Notion...', { databaseId: getDatabaseId() });
    
    const forceRefresh = options?.forceRefresh || process.env.NODE_ENV === 'development';
    
    // Intentamos recuperar del caché primero (si no se fuerza el refresco)
    if (!forceRefresh) {
      const cacheKey = 'all_case_studies';
      try {
        const cachedData = await getCacheItem<CaseStudy[]>(cacheKey);
        
        if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
          // Verificamos que los datos en caché sean válidos (al menos el primer elemento)
          if (cachedData[0]?.id && cachedData[0]?.title) {
            await logInfo(`Recuperados ${cachedData.length} case studies desde caché`);
            return cachedData;
          } else {
            await logWarn('Datos en caché para case studies incompletos, invalidando caché');
            await invalidateCache(cacheKey);
          }
        }
      } catch (cacheError) {
        await logWarn('Error al recuperar case studies de caché:', cacheError);
        // Continuamos con la petición a Notion
      }
    } else {
      await logDebug('Forzando refresco de case studies desde Notion');
    }
    
    // Verificamos si el servicio Notion está disponible
    const isServiceAvailable = await checkNotionAvailability();
    
    if (!isServiceAvailable) {
      await logWarn('Servicio Notion API no disponible al intentar obtener case studies');
      throw new Error('No se pueden obtener los case studies porque el servicio Notion no está disponible');
    }
    
    // Verificamos que tengamos un ID de base de datos válido
    const databaseId = getDatabaseId();
    if (!databaseId) {
      throw new Error('No se ha configurado el ID de la base de datos de Notion');
    }
    
    // Obtenemos todos los case studies con paginación
    console.log('Iniciando fetchAllPaginatedResults con filtros:', options?.filters);
    const allResults = await fetchAllPaginatedResults(options?.filters);
    console.log('Resultados obtenidos de fetchAllPaginatedResults:', allResults.length);
    
    // Si no hay resultados, devolvemos un array vacío
    if (allResults.length === 0) {
      await logWarn('No se encontraron case studies en Notion');
      return [];
    }
    
    await logInfo(`Procesando ${allResults.length} case studies desde Notion`);
    
    // Procesamos los items en paralelo con limitación de concurrencia
    console.log('Iniciando processNotionResults con', allResults.length, 'resultados');
    const studies = await processNotionResults(allResults);
    console.log('Case studies procesados:', studies.length);
    
    // Guardamos en caché para futuras peticiones
    if (studies.length > 0 && !forceRefresh) {
      try {
        const cacheKey = 'all_case_studies';
        await setCacheItem(cacheKey, studies);
        await logDebug(`Guardados ${studies.length} case studies en caché`);
      } catch (cacheError) {
        await logWarn('Error al guardar case studies en caché:', cacheError);
      }
    }
    
    return studies;
  } catch (error) {
    await logError('Error al obtener case studies de Notion:', error);
    // En caso de error, devolvemos un array vacío para evitar errores en cascada
    return [];
  }
}

/**
 * Obtiene todos los resultados paginados de Notion
 * @param filters Filtros adicionales para la consulta
 * @returns Array con todos los resultados de todas las páginas
 */
async function fetchAllPaginatedResults(filters?: any): Promise<any[]> {
  let allResults: any[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  let pageCount = 0;
  
  while (hasMore) {
    pageCount++;
    await logDebug(`Obteniendo página ${pageCount} de resultados de Notion`);
    
    try {
      const queryBody: any = {
        page_size: 100, // Máximo permitido por Notion API
        filter: {
          property: 'Status',
          select: {
            equals: 'Listo'
          }
        },
        sorts: [
          {
            property: 'Brand Name',
            direction: 'ascending'
          }
        ]
      };
      
      // Añadimos filtros adicionales si existen
      if (filters) {
        queryBody.filter = {
          ...queryBody.filter,
          ...filters
        };
      }
      
      // Añadimos el cursor de inicio si existe
      if (startCursor) {
        queryBody.start_cursor = startCursor;
      }
      
      console.log('Consultando Notion API con filtros:', JSON.stringify(queryBody));
      const databaseId = getDatabaseId();
      const response = await fetchNotion(`/databases/${databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify(queryBody)
      });
      console.log('Respuesta de Notion API:', response ? 'Recibida' : 'Vacía');
      
      // Validamos la estructura de la respuesta
      if (!response || !response.results || !Array.isArray(response.results)) {
        throw new Error(`Formato de datos inesperado en la respuesta de Notion (página ${pageCount})`);
      }
      
      // Añadimos los resultados al array acumulado
      allResults = [...allResults, ...response.results];
      
      // Verificamos si hay más páginas
      hasMore = response.has_more || false;
      startCursor = response.next_cursor || undefined;
      
      await logDebug(`Obtenidos ${response.results.length} resultados en página ${pageCount}. Hay más: ${hasMore}`);
      
      // Pequeña pausa para no sobrecargar la API
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      await logError(`Error al obtener página ${pageCount} de resultados:`, error);
      // Si hay un error en alguna página, devolvemos lo que tengamos hasta ahora
      hasMore = false;
    }
  }
  
  return allResults;
}

/**
 * Procesa los resultados de Notion y los convierte en objetos CaseStudy
 * @param results Resultados de Notion
 * @returns Array de CaseStudy procesados
 */
async function processNotionResults(results: any[]): Promise<CaseStudy[]> {
  // Filtramos primero para eliminar items no válidos o archivados
  const validResults = results.filter(item => 
    item && item.id && !item.archived
  );
  
  // Definimos una función para procesar cada item con manejo de errores
  const processItem = async (item: any): Promise<CaseStudy | null> => {
    try {
      return await transformNotionToCaseStudy(item);
    } catch (error) {
      await logError(`Error al transformar case study ${item?.id || 'desconocido'}:`, error);
      return null; // Devolvemos null para los items con error
    }
  };
  
  // Procesamos los items en grupos para controlar la concurrencia
  const batchSize = 5; // Procesar 5 items a la vez
  const studies: (CaseStudy | null)[] = [];
  
  for (let i = 0; i < validResults.length; i += batchSize) {
    const batch = validResults.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processItem));
    studies.push(...batchResults);
    
    // Pequeña pausa entre lotes para no saturar los recursos
    if (i + batchSize < validResults.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  // Filtramos los nulls y aseguramos que tengan al menos título e ID
  const validStudies = studies
    .filter(Boolean) // Eliminamos los nulls
    .filter(study => study && study.title && study.id) as CaseStudy[];
  
  // Ordenamos por el campo order si está presente
  validStudies.sort((a, b) => {
    // Si ambos tienen order, ordenamos por ese campo
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order;
    }
    // Si solo uno tiene order, ese va primero
    if (typeof a.order === 'number') return -1;
    if (typeof b.order === 'number') return 1;
    // Si ninguno tiene order, ordenamos por título
    return a.title.localeCompare(b.title);
  });
  
  return validStudies;
}

/**
 * Obtiene un case study específico desde Notion por su ID
 * Incluye caché y manejo de errores mejorado
 * @param id ID del case study en Notion
 * @returns Objeto CaseStudy
 */
/**
 * Obtiene un case study específico por su ID
 * Implementa caché, manejo de errores y recuperación alternativa
 * @param id ID del case study a obtener
 * @returns El case study con todos sus datos
 */
export async function getCaseStudy(id: string): Promise<CaseStudy> {
  try {
    // Validamos que el ID sea válido
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Se requiere un ID válido para obtener un case study');
    }

    await logInfo(`Obteniendo case study ${id} de Notion...`);
    
    // Intentamos recuperar del caché primero
    const cacheKey = `case_study_${id}`;
    const cachedData = await getCacheItem<CaseStudy>(cacheKey);
    
    if (cachedData) {
      // Verificamos que el objeto cacheado tenga la estructura mínima esperada
      if (cachedData.id && cachedData.title) {
        await logInfo(`Case study ${id} recuperado desde caché`);
        return cachedData;
      } else {
        await logWarn(`Datos en caché para ${id} incompletos, invalidando caché`);
        await invalidateCache(cacheKey);
      }
    }
    
    // Verificamos si el servicio Notion está disponible
    const isServiceAvailable = await checkNotionAvailability();
    
    if (!isServiceAvailable) {
      await logWarn(`Servicio Notion API no disponible al intentar obtener ${id}`);
      throw new Error(`No se puede obtener el case study ${id} porque el servicio Notion no está disponible`);
    }
    
    // Si no hay datos en caché, hacemos la petición a Notion
    try {
      const data = await fetchNotion(`/pages/${id}`);
      await logDebug(`Datos recibidos para case study ${id}`);

      // Verificar que los datos tienen la estructura esperada
      if (!data || typeof data !== 'object') {
        throw new Error(`Formato de datos inesperado al obtener case study ${id}`);
      }
      
      // Verificar si la página está archivada
      if (data.archived) {
        await logWarn(`El case study ${id} está archivado en Notion`);
        throw new Error(`El case study ${id} está archivado y no está disponible`);
      }
      
      // Verificar que tenga propiedades
      if (!('properties' in data) || !data.properties) {
        throw new Error(`El case study ${id} no tiene propiedades en Notion`);
      }

      // Asegurarnos de que todas las propiedades tienen el formato correcto
      const processedData: NotionPage = {
        ...data,
        id: data.id,
        properties: Object.entries(data.properties || {}).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: {
            ...(value as Record<string, unknown>),
            object: 'property_item',
            type: (value as any)?.type || 'unknown'
          }
        }), {} as Record<string, NotionProperty>)
      };

      // Transformamos los datos a formato CaseStudy
      const caseStudy = await transformNotionToCaseStudy(processedData);
      
      // Verificamos que la transformación haya sido exitosa
      if (!caseStudy || !caseStudy.id) {
        throw new Error(`Error al transformar datos de Notion para case study ${id}`);
      }
      
      // Guardamos en caché para futuras peticiones
      await setCacheItem(cacheKey, caseStudy);
      await logDebug(`Case study ${id} guardado en caché`);
      
      return caseStudy;
    } catch (notionError) {
      await logError(`Error al obtener datos de Notion para ${id}:`, notionError);
      throw notionError;
    }
  } catch (error) {
    await logError(`Error al obtener case study ${id}:`, error);
    
    // Intentamos recuperar todos los case studies para ver si encontramos el que buscamos
    try {
      await logInfo(`Intentando recuperación alternativa para ${id} desde la lista completa`);
      const allStudies = await getAllCaseStudies();
      
      if (!Array.isArray(allStudies)) {
        throw new Error('La lista de case studies no es un array válido');
      }
      
      const study = allStudies.find(s => s && s.id === id);
      
      if (study) {
        await logInfo(`Case study ${id} recuperado desde la lista completa`);
        // Actualizamos la caché individual con este estudio
        await setCacheItem(`case_study_${id}`, study);
        return study;
      }
    } catch (fallbackError) {
      await logError('Error en la recuperación alternativa:', fallbackError);
    }
    
    // Si llegamos aquí, no pudimos recuperar el case study
    throw new Error(`No se pudo obtener el case study con ID ${id}`);
  }
}

/**
 * Crea un nuevo case study en Notion
 * Incluye validación de datos, manejo de errores, caché y modo offline
 * @param input Datos parciales del case study a crear
 * @returns El case study creado con todos sus datos
 */
export async function createCaseStudy(input: Partial<CaseStudy>): Promise<CaseStudy> {
  try {
    // Validamos que tengamos los campos mínimos necesarios
    if (!input || typeof input !== 'object') {
      throw new Error('Se requieren datos válidos para crear un case study');
    }

    if (!input.title || typeof input.title !== 'string' || input.title.trim() === '') {
      throw new Error('El título es obligatorio y debe ser un texto válido para crear un case study');
    }

    // Validamos que el slug sea válido si se proporciona
    if (input.slug !== undefined && (typeof input.slug !== 'string' || !/^[a-z0-9-]+$/.test(input.slug))) {
      throw new Error('El slug debe contener solo letras minúsculas, números y guiones');
    }

    // Validamos que las URLs sean válidas si se proporcionan
    if (input.website !== undefined && input.website !== null && !validateUrl(input.website)) {
      throw new Error('La URL del sitio web no es válida');
    }

    // Validamos los mediaItems si se proporcionan
    if (input.mediaItems !== undefined) {
      if (!Array.isArray(input.mediaItems)) {
        throw new Error('Los elementos multimedia deben ser un array');
      }
      
      // Verificamos que cada mediaItem tenga una URL válida
      const invalidItems = input.mediaItems.filter(item => !item || !item.url || !validateUrl(item.url));
      if (invalidItems.length > 0) {
        throw new Error(`${invalidItems.length} elementos multimedia tienen URLs inválidas`);
      }
    }

    // Validamos los tags si se proporcionan
    if (input.tags !== undefined) {
      if (!Array.isArray(input.tags)) {
        throw new Error('Los tags deben ser un array');
      }
      
      // Verificamos que todos los tags sean strings
      const invalidTags = input.tags.filter(tag => typeof tag !== 'string');
      if (invalidTags.length > 0) {
        throw new Error(`${invalidTags.length} tags no son strings válidos`);
      }
    }

    await logInfo(`Creando nuevo case study: ${input.title}`);
    
    // Verificamos que tengamos un ID de base de datos válido
    const databaseId = getDatabaseId();
    if (!databaseId) {
      throw new Error('No se ha configurado el ID de la base de datos de Notion');
    }
    
    // Verificamos si el servicio Notion está disponible
    const isServiceAvailable = await checkNotionAvailability();
    
    // Si el servicio no está disponible, trabajamos en modo offline
    if (!isServiceAvailable) {
      await logWarn('Servicio Notion API no disponible. Trabajando en modo offline.');
      
      // Generamos un ID temporal para el case study offline con más aleatoriedad
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      // Preparamos un objeto base con los valores por defecto para campos requeridos
      const baseValues = {
        title: input.title, // Ya validamos que existe
        client: input.title, // Por defecto igual al título
        description: '',
        tagline: '',
        closingClaim: '',
        mediaItems: [],
        tags: [],
        order: 0,
        slug: generateSlug(input.title),
        status: 'draft' as const,
        featured: false,
        featuredOrder: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      // Combinamos todo en el orden correcto
      const offlineCaseStudy: CaseStudy = {
        ...baseValues,
        ...input, // Sobreescribimos con los datos proporcionados
        id: tempId,
        synced: false
      };
      
      // Aseguramos que los campos derivados sean consistentes
      // Si no hay cliente pero hay título, usamos el título como cliente
      if (!offlineCaseStudy.client && offlineCaseStudy.title) {
        offlineCaseStudy.client = offlineCaseStudy.title;
      }
      
      // Si no hay slug pero hay título, generamos un slug a partir del título
      if (!offlineCaseStudy.slug && offlineCaseStudy.title) {
        offlineCaseStudy.slug = generateSlug(offlineCaseStudy.title);
      }
      
      // Guardamos en caché para sincronización posterior
      await setCacheItem(`offline_case_study_${tempId}`, offlineCaseStudy);
      await setCacheItem(`pending_create_${tempId}`, {
        data: input,
        timestamp,
        tempId
      });
      
      await logInfo(`Case study creado en modo offline con ID temporal: ${tempId}`);
      return offlineCaseStudy;
    }
    
    try {
      // Transformamos los datos para Notion
      const notionData = await transformCaseStudyToNotion(input);
      
      // Verificamos que la transformación haya sido exitosa
      if (!notionData || !notionData.properties) {
        throw new Error('Error al transformar los datos para Notion');
      }
      
      // Creamos la página en Notion
      await logDebug('Enviando datos a Notion API...');
      const data = await fetchNotion('/pages', {
        method: 'POST',
        body: JSON.stringify({
          parent: { database_id: getDatabaseId() },
          properties: notionData.properties
        })
      });
      
      // Verificamos la respuesta de Notion
      if (!data || !data.id) {
        throw new Error('Respuesta inválida de Notion al crear case study');
      }
      
      await logInfo(`Case study creado con éxito en Notion. ID: ${data.id}`);
      
      // Transformamos la respuesta a formato CaseStudy
      const caseStudyFromNotion = await transformNotionToCaseStudy(data as NotionPage);
      
      // Verificamos que la transformación haya sido exitosa
      if (!caseStudyFromNotion || !caseStudyFromNotion.id) {
        throw new Error('Error al transformar la respuesta de Notion');
      }
      
      // Combinamos los datos de Notion con los campos específicos de la plataforma
      const caseStudy: CaseStudy = {
        ...caseStudyFromNotion,
        // Añadimos los campos específicos de la plataforma que no vienen de Notion
        status: input.status || 'published',
        featured: input.featured !== undefined ? input.featured : false,
        featuredOrder: input.featuredOrder !== undefined ? input.featuredOrder : 0,
        // Aseguramos que la fecha de actualización sea la más reciente
        updatedAt: new Date().toISOString(),
        synced: true
      };
      
      // Invalidamos la caché de todos los case studies
      await invalidateCache('all_case_studies');
      
      // Guardamos el nuevo case study en caché
      await setCacheItem(`case_study_${caseStudy.id}`, caseStudy);
      await logDebug(`Case study guardado en caché con ID: ${caseStudy.id}`);
      
      return caseStudy;
    } catch (notionError) {
      await logError('Error en la comunicación con Notion API:', notionError);
      
      // Creamos un case study de emergencia en modo offline
      try {
        const tempId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const timestamp = new Date().toISOString();
        
        const fallbackStudy: CaseStudy = {
          id: tempId,
          title: input.title,
          client: input.client || input.title,
          description: input.description || '',
          tagline: input.tagline || '',
          closingClaim: input.closingClaim || '',
          slug: input.slug || generateSlug(input.title),
          status: input.status || 'draft',
          featured: input.featured !== undefined ? input.featured : false,
          featuredOrder: input.featuredOrder !== undefined ? input.featuredOrder : 0,
          createdAt: timestamp,
          updatedAt: timestamp,
          synced: false,
          mediaItems: input.mediaItems || [],
          tags: input.tags || [],
          order: typeof input.order === 'number' ? input.order : 0,
          website: input.website
        };
        
        // Guardamos en caché para sincronización posterior
        await setCacheItem(`offline_case_study_${tempId}`, fallbackStudy);
        await setCacheItem(`pending_create_${tempId}`, {
          data: input,
          timestamp,
          tempId,
          error: notionError instanceof Error ? notionError.message : 'Error desconocido'
        });
        
        await logWarn(`Creado case study de emergencia con ID temporal: ${tempId} debido a error de Notion`);
        return fallbackStudy;
      } catch (fallbackError) {
        await logError('Error en creación de fallback:', fallbackError);
      }
      
      throw new Error(`Error al comunicarse con Notion API: ${notionError instanceof Error ? notionError.message : 'Error desconocido'}`);
    }
  } catch (error) {
    await logError('Error al crear case study:', error);
    
    // Último intento: crear un objeto mínimo con los datos proporcionados
    try {
      if (input.title) {
        const tempId = `emergency_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const timestamp = new Date().toISOString();
        
        const emergencyStudy: CaseStudy = {
          id: tempId,
          title: input.title,
          client: input.client || input.title,
          description: input.description || '',
          tagline: input.tagline || '',
          closingClaim: input.closingClaim || '',
          slug: input.slug || generateSlug(input.title),
          status: input.status || 'draft',
          featured: input.featured !== undefined ? input.featured : false,
          featuredOrder: input.featuredOrder !== undefined ? input.featuredOrder : 0,
          createdAt: timestamp,
          updatedAt: timestamp,
          synced: false,
          mediaItems: input.mediaItems || [],
          tags: input.tags || [],
          order: typeof input.order === 'number' ? input.order : 0,
          website: input.website
        };
        
        // Guardamos en caché para posible recuperación posterior
        await setCacheItem(`emergency_case_study_${tempId}`, emergencyStudy);
        await setCacheItem(`pending_create_${tempId}`, {
          data: input,
          timestamp,
          tempId,
          error: error instanceof Error ? error.message : 'Error desconocido',
          emergency: true
        });
        
        await logWarn(`Creado objeto de emergencia con ID: ${tempId} debido a errores críticos`);
        return emergencyStudy;
      }
    } catch (emergencyError) {
      await logError('Error en creación de objeto de emergencia:', emergencyError);
    }
    
    throw new Error(`No se pudo crear el case study: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Genera un slug a partir de un título
 * @param title Título del case study
 * @returns Slug generado
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Elimina guiones duplicados
    .trim();
}

/**
 * Actualiza un case study existente en Notion
 * Incluye validación de datos, manejo de errores, caché y modo offline
 * @param param0 Objeto con ID y datos parciales del case study a actualizar
 * @returns El case study actualizado con todos sus datos
 */
export async function updateCaseStudy({ id, ...data }: Partial<CaseStudy> & { id: string }): Promise<CaseStudy> {
  try {
    // Validamos que el ID sea válido
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('ID de case study inválido');
    }

    // Validamos los datos de entrada
    if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim() === '')) {
      throw new Error('El título no puede estar vacío y debe ser un texto válido');
    }

    // Validamos que el slug sea válido si se proporciona
    if (data.slug !== undefined && (typeof data.slug !== 'string' || !/^[a-z0-9-]+$/.test(data.slug))) {
      throw new Error('El slug debe contener solo letras minúsculas, números y guiones');
    }

    // Validamos que las URLs sean válidas si se proporcionan
    if (data.website !== undefined && !validateUrl(data.website)) {
      throw new Error('La URL del sitio web no es válida');
    }

    // Validamos los mediaItems si se proporcionan
    if (data.mediaItems !== undefined) {
      if (!Array.isArray(data.mediaItems)) {
        throw new Error('Los elementos multimedia deben ser un array');
      }
      
      // Verificamos que cada mediaItem tenga una URL válida
      const invalidItems = data.mediaItems.filter(item => !item || !item.url || !validateUrl(item.url));
      if (invalidItems.length > 0) {
        throw new Error(`${invalidItems.length} elementos multimedia tienen URLs inválidas`);
      }
    }

    // Validamos los tags si se proporcionan
    if (data.tags !== undefined) {
      if (!Array.isArray(data.tags)) {
        throw new Error('Los tags deben ser un array');
      }
      
      // Verificamos que todos los tags sean strings
      const invalidTags = data.tags.filter(tag => typeof tag !== 'string');
      if (invalidTags.length > 0) {
        throw new Error(`${invalidTags.length} tags no son strings válidos`);
      }
    }

    await logInfo(`Actualizando case study ${id}`);
    
    // Verificamos que tengamos un ID de base de datos válido
    const databaseId = getDatabaseId();
    if (!databaseId) {
      throw new Error('No se ha configurado el ID de la base de datos de Notion');
    }
    
    // Verificamos si el servicio Notion está disponible
    const isServiceAvailable = await checkNotionAvailability();
    
    // Si el servicio no está disponible, trabajamos en modo offline
    if (!isServiceAvailable) {
      await logWarn(`Servicio Notion API no disponible. Trabajando en modo offline para ${id}`);
      
      // Intentamos obtener el case study actual del caché
      const cacheKey = `case_study_${id}`;
      const cachedStudy = await getCacheItem<CaseStudy>(cacheKey);
      
      if (!cachedStudy) {
        await logWarn(`No se encontró el case study ${id} en caché para actualización offline`);
      }
      
      const timestamp = new Date().toISOString();
      
      // Obtenemos los datos del caché y los nuevos datos
      const cachedData = cachedStudy || {};
      
      // Preparamos un objeto base con los valores por defecto para campos requeridos
      const baseValues = {
        title: 'Sin título',
        client: 'Sin cliente',
        description: '',
        tagline: '',
        closingClaim: '',
        mediaItems: [],
        tags: [],
        order: 0,
        slug: generateSlug('sin-titulo'),
        status: 'draft' as const,
        featured: false,
        featuredOrder: 0,
        createdAt: cachedStudy?.createdAt || timestamp
      };
      
      // Combinamos todo en el orden correcto
      const offlineStudy: CaseStudy = {
        // Primero los valores por defecto
        ...baseValues,
        // Luego los datos del caché
        ...cachedData,
        // Luego los nuevos datos proporcionados
        ...data,
        // Finalmente estos campos siempre tienen estos valores
        id,
        updatedAt: timestamp,
        synced: false
      };
      
      // Aseguramos que los campos derivados sean consistentes
      
      // Si no hay cliente pero hay título, usamos el título como cliente
      if (offlineStudy.title && (!offlineStudy.client || offlineStudy.client === 'Sin cliente')) {
        offlineStudy.client = offlineStudy.title;
      }
      
      // Si no hay slug pero hay título, generamos un slug a partir del título
      if (!offlineStudy.slug && offlineStudy.title) {
        offlineStudy.slug = generateSlug(offlineStudy.title);
      }
      
      // Actualizamos el caché con los datos offline
      await setCacheItem(cacheKey, offlineStudy);
      
      // También guardamos en un caché especial para cambios pendientes
      await setCacheItem(`pending_update_${id}`, {
        id,
        data,
        timestamp
      });
      
      await logInfo(`Case study ${id} actualizado en modo offline`);
      return offlineStudy;
    }

    try {
      // Primero obtenemos el case study actual para preservar los campos que no se sincronizan con Notion
      await logDebug(`Obteniendo datos actuales del case study ${id}`);
      const currentStudy = await getCaseStudy(id);
      
      if (!currentStudy) {
        throw new Error(`No se encontró el case study ${id} para actualizar`);
      }
      
      // Transformamos los datos para Notion (solo los campos que se sincronizan)
      const notionData = await transformCaseStudyToNotion(data);

      // Verificamos que los datos transformados sean válidos
      if (!notionData || !notionData.properties) {
        throw new Error(`Error al transformar datos para Notion`);
      }
      
      // Filtramos propiedades vacías para evitar sobrescribir con valores nulos
      const filteredProperties: Record<string, any> = {};
      for (const [key, value] of Object.entries(notionData.properties)) {
        // Solo incluimos propiedades que tienen valores válidos
        if (value !== null && value !== undefined && 
            (typeof value !== 'object' || Object.keys(value).length > 0)) {
          filteredProperties[key] = value;
        }
      }
      
      // Actualizamos la página en Notion
      await logDebug(`Enviando actualización a Notion para ${id}`);
      
      const response = await fetchNotion(`/pages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          properties: filteredProperties
        })
      });

      if (!response || !response.id) {
        throw new Error(`Respuesta inválida de Notion al actualizar case study ${id}`);
      }

      // Transformamos la respuesta de Notion a CaseStudy
      const updatedFromNotion = await transformNotionToCaseStudy(response);
      
      if (!updatedFromNotion || !updatedFromNotion.id) {
        throw new Error(`Error al transformar respuesta de Notion para ${id}`);
      }
      
      // Combinamos los datos de Notion con los campos específicos de la plataforma
      const updatedStudy: CaseStudy = {
        ...updatedFromNotion,
        // Preservamos los campos específicos de la plataforma que podrían estar en data o en currentStudy
        ...(data.status !== undefined ? { status: data.status } : { status: currentStudy.status }),
        ...(data.featured !== undefined ? { featured: data.featured } : { featured: currentStudy.featured }),
        ...(data.featuredOrder !== undefined ? { featuredOrder: data.featuredOrder } : { featuredOrder: currentStudy.featuredOrder }),
        // Aseguramos que la fecha de actualización sea la más reciente
        updatedAt: new Date().toISOString(),
        synced: true
      };
      
      // Actualizamos la caché
      await setCacheItem(`case_study_${id}`, updatedStudy);
      await invalidateCache('all_case_studies'); // Invalidamos la lista completa para forzar una recarga
      
      // Eliminamos cualquier actualización pendiente
      await invalidateCache(`pending_update_${id}`);
      
      await logInfo(`Case study ${id} actualizado con éxito`);
      return updatedStudy;
    } catch (notionError) {
      await logError(`Error en la comunicación con Notion API al actualizar ${id}:`, notionError);
      
      // Intentamos recuperar el case study actual y aplicar los cambios localmente
      try {
        const currentStudy = await getCaseStudy(id);
        if (currentStudy) {
          const timestamp = new Date().toISOString();
          
          // Combinamos los datos actuales con los nuevos, pero marcamos como no sincronizado
          const fallbackStudy: CaseStudy = {
            ...currentStudy,
            ...data,
            id,
            updatedAt: timestamp,
            synced: false
          };
          
          // Guardamos en caché para sincronización posterior
          await setCacheItem(`case_study_${id}`, fallbackStudy);
          await setCacheItem(`pending_update_${id}`, {
            id,
            data,
            timestamp,
            error: notionError instanceof Error ? notionError.message : 'Error desconocido'
          });
          
          await logWarn(`Cambios guardados localmente para ${id} debido a error de sincronización`);
          return fallbackStudy;
        }
      } catch (fallbackError) {
        await logError('Error en recuperación de fallback:', fallbackError);
      }
      
      throw new Error(`Error al comunicarse con Notion API: ${notionError instanceof Error ? notionError.message : 'Error desconocido'}`);
    }
  } catch (error) {
    await logError(`Error al actualizar case study ${id}:`, error);
    
    // Último intento: crear un objeto mínimo con los datos proporcionados
    try {
      const timestamp = new Date().toISOString();
      const emergencyStudy: CaseStudy = {
        id,
        title: data.title || 'Sin título',
        client: data.client || data.title || 'Sin cliente',
        description: data.description || '',
        tagline: data.tagline || '',
        closingClaim: data.closingClaim || '',
        slug: data.slug || generateSlug(data.title || 'sin-titulo'),
        status: data.status || 'draft',
        featured: data.featured !== undefined ? data.featured : false,
        featuredOrder: data.featuredOrder !== undefined ? data.featuredOrder : 0,
        createdAt: data.createdAt || timestamp,
        updatedAt: timestamp,
        synced: false,
        mediaItems: data.mediaItems || [],
        tags: data.tags || [],
        order: typeof data.order === 'number' ? data.order : 0
      };
      
      // Guardamos en caché para posible recuperación posterior
      await setCacheItem(`emergency_case_study_${id}`, emergencyStudy);
      await setCacheItem(`pending_update_${id}`, {
        id,
        data,
        timestamp,
        error: error instanceof Error ? error.message : 'Error desconocido',
        emergency: true
      });
      
      await logWarn(`Creado objeto de emergencia para ${id} debido a errores críticos`);
      return emergencyStudy;
    } catch (emergencyError) {
      await logError('Error en creación de objeto de emergencia:', emergencyError);
    }
    
    // Si absolutamente todo falla, propagamos el error original
    throw new Error(`No se pudo actualizar el case study: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Elimina un case study de Notion (en realidad lo marca como archivado)
 * Incluye validación de datos, manejo de errores, actualización de caché y soporte para modo offline
 * @param id ID del case study a eliminar
 * @returns Promise que se resuelve cuando se completa la operación
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  try {
    // Validamos que el ID sea válido
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('ID de case study inválido para eliminar');
    }

    // Verificamos que tengamos un ID de base de datos válido
    const databaseId = getDatabaseId();
    if (!databaseId) {
      throw new Error('No se ha configurado el ID de la base de datos de Notion');
    }

    await logInfo(`Eliminando case study ${id}`);
    
    // Verificamos si el servicio Notion está disponible
    const isServiceAvailable = await checkNotionAvailability();
    
    if (!isServiceAvailable) {
      await logWarn(`Servicio Notion API no disponible. Marcando para eliminación offline el case study ${id}`);
      
      try {
        // Intentamos obtener el case study de la caché
        const cachedStudy = await getCacheItem<CaseStudy>(`case_study_${id}`);
        
        if (cachedStudy) {
          // Marcamos el case study como eliminado en modo offline
          await setCacheItem(`deleted_case_study_${id}`, {
            id,
            timestamp: new Date().toISOString(),
            pendingSync: true
          });
          
          // Eliminamos de la caché normal
          await invalidateCache(`case_study_${id}`);
          await invalidateCache('all_case_studies');
          
          await logInfo(`Case study ${id} marcado para eliminación offline`);
          return;
        } else {
          await logWarn(`No se encontró el case study ${id} en caché para eliminación offline`);
          throw new Error(`No se puede eliminar el case study ${id} porque no existe en caché y el servicio Notion no está disponible`);
        }
      } catch (offlineError) {
        await logError(`Error al procesar eliminación offline para ${id}:`, offlineError);
        throw new Error(`No se puede eliminar el case study ${id} en modo offline: ${offlineError instanceof Error ? offlineError.message : 'Error desconocido'}`);
      }
    }
    
    try {
      // Verificamos que el case study exista antes de intentar eliminarlo
      await logDebug(`Verificando existencia del case study ${id} antes de eliminar`);
      const existingStudy = await fetchNotion(`/pages/${id}`);
      
      if (!existingStudy || !existingStudy.id) {
        await logWarn(`No se encontró el case study ${id} en Notion`);
        // Eliminamos de la caché de todos modos por si acaso
        await invalidateCache(`case_study_${id}`);
        await invalidateCache('all_case_studies');
        // Eliminamos cualquier marca de eliminación pendiente
        await invalidateCache(`deleted_case_study_${id}`);
        return; // Salimos sin error ya que el objetivo (que no exista) ya se cumplió
      }
      
      // Verificamos si ya está archivado
      if (existingStudy.archived) {
        await logInfo(`El case study ${id} ya estaba archivado en Notion`);
        // Eliminamos de la caché de todos modos
        await invalidateCache(`case_study_${id}`);
        await invalidateCache('all_case_studies');
        // Eliminamos cualquier marca de eliminación pendiente
        await invalidateCache(`deleted_case_study_${id}`);
        return;
      }
      
      // En Notion, "eliminar" significa archivar la página
      await logDebug(`Enviando solicitud de archivado a Notion para ${id}`);
      const response = await fetchNotion(`/pages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          archived: true
        })
      });
      
      // Verificamos que la respuesta sea correcta
      if (!response || !response.id) {
        throw new Error(`Respuesta inválida de Notion al archivar case study ${id}`);
      }
      
      if (!response.archived) {
        throw new Error(`El case study ${id} no fue archivado correctamente en Notion`);
      }
      
      // Eliminamos el case study de la caché
      await invalidateCache(`case_study_${id}`);
      await invalidateCache('all_case_studies');
      // Eliminamos cualquier marca de eliminación pendiente
      await invalidateCache(`deleted_case_study_${id}`);
      
      await logInfo(`Case study ${id} eliminado con éxito`);
      return;
    } catch (notionError) {
      await logError(`Error en la comunicación con Notion API al eliminar ${id}:`, notionError);
      
      // Intentamos marcar como pendiente de eliminación
      try {
        await setCacheItem(`deleted_case_study_${id}`, {
          id,
          timestamp: new Date().toISOString(),
          pendingSync: true,
          error: notionError instanceof Error ? notionError.message : 'Error desconocido'
        });
        
        // Actualizamos el case study en caché para marcarlo como pendiente de eliminación
        const cachedStudy = await getCacheItem<CaseStudy>(`case_study_${id}`);
        if (cachedStudy) {
          await setCacheItem(`case_study_${id}`, {
            ...cachedStudy,
            pendingDeletion: true,
            updatedAt: new Date().toISOString()
          });
        }
        
        await logWarn(`Case study ${id} marcado para eliminación posterior debido a error de comunicación`);
      } catch (cacheError) {
        await logError(`Error al marcar case study ${id} para eliminación posterior:`, cacheError);
      }
      
      throw new Error(`Error al comunicarse con Notion API: ${notionError instanceof Error ? notionError.message : 'Error desconocido'}`);
    }
  } catch (error) {
    await logError(`Error al eliminar case study ${id}:`, error);
    throw new Error(`No se pudo eliminar el case study ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Funciones auxiliares para transformar datos entre Notion y nuestra aplicación
 */

/**
 * Extrae texto de un campo rich_text de Notion
 * @param field Campo rich_text de Notion
 * @param defaultValue Valor por defecto si el campo está vacío
 * @returns Texto extraído o valor por defecto
 */
/**
 * Extrae texto de un campo rich_text de Notion con manejo de errores mejorado
 * @param field Campo rich_text de Notion
 * @param defaultValue Valor por defecto si el campo está vacío
 * @returns Texto extraído o valor por defecto
 */
async function extractRichTextField(field: any, defaultValue: string = ''): Promise<string> {
  try {
    // Caso 1: Campo nulo o indefinido
    if (field === null || field === undefined) {
      return defaultValue;
    }
    
    // Caso 2: Array de rich_text (formato estándar de Notion)
    if (Array.isArray(field)) {
      // Si el array está vacío
      if (field.length === 0) {
        return defaultValue;
      }
      
      // Concatenamos todos los bloques de texto si hay más de uno
      let fullText = '';
      
      for (const block of field) {
        if (block?.text?.content && typeof block.text.content === 'string') {
          fullText += block.text.content;
        }
      }
      
      return fullText || defaultValue;
    }
    
    // Caso 3: Objeto simple con propiedad content
    if (typeof field === 'object' && field?.text?.content) {
      return field.text.content;
    }
    
    // Caso 4: String directo
    if (typeof field === 'string') {
      return field;
    }
    
    // Si no coincide con ninguno de los formatos conocidos
    await logDebug(`Campo rich_text con formato desconocido: ${JSON.stringify(field).substring(0, 100)}...`);
    return defaultValue;
  } catch (error) {
    await logWarn(`Error al extraer campo rich_text:`, error);
    return defaultValue;
  }
}

/**
 * Tipo para los datos de entrada de Notion en formato MCP
 */
type McpNotionData = NotionPage & {
  name?: string;
  description?: string;
  tagline?: string;
  closingClaim?: string;
  slug?: string;
  website?: string;
  services?: string[];
  media?: {
    cover?: { url: string };
    avatar?: { url: string };
    hero_image?: { url: string };
    images?: Array<{ url: string }>;
  };
  videos?: {
    video_1?: string;
    video_2?: string;
  };
};

/**
 * Tipo para los campos básicos extraídos de Notion
 */
type BasicFields = {
  title: string;
  description: string;
  tagline: string;
  closingClaim: string;
  slug: string;
  website?: string | undefined;
  tags: string[];
};

/**
 * Extrae los elementos multimedia de un objeto Notion
 * @param data Datos de Notion
 * @param isMcpFormat Indica si los datos están en formato MCP
 * @returns Array de elementos multimedia
 */
async function extractMediaItems(data: NotionPage, isMcpFormat: boolean): Promise<MediaItem[]> {
  const mediaItems: MediaItem[] = [];
  const slug = isMcpFormat ? (data as McpNotionData).slug || data.id : data.id;

  try {
    if (isMcpFormat) {
      const mcpData = data as McpNotionData;
      
      // Procesar cover
      if (mcpData.media?.cover?.url) {
        try {
          const localPath = await downloadAndSaveImage(mcpData.media.cover.url, {
            caseStudySlug: slug,
            imageType: 'cover'
          });
          mediaItems.push({
            url: localPath,
            type: 'image',
            alt: 'Cover',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
          await logDebug('Cover procesado correctamente');
        } catch (error) {
          await logWarn('Error al procesar cover:', error);
        }
      }
      
      // Procesar avatar
      if (mcpData.media?.avatar?.url) {
        try {
          const localPath = await downloadAndSaveImage(mcpData.media.avatar.url, {
            caseStudySlug: slug,
            imageType: 'avatar'
          });
          mediaItems.push({
            url: localPath,
            type: 'image',
            alt: 'Avatar',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
          await logDebug('Avatar procesado correctamente');
        } catch (error) {
          await logWarn('Error al procesar avatar:', error);
        }
      }
      
      // Procesar hero image
      if (mcpData.media?.hero_image?.url) {
        try {
          const localPath = await downloadAndSaveImage(mcpData.media.hero_image.url, {
            caseStudySlug: slug,
            imageType: 'hero'
          });
          mediaItems.push({
            url: localPath,
            type: 'image',
            alt: 'Hero Image',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
          await logDebug('Hero image procesado correctamente');
        } catch (error) {
          await logWarn('Error al procesar hero image:', error);
        }
      }
      
      // Procesar imágenes adicionales
      if (mcpData.media?.images && Array.isArray(mcpData.media.images)) {
        for (let i = 0; i < mcpData.media.images.length; i++) {
          const image = mcpData.media.images[i];
          if (image?.url) {
            try {
              const localPath = await downloadAndSaveImage(image.url, {
                caseStudySlug: slug,
                imageType: 'gallery',
                originalFilename: `gallery-${i + 1}`
              });
              mediaItems.push({
                url: localPath,
                type: 'image',
                alt: `Image ${i + 1}`,
                width: 0,
                height: 0,
                order: mediaItems.length
              });
            } catch (error) {
              await logWarn(`Error al procesar imagen ${i + 1}:`, error);
            }
          }
        }
      }
      
      // Procesar videos
      if (mcpData.videos?.video_1) {
        try {
          mediaItems.push({
            url: mcpData.videos.video_1,
            type: 'video',
            alt: 'Video 1',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
        } catch (error) {
          await logWarn('Error al procesar video 1:', error);
        }
      }
      
      if (mcpData.videos?.video_2) {
        try {
          mediaItems.push({
            url: mcpData.videos.video_2,
            type: 'video',
            alt: 'Video 2',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
        } catch (error) {
          await logWarn('Error al procesar video 2:', error);
        }
      }
    } else {
      // Formato Notion nativo
      const slug = data.slug || data.id;
      
      // Procesar Cover
      await processNotionFiles(data.properties?.['Cover']?.files, 'Cover', mediaItems, slug);
      
      // Procesar Avatar
      await processNotionFiles(data.properties?.['Avatar']?.files, 'Avatar', mediaItems, slug);
      
      // Procesar Hero Image
      await processNotionFiles(data.properties?.['Hero Image']?.files, 'Hero Image', mediaItems, slug);
      
      // Procesar imágenes numeradas
      for (let i = 1; i <= 12; i++) {
        await processNotionFiles(data.properties?.[`Image ${i}`]?.files, `Image ${i}`, mediaItems, slug);
      }
      
      // Procesar videos
      const video1 = data.properties?.['Video 1']?.url;
      if (video1) {
        try {
          mediaItems.push({
            url: video1,
            type: 'video',
            alt: 'Video 1',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
        } catch (error) {
          await logWarn('Error al procesar video 1:', error);
        }
      }
      
      const video2 = data.properties?.['Video 2']?.url;
      if (video2) {
        try {
          mediaItems.push({
            url: video2,
            type: 'video',
            alt: 'Video 2',
            width: 0,
            height: 0,
            order: mediaItems.length
          });
        } catch (error) {
          await logWarn('Error al procesar video 2:', error);
        }
      }
    }
    
    await logDebug(`Total de elementos multimedia procesados: ${mediaItems.length}`);
    return mediaItems;
  } catch (error) {
    await logError('Error al extraer elementos multimedia:', error);
    return [];
  }
}

/**
 * Procesa archivos de Notion y los convierte en MediaItems
 * @param files Array de archivos de Notion
 * @param alt Texto alternativo para los archivos
 * @param mediaItems Array de MediaItems donde se agregarán los resultados
 */
async function processNotionFiles(files: any, alt: string, mediaItems: MediaItem[], caseStudySlug: string): Promise<void> {
  // Validar que files sea un array no nulo
  if (!files || !Array.isArray(files) || files.length === 0) {
    console.log(`No hay archivos para procesar en ${alt}`);
    return;
  }
  
  console.log(`Procesando ${files.length} archivos para ${alt}`);
  
  // Función para determinar si una URL es válida
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Función para determinar el tipo de archivo basado en la extensión o URL
  const determineFileType = (url: string): 'image' | 'video' => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const lowercaseUrl = url.toLowerCase();
    
    // Verificar si es un video basado en la extensión
    if (videoExtensions.some(ext => lowercaseUrl.endsWith(ext))) {
      return 'video';
    }
    
    // Verificar si es un video de Vimeo o YouTube
    if (lowercaseUrl.includes('vimeo.com') || lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) {
      return 'video';
    }
    
    // Por defecto, asumir que es una imagen
    return 'image';
  };
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Procesando archivo ${i + 1}/${files.length} para ${alt}:`, file ? 'Archivo válido' : 'Archivo inválido');
    
    if (!file) continue;
    
    // Extraer la URL del archivo según su tipo
    let fileUrl = '';
    let fileType: 'external' | 'notion' = 'notion';
    
    if (file.type === 'external' && file.external?.url) {
      fileUrl = file.external.url;
      fileType = 'external';
    } else if ((file.type === 'file' || file?.file) && file.file?.url) {
      fileUrl = file.file.url;
      fileType = 'notion';
    } else {
      console.error(`Formato de archivo desconocido para ${alt}:`, JSON.stringify(file));
      continue;
    }
    
    // Validar que la URL sea válida
    if (!fileUrl || !isValidUrl(fileUrl)) {
      console.error(`URL inválida para ${alt}:`, fileUrl);
      continue;
    }
    
    console.log(`Archivo ${fileType} encontrado para ${alt}:`, fileUrl);
    
    // Determinar si es imagen o video
    const mediaType = determineFileType(fileUrl);
    
    try {
      // Solo intentar descargar si es una imagen
      if (mediaType === 'image') {
        try {
          const localPath = await downloadAndSaveImage(fileUrl, {
            caseStudySlug,
            imageType: 'gallery',
            originalFilename: file.name || ''
          });
          
          mediaItems.push({
            url: localPath,
            type: mediaType,
            alt,
            width: 800,
            height: 600,
            order: mediaItems.length,
            displayMode: 'single'
          });
          console.log(`Archivo ${fileType} procesado correctamente para ${alt}`);
        } catch (error) {
          // Si falló la descarga, usar la URL original como fallback
          console.warn(`No se pudo descargar el archivo ${fileType} para ${alt}, usando URL original:`, fileUrl);
          mediaItems.push({
            url: fileUrl,
            type: mediaType,
            alt,
            width: 800,
            height: 600,
            order: mediaItems.length,
            displayMode: 'single'
          });
        }
      } else {
        // Para videos, usar la URL directamente sin intentar descargar
        mediaItems.push({
          url: fileUrl,
          type: mediaType,
          videoType: fileUrl.includes('vimeo.com') ? 'vimeo' : 'local',
          alt,
          width: 800,
          height: 600,
          order: mediaItems.length,
          displayMode: 'single'
        });
        console.log(`Video ${fileType} procesado para ${alt}`);
      }
    } catch (error) {
      console.error(`Error al procesar archivo ${fileType} para ${alt}:`, error instanceof Error ? error.message : String(error));
      
      // En caso de error, usar la URL original como fallback
      mediaItems.push({
        url: fileUrl,
        type: mediaType,
        alt,
        width: 800,
        height: 600,
        order: mediaItems.length,
        displayMode: 'single'
      });
    }
  }
  
  console.log(`Procesamiento completado para ${alt}: ${files.length} archivos procesados, ${mediaItems.length} elementos multimedia añadidos`);
}

/**
 * Extrae los campos básicos de un objeto Notion
 * @param data Datos de Notion
 * @param isMcpFormat Indica si los datos están en formato MCP
 * @returns Objeto con los campos básicos extraídos
 */
async function extractBasicFields(data: NotionPage, isMcpFormat: boolean): Promise<BasicFields> {
  try {
    // Extraer título/nombre de marca
    const title = isMcpFormat
      ? (data as McpNotionData).name || 'Sin título'
      : await extractRichTextField(data.properties?.['Brand Name']?.title, 'Sin título');
    
    // Extraer campos de texto
    const description = isMcpFormat
      ? (data as McpNotionData).description || ''
      : await extractRichTextField(data.properties?.['Description']?.rich_text);
      
    const tagline = isMcpFormat
      ? (data as McpNotionData).tagline || ''
      : await extractRichTextField(data.properties?.['Tagline']?.rich_text);
      
    const closingClaim = isMcpFormat
      ? (data as McpNotionData).closingClaim || ''
      : await extractRichTextField(data.properties?.['Closing Claim']?.rich_text);

    // Extraer el slug
    const slug = isMcpFormat
      ? (data as McpNotionData).slug || ''
      : await extractRichTextField(data.properties?.['Slug']?.rich_text);
    await logDebug(`Slug extraído: ${slug}`);

    // Extraer el website
    const website: string | undefined = isMcpFormat
      ? (data as McpNotionData).website || undefined
      : data.properties?.['Website']?.url || undefined;

    // Extraer los servicios/tags
    let tags: string[] = [];
    if (isMcpFormat) {
      tags = (data as McpNotionData).services || [];
    } else {
      const servicesField = data.properties?.['Services']?.multi_select || [];
      tags = servicesField.map((service: any) => service?.name || '').filter(Boolean);
    }
    await logDebug(`Tags extraídos: ${tags.join(', ')}`);

    return {
      title,
      description,
      tagline,
      closingClaim,
      slug,
      website,
      tags
    };
  } catch (error) {
    await logError('Error al extraer campos básicos:', error);
    // Devolver valores por defecto en caso de error
    return {
      title: 'Sin título',
      description: '',
      tagline: '',
      closingClaim: '',
      slug: '',
      website: undefined,
      tags: []
    };
  }
}

/**
 * Transforma un objeto de Notion a nuestro formato CaseStudy
 * Incluye validación de datos, manejo de errores y soporte para diferentes formatos
 * @param data Datos de Notion
 * @returns Objeto CaseStudy
 */
export async function transformNotionToCaseStudy(data: NotionPage): Promise<CaseStudy> {
  try {
    // Validación inicial de datos
    if (!data) {
      throw new Error('No se proporcionaron datos de Notion');
    }
    
    if (!data.id) {
      throw new Error('Datos de Notion sin ID válido');
    }
    
    await logDebug(`Transformando datos de Notion - ID: ${data.id}`);
    
    // Detectar formato de datos (MCP-Notion o Notion nativo)
    const isMcpFormat = data.name !== undefined;
    await logDebug(`Formato detectado: ${isMcpFormat ? 'MCP-Notion' : 'Notion nativo'}`);

    // Extraer campos básicos
    const { title, description, tagline, closingClaim, slug, website, tags } = await extractBasicFields(data, isMcpFormat);
    
    // Extraer elementos multimedia
    const mediaItems = await extractMediaItems(data, isMcpFormat);

  // Generar el slug si no existe
  const finalSlug = slug || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'sin-titulo');
  
  // Validar y construir el objeto CaseStudy
  const study: CaseStudy = {
    id: data.id,
    title,
    client: title, // Igual que el título
    description,
    tagline,
    closingClaim,
    mediaItems,
    tags,
    order: 0,
    slug: finalSlug,
    website,
    status: 'published', // Por defecto publicado
    featured: false, // Por defecto no destacado
    featuredOrder: 0,
    createdAt: data.created_time || new Date().toISOString(),
    updatedAt: data.last_edited_time || new Date().toISOString(),
    synced: true
  };

  // Registrar información en modo desarrollo
  await logDebug(`Case Study transformado - ID: ${study.id}, Título: ${study.title}, Slug: ${study.slug}`);
  await logDebug(`Número de imágenes: ${study.mediaItems?.length || 0}`);
  await logDebug(`Tags/Servicios: ${study.tags?.join(', ') || 'ninguno'}`);
  
  // Información detallada para depuración en casos especiales
  if (study.slug === 'build' && process.env.NODE_ENV !== 'production') {
    await logDebug('DEPURACIÓN CASE STUDY BUILD: ' + JSON.stringify(study, null, 2));
  }
  
  return study;
  } catch (error) {
    await logError(`Error al transformar datos de Notion a CaseStudy:`, error);
    
    // Devolvemos un objeto mínimo válido para evitar errores en cascada
    // Aseguramos que el ID sea válido incluso en caso de error
    const errorId = data?.id || `error-${Date.now()}`;
    
    return {
      id: errorId,
      title: 'Error en transformación',
      client: 'Error',
      description: '',
      tagline: '',
      closingClaim: '',
      mediaItems: [],
      tags: [],
      order: 0,
      slug: `error-${errorId.substring(0, 8)}`,
      status: 'draft',
      featured: false,
      featuredOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false // Marcamos como no sincronizado para que se intente sincronizar en el futuro
    };
  }
}

/**
 * Valida si una cadena es una URL válida
 * @param url URL a validar
 * @returns true si es una URL válida, false en caso contrario
 */
async function validateUrl(url: string | null | undefined): Promise<boolean> {
  try {
    // Verificar formato básico
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return false;
    }
    
    // Manejar URLs de Notion que pueden tener formato especial
    const trimmedUrl = url.trim();
    
    // Verificar si es una URL de base64 (imágenes incrustadas)
    if (trimmedUrl.startsWith('data:image/') && trimmedUrl.includes('base64')) {
      return true;
    }
    
    // Verificar si es una URL relativa válida
    if (trimmedUrl.startsWith('/') && !trimmedUrl.includes('://')) {
      // Las URLs relativas son válidas para nuestro caso de uso
      return true;
    }
    
    // Intentar crear un objeto URL (valida formato)
    let urlObj: URL;
    try {
      urlObj = new URL(trimmedUrl);
    } catch {
      // Si falla, intentar añadir https:// por si es una URL sin protocolo
      if (!trimmedUrl.includes('://')) {
        try {
          urlObj = new URL(`https://${trimmedUrl}`);
        } catch {
          await logDebug(`URL inválida incluso con protocolo añadido: ${trimmedUrl}`);
          return false;
        }
      } else {
        await logDebug(`URL con formato inválido: ${trimmedUrl}`);
        return false;
      }
    }
    
    // Verificar que sea http o https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      // Permitir protocolos seguros adicionales como data: para imágenes
      if (urlObj.protocol === 'data:' && urlObj.href.includes('image/')) {
        return true;
      }
      await logDebug(`Protocolo no permitido: ${urlObj.protocol}`);
      return false;
    }
    
    // Verificar que tenga un dominio válido
    if (!urlObj.hostname || urlObj.hostname.length < 2) {
      await logDebug(`Hostname inválido: ${urlObj.hostname}`);
      return false;
    }
    
    // Verificar dominios conocidos de Notion
    const notionDomains = [
      'notion.so',
      'notion.site',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ];
    
    // Permitir siempre URLs de dominios confiables
    for (const domain of notionDomains) {
      if (urlObj.hostname.endsWith(domain)) {
        return true;
      }
    }
    
    // Consideramos válida la URL si pasa todas las verificaciones
    return true;
  } catch (error) {
    // Si hay un error al parsear la URL, no es válida
    await logDebug(`Error al validar URL: ${url}`, error);
    return false;
  }
}

/**
 * Tipo para las propiedades de Notion
 */
type NotionPropertyValue = {
  type: string;
  [key: string]: any;
};

/**
 * Tipo para el objeto de propiedades de Notion
 */
type NotionProperties = Record<string, NotionPropertyValue>;

/**
 * Tipo para el resultado de la transformación
 */
type NotionTransformResult = {
  properties: NotionProperties;
};

/**
 * Transforma un objeto CaseStudy a formato compatible con la API de Notion
 * Incluye validación de datos, manejo de errores y optimizaciones de rendimiento
 * @param study Objeto CaseStudy parcial o completo a transformar
 * @returns Objeto con propiedades en formato Notion
 */
export async function transformCaseStudyToNotion(study: Partial<CaseStudy>): Promise<NotionTransformResult> {
  try {
    // Validación inicial de datos
    if (!study || typeof study !== 'object') {
      throw new Error('No se proporcionó un objeto CaseStudy válido');
    }

    // Verificamos que tengamos al menos un título
    if (!study.title || typeof study.title !== 'string' || study.title.trim() === '') {
      await logWarn('Transformando CaseStudy sin título o con título inválido');
      // Asignamos un título por defecto para evitar errores en Notion
      study.title = study.title || 'Case Study sin título';
    }

    // Intentamos obtener del caché si existe y es válido (solo si no estamos en desarrollo)
    const shouldUseCache = study.id && 
                          process.env.NODE_ENV !== 'development';
    
    if (shouldUseCache) {
      try {
        const cacheKey = `notion_transform_${study.id}`;
        const cachedData = await getCacheItem<NotionTransformResult>(cacheKey);
        
        // Verificamos que el caché sea válido y completo
        if (cachedData && 
            cachedData.properties && 
            Object.keys(cachedData.properties).length > 0 &&
            cachedData.properties['Brand Name']) {
          
          await logDebug(`Transformación recuperada de caché para ${study.id}`);
          return cachedData;
        }
      } catch (cacheError) {
        // Si hay un error al leer el caché, lo ignoramos y continuamos con la transformación
        await logDebug(`Error al recuperar transformación de caché: ${cacheError instanceof Error ? cacheError.message : 'Error desconocido'}`);
      }
    }

    await logInfo(`Transformando CaseStudy a formato Notion: ${study.id || 'nuevo'}`);

    // Inicializamos las propiedades
    const properties: NotionProperties = {};
    
    // Añadimos el título (siempre requerido por Notion)
    properties['Brand Name'] = {
      type: 'title',
      title: [{
        type: 'text',
        text: { content: study.title.trim() }
      }]
    };

    // Procesamos todos los campos en paralelo para mejorar rendimiento
    await Promise.all([
      // Procesamos campos de texto enriquecido con validación
      addRichTextProperties(properties, study),
      
      // Procesamos tags/servicios
      addTagsProperty(properties, study),
      
      // Procesamos URL del sitio web
      addWebsiteProperty(properties, study),
      
      // Procesamos el orden
      addOrderProperty(properties, study)
    ]);
    
    // Procesamos elementos multimedia (esto lo hacemos secuencialmente porque puede ser intensivo)
    await addMediaProperties(properties, study);

    // Verificamos que las propiedades mínimas estén presentes
    if (!properties['Brand Name'] || !properties['Brand Name']['title']) {
      await logWarn('Propiedades de Notion incompletas, añadiendo título mínimo');
      properties['Brand Name'] = {
        type: 'title',
        title: [{
          type: 'text',
          text: { content: study.title?.trim() || 'Case Study sin título' }
        }]
      };
    }

    // Creamos el objeto de resultado
    const result: NotionTransformResult = { properties };

    // Guardamos en caché si tenemos un ID
    if (study.id) {
      try {
        const cacheKey = `notion_transform_${study.id}`;
        await setCacheItem(cacheKey, result);
      } catch (cacheError) {
        await logWarn(`Error al guardar transformación en caché: ${cacheError instanceof Error ? cacheError.message : 'Error desconocido'}`);
      }
    }

    return result;
  } catch (error) {
    await logError('Error al transformar CaseStudy a formato Notion:', error);
    
    // Devolvemos un objeto mínimo válido para evitar errores en cascada
    return {
      properties: {
        'Brand Name': {
          type: 'title',
          title: [{
            type: 'text',
            text: { content: study?.title?.trim() || 'Error en transformación' }
          }]
        }
      }
    };
  }
}

/**
 * Añade propiedades de texto enriquecido al objeto de propiedades
 */
async function addRichTextProperties(properties: NotionProperties, study: Partial<CaseStudy>): Promise<void> {
  try {
    // Definimos los campos de texto enriquecido con sus validaciones
    const richTextFields = [
      { 
        key: 'Description', 
        value: study.description,
        validate: (val: any) => typeof val === 'string' && val.trim() !== ''
      },
      { 
        key: 'Tagline', 
        value: study.tagline,
        validate: (val: any) => typeof val === 'string' && val.trim() !== ''
      },
      { 
        key: 'Closing Claim', 
        value: study.closingClaim,
        validate: (val: any) => typeof val === 'string' && val.trim() !== ''
      },
      { 
        key: 'Slug', 
        value: study.slug,
        validate: (val: any) => typeof val === 'string' && val.trim() !== ''
      }
    ];

    // Añadimos solo los campos que tienen valor y pasan la validación
    for (const field of richTextFields) {
      if (field.value && field.validate(field.value)) {
        properties[field.key] = {
          type: 'rich_text',
          rich_text: [{
            type: 'text',
            text: { content: field.value.trim() }
          }]
        };
      }
    }
  } catch (error) {
    await logWarn('Error al procesar campos de texto enriquecido:', error);
  }
}

/**
 * Añade la propiedad de tags/servicios al objeto de propiedades
 */
async function addTagsProperty(properties: NotionProperties, study: Partial<CaseStudy>): Promise<void> {
  try {
    // Validamos que tags sea un array válido
    if (!study.tags || !Array.isArray(study.tags)) {
      return;
    }
    
    // Filtramos valores nulos, indefinidos o vacíos
    const validTags = study.tags
      .filter(tag => tag && typeof tag === 'string' && tag.trim() !== '')
      .map(tag => tag.trim());
    
    if (validTags.length > 0) {
      properties['Services'] = {
        type: 'multi_select',
        multi_select: validTags.map(tag => ({ name: tag }))
      };
    }
  } catch (error) {
    await logWarn('Error al procesar tags/servicios:', error);
  }
}

/**
 * Añade la propiedad de sitio web al objeto de propiedades
 */
async function addWebsiteProperty(properties: NotionProperties, study: Partial<CaseStudy>): Promise<void> {
  try {
    // Validamos que website sea una cadena no vacía
    if (!study.website || typeof study.website !== 'string' || study.website.trim() === '') {
      return;
    }
    
    // Verificamos que la URL sea válida
    if (await validateUrl(study.website)) {
      properties['Website'] = {
        type: 'url',
        url: study.website.trim()
      };
    } else {
      await logWarn(`URL de sitio web inválida: ${study.website}`);
    }
  } catch (error) {
    await logWarn('Error al procesar URL del sitio web:', error);
  }
}

/**
 * Añade la propiedad de orden al objeto de propiedades
 */
async function addOrderProperty(properties: NotionProperties, study: Partial<CaseStudy>): Promise<void> {
  try {
    // Validamos que order sea un número válido
    if (study.order === undefined || study.order === null) {
      return;
    }
    
    const orderNumber = Number(study.order);
    if (!isNaN(orderNumber)) {
      properties['Order'] = {
        type: 'number',
        number: orderNumber
      };
    } else {
      await logWarn(`Valor de orden inválido: ${study.order}`);
    }
  } catch (error) {
    await logWarn('Error al procesar orden:', error);
  }
}

/**
 * Añade las propiedades de elementos multimedia al objeto de propiedades
 */
async function addMediaProperties(properties: NotionProperties, study: Partial<CaseStudy>): Promise<void> {
  try {
    // Validamos que mediaItems sea un array válido
    if (!study.mediaItems || !Array.isArray(study.mediaItems) || study.mediaItems.length === 0) {
      return;
    }
    
    await logDebug(`Procesando ${study.mediaItems.length} elementos multimedia`);
    
    // Filtrar elementos válidos con validación estricta
    const validMediaItems = study.mediaItems.filter(item => 
      item && 
      item.url && 
      typeof item.url === 'string' && 
      item.url.trim() !== '' &&
      item.type && 
      typeof item.type === 'string');
    
    if (validMediaItems.length === 0) {
      await logWarn('No se encontraron elementos multimedia válidos');
      return;
    }
    
    // Procesar imágenes principales (cover, avatar, hero)
    await processMainImages(properties, validMediaItems);
    
    // Procesar imágenes adicionales
    await processAdditionalImages(properties, validMediaItems);
    
    // Procesar vídeos
    await processVideos(properties, validMediaItems);
  } catch (error) {
    await logWarn('Error al procesar elementos multimedia:', error);
  }
}

/**
 * Procesa las imágenes principales (cover, avatar, hero)
 */
async function processMainImages(properties: NotionProperties, mediaItems: MediaItem[]): Promise<void> {
  try {
    // Encontrar imágenes principales por su alt text
    const coverItem = mediaItems.find(item => 
      item.type === 'image' && item.alt?.toLowerCase()?.trim() === 'cover');
      
    const avatarItem = mediaItems.find(item => 
      item.type === 'image' && item.alt?.toLowerCase()?.trim() === 'avatar');
      
    const heroItem = mediaItems.find(item => 
      item.type === 'image' && item.alt?.toLowerCase()?.trim() === 'hero image');
    
    // Añadir imágenes principales si existen y son válidas
    if (coverItem && coverItem.url && await validateUrl(coverItem.url)) {
      properties['Cover'] = {
        type: 'files',
        files: [{ type: 'external', name: 'cover', external: { url: coverItem.url.trim() } }]
      };
    }
    
    if (avatarItem && avatarItem.url && await validateUrl(avatarItem.url)) {
      properties['Avatar'] = {
        type: 'files',
        files: [{ type: 'external', name: 'avatar', external: { url: avatarItem.url.trim() } }]
      };
    }
    
    if (heroItem && heroItem.url && await validateUrl(heroItem.url)) {
      properties['Hero Image'] = {
        type: 'files',
        files: [{ type: 'external', name: 'hero', external: { url: heroItem.url.trim() } }]
      };
    }
  } catch (error) {
    await logWarn('Error al procesar imágenes principales:', error);
  }
}

/**
 * Procesa las imágenes adicionales
 */
async function processAdditionalImages(properties: NotionProperties, mediaItems: MediaItem[]): Promise<void> {
  try {
    // Filtrar imágenes adicionales (que no sean cover, avatar o hero)
    const additionalImages = mediaItems.filter(item => 
      item.type === 'image' && 
      item.alt !== undefined &&
      !['cover', 'avatar', 'hero image'].includes(item.alt.toLowerCase().trim()));
    
    // Limitar a un máximo de 12 imágenes adicionales (límite de Notion)
    const maxImages = Math.min(additionalImages.length, 12);
    
    // Asignar imágenes adicionales a campos Image 1, Image 2, etc.
    for (let i = 0; i < maxImages; i++) {
      const imageItem = additionalImages[i];
      if (imageItem && imageItem.url && await validateUrl(imageItem.url)) {
        const fieldName = `Image ${i + 1}`;
        properties[fieldName] = {
          type: 'files',
          files: [{ 
            type: 'external', 
            name: `image_${i + 1}`, 
            external: { url: imageItem.url.trim() } 
          }]
        };
      }
    }
  } catch (error) {
    await logWarn('Error al procesar imágenes adicionales:', error);
  }
}

/**
 * Procesa los vídeos
 */
async function processVideos(properties: NotionProperties, mediaItems: MediaItem[]): Promise<void> {
  try {
    // Filtrar elementos de tipo video
    const videos = mediaItems.filter(item => item.type === 'video');
    
    // Procesar hasta 2 vídeos (límite de Notion)
    if (videos.length > 0 && videos[0]?.url && await validateUrl(videos[0].url)) {
      properties['Video 1'] = {
        type: 'url',
        url: videos[0].url.trim()
      };
    }
    
    if (videos.length > 1 && videos[1]?.url && await validateUrl(videos[1].url)) {
      properties['Video 2'] = {
        type: 'url',
        url: videos[1].url.trim()
      };
    }
  } catch (error) {
    await logWarn('Error al procesar vídeos:', error);
  }
}
