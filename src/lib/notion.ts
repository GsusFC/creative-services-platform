import { Client } from '@notionhq/client';

// Verificar que existe la API key de Notion
if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing NOTION_API_KEY environment variable');
}

console.log('Initializing Notion client with API key length:', process.env.NOTION_API_KEY.length);

// Inicializar el cliente de Notion
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const databaseId = process.env.NOTION_DATABASE_ID;

export async function queryDatabase(databaseId: string) {
  try {
    console.log('Querying Notion database with ID:', databaseId);
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // Fetch full properties for each page
    const pagesWithProperties = await Promise.all(
      response.results.map(async (page) => {
        const pageId = page.id;
        
        // Add type assertion for page
        const typedPage = page as {
          id: string;
          properties: Record<string, { 
            id: string; 
            type: string;
            title?: any;
            rich_text?: any;
            select?: any;
            multi_select?: any;
            files?: any;
          }>;
        };
        
        // Get property IDs for Hero Image and List Images
        const propertyIds = [
          typedPage.properties['Hero Image']?.id,
          typedPage.properties['List Images']?.id,
        ].filter(Boolean);

        // Fetch each property
        const propertyPromises = propertyIds.map(propertyId =>
          notion.pages.properties.retrieve({
            page_id: pageId,
            property_id: propertyId,
          })
        );

        const propertyResponses = await Promise.all(propertyPromises);

        // Merge property responses back into the page
        propertyResponses.forEach(propertyResponse => {
          if ('id' in propertyResponse) {
            const propertyName = Object.keys(typedPage.properties).find(
              key => typedPage.properties[key].id === propertyResponse.id
            );
            if (propertyName) {
              typedPage.properties[propertyName] = propertyResponse;
            }
          }
        });

        return typedPage;
      })
    );

    // Log for debugging
    console.log('Received response from Notion:', {
      total_results: response.results.length,
      first_result: response.results[0] ? JSON.stringify(response.results[0]).slice(0, 200) + '...' : 'no results'
    });

    // Fixed: Return the pages with their properties
    return {
      ...response,
      results: pagesWithProperties
    };
  } catch (error) {
    console.error('Error querying Notion database:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

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

export async function getPage(pageId: string) {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });
    return response;
  } catch (error) {
    console.error('Error retrieving Notion page:', error);
    throw error;
  }
}

export async function getBlockChildren(blockId: string) {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
    });
    return response.results;
  } catch (error) {
    console.error('Error retrieving block children:', error);
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
