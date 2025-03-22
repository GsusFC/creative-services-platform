'use server'

import { CaseStudy } from '@/types/case-study';

const MCP_NOTION_URL = 'http://localhost:3004';
const DATABASE_ID = process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'];

if (!DATABASE_ID) {
  throw new Error('NEXT_PUBLIC_NOTION_DATABASE_ID no está configurada');
}

async function fetchMCP(endpoint: string, options: RequestInit = {}) {
  console.log(`Llamando a MCP-Notion: ${endpoint}`, {
    url: `${MCP_NOTION_URL}${endpoint}`,
    options
  });

  const response = await fetch(`${MCP_NOTION_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const responseText = await response.text();
  console.log(`Respuesta de MCP-Notion: ${responseText}`);

  if (!response.ok) {
    throw new Error(`Error en MCP-Notion: ${responseText || 'Error desconocido'}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Error al parsear respuesta de MCP-Notion: ${responseText}`);
  }
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  console.log('Obteniendo case studies de Notion...');
  
  const response = await fetchMCP('/api/query_database', {
    method: 'POST',
    body: JSON.stringify({
      database_id: DATABASE_ID,
      page_size: 100,
      filter: {
        property: 'Status',
        select: {
          equals: 'Listo'
        }
      }
    })
  });

  console.log('Respuesta completa:', JSON.stringify(response, null, 2));

  // La respuesta de MCP-Notion siempre tiene una propiedad 'results'
  if (!response.results || !Array.isArray(response.results)) {
    throw new Error(`Formato de datos inesperado: ${JSON.stringify(response)}`);
  }
  
  const data = response.results;
  console.log('Datos a procesar:', JSON.stringify(data, null, 2));

  return data.map((item: any) => {
    console.log('Procesando item:', JSON.stringify(item, null, 2));
    return transformNotionToCaseStudy(item);
  });
}

export async function getCaseStudy(id: string): Promise<CaseStudy> {
  const data = await fetchMCP(`/api/get_page/${id}`);
  return transformNotionToCaseStudy(data);
}

export async function createCaseStudy(input: Partial<CaseStudy>): Promise<CaseStudy> {
  const notionData = transformCaseStudyToNotion(input);
  const data = await fetchMCP('/api/create_page', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: DATABASE_ID },
      properties: notionData
    })
  });
  return transformNotionToCaseStudy(data);
}

export async function updateCaseStudy({ id, ...data }: Partial<CaseStudy> & { id: string }): Promise<CaseStudy> {
  const notionData = transformCaseStudyToNotion(data);
  const response = await fetchMCP(`/api/update_page/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: notionData
    })
  });
  return transformNotionToCaseStudy(response);
}

export async function deleteCaseStudy(id: string): Promise<void> {
  await fetchMCP(`/api/archive_page/${id}`, {
    method: 'POST'
  });
}

// Funciones auxiliares para transformar datos
function transformNotionToCaseStudy(data: any): CaseStudy {
  console.log('Transformando datos de Notion:', JSON.stringify(data, null, 2));
  
  if (!data || !data.id) {
    throw new Error('Datos de Notion inválidos');
  }

  const study: CaseStudy = {
    id: data.id,
    title: data.name || '',
    client: data.name || '',
    description: data.description || '',
    tagline: data.tagline || '',
    closingClaim: data.closing_claim || '',
    mediaItems: data.media?.images?.map((img: any) => ({
      url: img.url,
      type: 'image',
      alt: img.alt || '',
    })) || [],
    tags: Array.isArray(data.services) ? data.services : [],
    order: 0, // Por ahora no tenemos este campo
    slug: data.slug || '',
    website: data.website || undefined,
    status: 'published', // Por defecto publicado
    featured: false, // Por defecto no destacado
    featuredOrder: 0,
    createdAt: new Date().toISOString(), // Por ahora no tenemos estos campos
    updatedAt: new Date().toISOString(),
  };

  console.log('Case Study transformado:', JSON.stringify(study, null, 2));
  return study;
}

function transformCaseStudyToNotion(study: Partial<CaseStudy>): any {
  return {
    'Brand Name': {
      title: [{
        type: 'text',
        text: { content: study.title || '' }
      }]
    },
    'Description': {
      rich_text: [{
        type: 'text',
        text: { content: study.description || '' }
      }]
    },
    'Tagline': {
      rich_text: [{
        type: 'text',
        text: { content: study.tagline || '' }
      }]
    },
    'Closing Claim': {
      rich_text: [{
        type: 'text',
        text: { content: study.closingClaim || '' }
      }]
    },
    'Slug': {
      rich_text: [{
        type: 'text',
        text: { content: study.slug || '' }
      }]
    },
    'Services': {
      multi_select: (study.tags || []).map(tag => ({ name: tag }))
    },
    'Order': {
      number: study.order || 0
    },
    'Website': study.website ? {
      url: study.website
    } : null
  };
}
