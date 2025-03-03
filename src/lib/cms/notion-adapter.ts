/**
 * Adaptador para servicios de Notion
 * 
 * Este adaptador proporciona una capa de abstracción entre el CMS y los servicios de Notion.
 * Permite que el CMS siga funcionando correctamente aunque los servicios de Notion estén desactivados.
 */

import { FEATURES } from '@/config/features';

/**
 * Tipos para los valores en propiedades de Notion
 */
export type NotionPropertyValue = 
  | { title: Array<{ text: { content: string } }> }
  | { rich_text: Array<{ text: { content: string } }> }
  | { select: { name: string } }
  | { multi_select: Array<{ name: string }> }
  | { date: { start: string; end?: string } }
  | { number: number }
  | { checkbox: boolean }
  | { url: string }
  | { email: string }
  | { phone_number: string }
  | { formula: { type: string; [key: string]: unknown } }
  | { files: Array<{ name: string; url: string }> };

/**
 * Tipo para los proyectos de Notion
 */
export interface NotionProject {
  id: string;
  title: string;
  properties?: Record<string, NotionPropertyValue>;
  created_time?: string;
  last_edited_time?: string;
}

/**
 * Obtiene los proyectos por defecto para pruebas
 */
export function getDefaultProjects(): NotionProject[] {
  return [
    {
      id: 'mock-id-1',
      title: 'Proyecto CMS Demo 1',
      properties: {
        Name: { title: [{ text: { content: 'Proyecto CMS Demo 1' } }] },
        Description: { rich_text: [{ text: { content: 'Descripción del proyecto de demostración 1' } }] },
        Client: { select: { name: 'Cliente Demo' } },
        Status: { select: { name: 'Completado' } },
      },
      created_time: new Date().toISOString(),
      last_edited_time: new Date().toISOString(),
    },
    {
      id: 'mock-id-2',
      title: 'Proyecto CMS Demo 2',
      properties: {
        Name: { title: [{ text: { content: 'Proyecto CMS Demo 2' } }] },
        Description: { rich_text: [{ text: { content: 'Descripción del proyecto de demostración 2' } }] },
        Client: { select: { name: 'Cliente Demo' } },
        Status: { select: { name: 'En progreso' } },
      },
      created_time: new Date().toISOString(),
      last_edited_time: new Date().toISOString(),
    },
  ];
}

/**
 * Verifica si los servicios de Notion están habilitados
 */
export function isNotionEnabled(): boolean {
  return FEATURES.notion.enabled;
}

/**
 * Comprueba si la propiedad es de tipo rich_text
 */
function isRichTextProperty(property: NotionPropertyValue): property is { rich_text: Array<{ text: { content: string } }> } {
  return 'rich_text' in property;
}

/**
 * Comprueba si la propiedad es de tipo select
 */
function isSelectProperty(property: NotionPropertyValue): property is { select: { name: string } } {
  return 'select' in property;
}

/**
 * Convierte un proyecto de Notion a un formato compatible con Case Studies
 */
export function convertToCaseStudy(project: NotionProject) {
  // Extraer la descripción
  let description = 'Descripción no disponible';
  const descriptionProp = project.properties?.Description;
  if (descriptionProp && isRichTextProperty(descriptionProp) && descriptionProp.rich_text.length > 0) {
    description = descriptionProp.rich_text[0].text.content;
  }

  // Extraer el cliente
  let client = 'Cliente no especificado';
  const clientProp = project.properties?.Client;
  if (clientProp && isSelectProperty(clientProp)) {
    client = clientProp.select.name;
  }

  // Extraer el estado
  let status = 'Estado no especificado';
  const statusProp = project.properties?.Status;
  if (statusProp && isSelectProperty(statusProp)) {
    status = statusProp.select.name;
  }

  return {
    id: project.id,
    title: project.title,
    description,
    client,
    status,
    date: project.created_time ? new Date(project.created_time) : new Date(),
    lastModified: project.last_edited_time ? new Date(project.last_edited_time) : new Date(),
  };
}

/**
 * Adaptador para recuperar datos de Notion sin depender directamente de su API
 */
export async function getNotionData(): Promise<NotionProject[]> {
  if (!isNotionEnabled()) {
    console.log('Notion está desactivado, usando datos de prueba');
    return getDefaultProjects();
  }

  try {
    // En la implementación real, esto llamaría a la API de Notion
    // Por ahora, devolvemos datos de prueba
    return getDefaultProjects();
  } catch (error) {
    console.error('Error al obtener datos de Notion:', error);
    return getDefaultProjects();
  }
}
