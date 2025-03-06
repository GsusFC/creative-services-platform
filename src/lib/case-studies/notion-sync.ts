import { Client, isFullDatabase } from '@notionhq/client';
import type { DatabaseObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { createCaseStudy, updateCaseStudy, deleteCaseStudy } from './service';
import { CaseStudy, MediaItem } from '@/types/case-study';

// Inicializar el cliente de Notion (real)
const notion = new Client({
  auth: process.env.NOTION_API_KEY || ''
});

const databaseId = process.env.NOTION_DATABASE_ID || '';

/**
 * Convierte un registro de Notion a formato CaseStudy
 */
function mapNotionToCaseStudy(notionPage: PageObjectResponse): Omit<CaseStudy, 'id'> {
  // Esta es una implementación preliminar que necesitará ajustarse
  // a la estructura exacta de tu base de datos Notion
  const properties = notionPage.properties;
  
  // Mapeo de propiedades de Notion a nuestro modelo CaseStudy
  const title = properties.Title?.title?.[0]?.plain_text || '';
  const client = properties.Client?.rich_text?.[0]?.plain_text || '';
  const slug = properties.Slug?.rich_text?.[0]?.plain_text || 
               title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const description = properties.Description?.rich_text?.[0]?.plain_text || '';
  const description2 = properties.LongDescription?.rich_text?.[0]?.plain_text || '';
  const status = properties.Status?.select?.name?.toLowerCase() || 'draft';
  const featured = properties.Featured?.checkbox || false;
  const featuredOrder = properties.FeaturedOrder?.number || 999;
  const order = properties.Order?.number || 0;
  
  // Parsear los tags desde una propiedad de texto o multi-select
  let tagsString = '';
  if (properties.Tags?.multi_select) {
    tagsString = properties.Tags.multi_select.map((tag: { name: string }) => tag.name).join(',');
  } else if (properties.Tags?.rich_text?.[0]?.plain_text) {
    tagsString = properties.Tags.rich_text[0].plain_text;
  }
  
  // Manejar las imágenes/media (esto dependerá de cómo almacenes media en Notion)
  const mediaItems: MediaItem[] = [];
  // Aquí implementarías la lógica para extraer medios de Notion
  // Por ejemplo, si tienes una propiedad de tipo files o una relación a otra tabla
  
  return {
    title,
    client,
    slug,
    description,
    description2,
    tags: tagsString,
    status: status as 'draft' | 'published',
    featured,
    featuredOrder,
    order,
    mediaItems
  };
}

/**
 * Sincroniza todos los case studies desde Notion
 */
export async function syncCaseStudiesFromNotion(): Promise<{
  added: number;
  updated: number;
  errors: string[];
}> {
  const result = {
    added: 0,
    updated: 0,
    errors: [] as string[]
  };
  
  try {
    // Obtener todos los registros de la base de datos de Notion
    const response = await notion.databases.query({
      database_id: databaseId,
      // Opcionalmente puedes añadir filtros aquí
    });
    
    // Procesar cada página de Notion
    for (const page of response.results) {
      try {
        const caseStudyData = mapNotionToCaseStudy(page);
        const notionId = page.id;
        
        // Buscar si ya existe (por slug o por alguna propiedad de mapeo)
        // Aquí necesitarías implementar la lógica para determinar si el case study
        // ya existe en tu base de datos local
        const exists = false; // Implementar esta lógica
        
        if (exists) {
          // Actualizar case study existente
          // await updateCaseStudy(existingId, caseStudyData);
          result.updated++;
        } else {
          // Crear nuevo case study
          await createCaseStudy(caseStudyData);
          result.added++;
        }
      } catch (error) {
        console.error(`Error processing Notion page ${page.id}:`, error);
        result.errors.push(`Error en página ${page.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error syncing from Notion:', error);
    result.errors.push(`Error general: ${error instanceof Error ? error.message : String(error)}`);
    return result;
  }
}

/**
 * Obtiene la estructura de la base de datos de Notion para mapping
 */
export async function getNotionDatabaseSchema() {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    // Extraer información sobre las propiedades/columnas
    const properties = Object.entries(response.properties).map(([name, property]) => ({
      name,
      type: (property as Record<string, any>).type,
      // Añadir otras propiedades relevantes según sea necesario
    }));
    
    return {
      id: response.id,
      title: response.title[0]?.plain_text || 'Notion Database',
      properties
    };
  } catch (error) {
    console.error('Error fetching Notion database schema:', error);
    throw error;
  }
}

/**
 * Verifica la conexión con Notion
 */
export async function testNotionConnection(): Promise<{
  connected: boolean;
  database?: { id: string; name: string };
  error?: string;
}> {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    return {
      connected: true,
      database: {
        id: response.id,
        name: response.title[0]?.plain_text || 'Notion Database'
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
