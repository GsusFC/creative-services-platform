import { Client } from '@notionhq/client';

// Inicializar el cliente de Notion
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const databaseId = process.env.NOTION_DATABASE_ID;

// Función para obtener la estructura de una base de datos de Notion
export async function getDatabaseStructure() {
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID no está definido en las variables de entorno');
  }

  try {
    // Obtener la base de datos
    const response = await notion.databases.retrieve({ 
      database_id: databaseId 
    });

    // Procesar las propiedades para el Field Mapper
    const properties = Object.entries(response.properties).map(([name, prop]) => {
      return {
        id: prop.id,
        name: name,
        type: prop.type,
        // Algunos tipos tienen detalles adicionales que podríamos necesitar
        typeDetails: prop[prop.type as keyof typeof prop]
      };
    });

    return {
      databaseId: databaseId,
      databaseName: response.title?.[0]?.plain_text || 'Notion Database',
      properties: properties
    };
  } catch (error) {
    console.error('Error al obtener la estructura de la base de datos de Notion:', error);
    throw error;
  }
}

// Función para obtener un sample de datos
export async function getSampleData(limit = 3) {
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID no está definido en las variables de entorno');
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: limit,
    });

    return response.results;
  } catch (error) {
    console.error('Error al obtener datos de muestra de Notion:', error);
    throw error;
  }
}
