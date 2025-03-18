import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { cache } from 'react';
import { CaseStudy, CreateCaseStudyInput, UpdateCaseStudyInput } from './types';
import { transformNotionToCaseStudy, transformCaseStudyToNotion } from './transformer';

if (!process.env['NOTION_API_KEY'] || !process.env['NOTION_DATABASE_ID']) {
  throw new Error('Las variables de entorno NOTION_API_KEY y NOTION_DATABASE_ID son requeridas');
}

const notion = new Client({ auth: process.env['NOTION_API_KEY'] });
const NOTION_DATABASE_ID = process.env['NOTION_DATABASE_ID'];

/**
 * Obtiene todos los case studies de Notion
 */
export const getAllCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    page_size: 100
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(transformNotionToCaseStudy);
});

/**
 * Obtiene un case study por su ID
 */
export const getCaseStudy = cache(async (pageId: string): Promise<CaseStudy> => {
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!('properties' in page)) {
    throw new Error('Página no encontrada o formato inválido');
  }
  return transformNotionToCaseStudy(page);
});

/**
 * Actualiza un case study existente
 */
export const updateCaseStudy = cache(async ({ id, ...data }: UpdateCaseStudyInput): Promise<CaseStudy> => {
  const properties = transformCaseStudyToNotion(data);

  const page = await notion.pages.update({
    page_id: id,
    properties,
  });

  if (!('properties' in page)) {
    throw new Error('Error al actualizar el case study');
  }

  return transformNotionToCaseStudy(page);
});

/**
 * Crea un nuevo case study en Notion
 */
export const createCaseStudy = cache(async (input: CreateCaseStudyInput): Promise<CaseStudy> => {
  if (!input.title || !input.client) {
    throw new Error('Título y cliente son requeridos');
  }

  const properties = transformCaseStudyToNotion(input);

  const page = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties,
  });

  if (!('properties' in page)) {
    throw new Error('Error al crear el case study');
  }

  return transformNotionToCaseStudy(page);
});

/**
 * Elimina un case study (lo marca como archivado en Notion)
 */
export const deleteCaseStudy = cache(async (id: string): Promise<void> => {
  if (!id) {
    throw new Error('El ID es requerido para eliminar un case study');
  }

  await notion.pages.update({
    page_id: id,
    archived: true
  });
});
