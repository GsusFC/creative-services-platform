'use server'

import type { PageObjectResponse, CreatePageParameters, UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { cache } from 'react';
import { CaseStudy, CreateCaseStudyInput, UpdateCaseStudyInput } from './types';
import { transformNotionToCaseStudy, transformCaseStudyToNotion } from './transformer';
import { notion } from './notion-client';

const NOTION_DATABASE_ID = process.env['NOTION_DATABASE_ID'];

if (!NOTION_DATABASE_ID) {
  throw new Error('La variable de entorno NOTION_DATABASE_ID es requerida');
}

/**
 * Obtiene todos los case studies de Notion
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    if (!NOTION_DATABASE_ID) {
      console.error('Missing required environment variable:', {
        hasDatabaseId: !!NOTION_DATABASE_ID
      });
      throw new Error('Falta el ID de la base de datos de Notion');
    }

    console.log('Fetching case studies with:', {
      databaseId: NOTION_DATABASE_ID
    });

    let response;
    try {
      response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        sorts: [{
          property: 'Brand Name',
          direction: 'ascending'
        }]
      });
    } catch (error: any) {
      console.error('Notion API error:', {
        message: error?.message || 'No error message',
        code: error?.code || 'No error code',
        status: error?.status || 'No status',
        name: error?.name || 'No error name',
        stack: error?.stack || 'No stack trace',
        databaseId: NOTION_DATABASE_ID
      });
      
      if (error?.code === 'unauthorized') {
        throw new Error('API Key de Notion inválida');
      } else if (error?.code === 'object_not_found') {
        throw new Error('Base de datos de Notion no encontrada');
      } else {
        throw new Error(`Error al conectar con Notion: ${error?.message || 'Error desconocido'}`);
      }
    }

    console.log('Notion response:', {
      results: response.results.length,
      hasMore: response.has_more,
      nextCursor: response.next_cursor
    });

    const pages = response.results.filter((page): page is PageObjectResponse => {
      if (!('properties' in page)) {
        console.warn('Page missing properties:', { pageId: page.id });
        return false;
      }
      return true;
    });

    console.log('Filtered pages:', pages.length);

    const caseStudies = pages.map(page => {
      try {
        return transformNotionToCaseStudy(page);
      } catch (error) {
        console.error('Error transforming page:', {
          pageId: page.id,
          properties: Object.keys(page.properties),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw new Error(`Error al procesar el case study: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    });

    console.log('Transformed case studies:', caseStudies.length);
    return caseStudies;
  } catch (error) {
    console.error('Error in getAllCaseStudies:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      databaseId: NOTION_DATABASE_ID
    });
    throw error;
  }
}

/**
 * Obtiene un case study por su ID
 */
export async function getCaseStudy(pageId: string): Promise<CaseStudy> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!('properties' in page)) {
    throw new Error('Página no encontrada o formato inválido');
  }
  return transformNotionToCaseStudy(page);
}

/**
 * Actualiza un case study existente
 */
export async function updateCaseStudy({ id, ...data }: UpdateCaseStudyInput): Promise<CaseStudy> {
  const properties = transformCaseStudyToNotion(data);

  const page = await notion.pages.update({
    page_id: id,
    properties
  } as UpdatePageParameters);

  if (!('properties' in page)) {
    throw new Error('Error al actualizar el case study');
  }

  return transformNotionToCaseStudy(page);
}

/**
 * Crea un nuevo case study en Notion
 */
export async function createCaseStudy(input: CreateCaseStudyInput): Promise<CaseStudy> {
  if (!input.title || !input.client) {
    throw new Error('Título y cliente son requeridos');
  }

  const properties = transformCaseStudyToNotion(input);

  const page = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: properties || {},
  } as CreatePageParameters);

  if (!('properties' in page)) {
    throw new Error('Error al crear el case study');
  }

  return transformNotionToCaseStudy(page);
}

/**
 * Elimina un case study (lo marca como archivado en Notion)
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  if (!id) {
    throw new Error('El ID es requerido para eliminar un case study');
  }

  await notion.pages.update({
    page_id: id,
    archived: true
  });
}
