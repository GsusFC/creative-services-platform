import { Client } from '@notionhq/client';
import type { DatabaseObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

// Cliente de Notion para la API oficial
const notion = new Client({
  auth: process.env.NOTION_API_KEY || '',
});

const databaseId = process.env.NOTION_DATABASE_ID || '';

/**
 * Verifica la conexión con Notion
 */
export async function testNotionConnection(): Promise<{
  connected: boolean;
  database?: { id: string; name: string };
  error?: string;
}> {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return {
        connected: false,
        error: 'Faltan las credenciales de Notion en las variables de entorno',
      };
    }

    const response = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    const dbName = 'title' in response && Array.isArray(response.title) && response.title.length > 0 ? 
                 response.title[0]?.plain_text || 'Base de datos de Notion' : 
                 'Base de datos de Notion';
    
    return {
      connected: true,
      database: {
        id: response.id,
        name: dbName
      }
    };
  } catch (error) {
    console.error('Error connecting to Notion:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Interfaces para los datos de Notion
 */
interface NotionMedia {
  type: string;
  url: string;
  videoType?: string | null;
  thumbnailUrl?: string | null;
  alt?: string;
  width: number;
  height: number;
  order?: number;
  displayMode?: string;
}

interface NotionCaseStudy {
  id: string;
  title: string;
  client: string;
  slug: string;
  description: string;
  description2: string;
  tags: string;
  status: string;
  featured: boolean;
  featuredOrder: number;
  order: number;
  mediaItems: NotionMedia[];
}

/**
 * Extrae todos los case studies de Notion y los almacena en Supabase
 */
export async function syncNotionDataToSupabase(): Promise<{
  success: boolean;
  added: number;
  updated: number;
  errors: string[];
}> {
  const result = {
    success: false,
    added: 0,
    updated: 0,
    errors: [] as string[]
  };

  try {
    // 1. Obtener los datos de Notion
    const notionRecords = await fetchNotionCaseStudies();
    
    // 2. Procesar cada registro
    for (const record of notionRecords) {
      try {
        // Buscar si ya existe el registro en Supabase (por slug)
        const { data: existingRecord } = await supabase
          .from('case_studies')
          .select('id, slug')
          .eq('slug', record.slug)
          .maybeSingle();
        
        if (existingRecord) {
          // Actualizar registro existente
          await supabase
            .from('case_studies')
            .update({
              title: record.title,
              slug: record.slug,
              client: record.client,
              description: record.description,
              description2: record.description2,
              tags: record.tags,
              status: record.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingRecord.id);
          
          // Si tiene media items, procesarlos también
          if (record.mediaItems && record.mediaItems.length > 0) {
            await syncMediaItems(record.mediaItems, existingRecord.id);
          }
          
          result.updated++;
        } else {
          // Crear nuevo registro
          const { data: newRecord, error } = await supabase
            .from('case_studies')
            .insert({
              title: record.title,
              slug: record.slug,
              client: record.client,
              description: record.description,
              description2: record.description2,
              tags: record.tags,
              order: record.order || 0,
              status: record.status || 'draft',
              featured: record.featured || false,
              featured_order: record.featuredOrder || 999,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // Si tiene media items, procesarlos también
          if (record.mediaItems && record.mediaItems.length > 0 && newRecord) {
            await syncMediaItems(record.mediaItems, newRecord.id);
          }
          
          result.added++;
        }
      } catch (error) {
        const errorMessage = `Error procesando registro de Notion ${record.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMessage);
        result.errors.push(errorMessage);
      }
    }
    
    // 3. Registrar actividad de sincronización
    await logSyncActivity(result.added, result.updated, result.errors.length);
    
    result.success = true;
    return result;
  } catch (error) {
    const errorMessage = `Error en la sincronización: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    result.errors.push(errorMessage);
    return result;
  }
}

/**
 * Obtiene todos los case studies de Notion
 */
async function fetchNotionCaseStudies(): Promise<NotionCaseStudy[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      // Opcionalmente puedes añadir filtros aquí
    });
    
    // Filtramos solo las páginas, no las bases de datos
    return response.results
      .filter((item): item is PageObjectResponse => 'properties' in item)
      .map(page => mapNotionToCaseStudy(page));
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    throw error;
  }
}

/**
 * Convierte un registro de Notion al formato de nuestros case studies
 */
function mapNotionToCaseStudy(notionPage: PageObjectResponse): NotionCaseStudy {
  // Esta es una implementación preliminar que necesitará ajustarse
  // a la estructura exacta de tu base de datos Notion
  const properties = notionPage.properties;
  
  // Tipo para propiedades de Notion
  type NotionProperty = {
    type: string;
    [key: string]: unknown; // Para otros campos específicos del tipo
  };
  
  // Extraer valores con validaciones de tipo
  const getTextValue = (prop: NotionProperty | undefined, propertyName: string): string => {
    if (!prop) return '';
    
    if (propertyName === 'title' && prop.type === 'title' && Array.isArray(prop.title) && prop.title.length > 0) {
      return prop.title[0]?.plain_text || '';
    }
    
    if (prop.type === 'rich_text' && Array.isArray(prop.rich_text) && prop.rich_text.length > 0) {
      return prop.rich_text[0]?.plain_text || '';
    }
    
    return '';
  };
  
  const title = getTextValue(properties.Title, 'title');
  const client = getTextValue(properties.Client, 'rich_text');
  const slug = getTextValue(properties.Slug, 'rich_text') || 
              title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const description = getTextValue(properties.Description, 'rich_text');
  const description2 = getTextValue(properties.LongDescription, 'rich_text');
  
  // Estado, destacado y orden
  const status = properties.Status?.type === 'select' && properties.Status.select?.name
                ? properties.Status.select.name.toLowerCase()
                : 'draft';
                
  const featured = properties.Featured?.type === 'checkbox' 
                 ? Boolean(properties.Featured.checkbox)
                 : false;
                 
  const featuredOrder = properties.FeaturedOrder?.type === 'number' 
                      ? Number(properties.FeaturedOrder.number) || 999
                      : 999;
                      
  const order = properties.Order?.type === 'number'
              ? Number(properties.Order.number) || 0
              : 0;
  
  // Parsear los tags desde una propiedad de texto o multi-select
  let tags = '';
  if (properties.Tags?.type === 'multi_select' && Array.isArray(properties.Tags.multi_select)) {
    tags = properties.Tags.multi_select.map(tag => tag.name).join(',');
  } else if (properties.Tags?.type === 'rich_text' && 
            Array.isArray(properties.Tags.rich_text) && 
            properties.Tags.rich_text.length > 0) {
    tags = properties.Tags.rich_text[0]?.plain_text || '';
  }
  
  // Manejar las imágenes/media
  const mediaItems: NotionMedia[] = [];
  
  if (properties.Images?.type === 'files' && Array.isArray(properties.Images.files)) {
    properties.Images.files.forEach((file, index) => {
      let fileUrl = '';
      
      if ('external' in file && file.external?.url) {
        fileUrl = file.external.url;
      } else if ('file' in file && file.file?.url) {
        fileUrl = file.file.url;
      }
      
      if (fileUrl) {
        mediaItems.push({
          type: 'image',
          url: fileUrl,
          alt: `Imagen ${index + 1} de ${title}`,
          width: 1200, // valores por defecto que luego se ajustarán
          height: 800,
          order: index,
          displayMode: 'single'
        });
      }
    });
  }
  
  return {
    id: notionPage.id,
    title,
    client,
    slug,
    description,
    description2,
    tags,
    status,
    featured,
    featuredOrder,
    order,
    mediaItems
  };
}

/**
 * Sincroniza los media items de un case study
 */
async function syncMediaItems(mediaItems: NotionMedia[], caseStudyId: string): Promise<void> {
  // 1. Eliminar media items actuales
  await supabase
    .from('media_items')
    .delete()
    .eq('case_study_id', caseStudyId);
  
  // 2. Insertar los nuevos
  for (const item of mediaItems) {
    await supabase
      .from('media_items')
      .insert({
        type: item.type,
        url: item.url,
        video_type: item.videoType || null,
        thumbnail_url: item.thumbnailUrl || null,
        alt: item.alt || '',
        width: item.width,
        height: item.height,
        order: item.order || 0,
        display_mode: item.displayMode || 'single',
        case_study_id: caseStudyId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  }
}

/**
 * Registra actividad de sincronización
 */
async function logSyncActivity(added: number, updated: number, errors: number): Promise<void> {
  await supabase
    .from('notion_sync_log')
    .insert({
      operation: 'sync_all',
      entity_type: 'case_study',
      entity_id: 'batch',
      status: errors > 0 ? 'partial' : 'success',
      error_message: errors > 0 ? `${errors} errores encontrados` : null,
      metadata: {
        added,
        updated,
        errors
      },
      created_at: new Date().toISOString()
    });
}

/**
 * Obtiene el historial de sincronizaciones
 */
export async function getSyncHistory() {
  const { data, error } = await supabase
    .from('notion_sync_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching sync history:', error);
    return [];
  }
  
  return data || [];
}
