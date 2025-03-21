/**
 * Configuración y mapeo de propiedades entre nuestra estructura y Notion
 */

export const NOTION_PROPERTY_MAP = {
  // Propiedades de nuestro sistema -> nombres en Notion
  client: 'Client',           // title
  description: 'Description',  // rich_text
  status: 'Status',           // select
  language: 'Language',       // multi_select
  services: 'Services',       // multi_select
  slug: 'Slug',              // rich_text
  highlighted: '00. Highlighted', // checkbox
  cover: 'Cover',            // files
  avatar: 'Avatar',          // files
  website: 'Website',        // url
  video1: 'Video 1',         // url
  video2: '02. Video 2'     // url
} as const;

export type NotionPropertyKey = keyof typeof NOTION_PROPERTY_MAP;
export type NotionPropertyValue = typeof NOTION_PROPERTY_MAP[NotionPropertyKey];

// Mapeo inverso para facilitar la transformación de Notion a nuestro sistema
export const REVERSE_NOTION_PROPERTY_MAP = Object.entries(NOTION_PROPERTY_MAP)
  .reduce((acc, [key, value]) => ({
    ...acc,
    [value]: key
  }), {} as Record<NotionPropertyValue, NotionPropertyKey>);
