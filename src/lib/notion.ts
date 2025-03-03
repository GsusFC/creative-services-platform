import { Client } from '@notionhq/client';

// Valor por defecto para desarrollo
const MOCK_API_KEY = 'secret_development_mock_key_for_testing_only';

// Verificar que existe la API key de Notion
const apiKey = process.env.NOTION_API_KEY || MOCK_API_KEY;

// Función para verificar si estamos usando datos reales o simulados
export const isUsingMockData = (): boolean => {
  return apiKey === MOCK_API_KEY || !process.env.NOTION_API_KEY;
};

console.log('Initializing Notion client with API key');

// Inicializar el cliente de Notion
export const notion = new Client({
  auth: apiKey,
});

export const databaseId = process.env.NOTION_DATABASE_ID || 'mock_database_id';

// Define the NotionDataType interface
interface NotionDataType {
  results: Record<string, unknown>[];
  object: string;
  page: Record<string, unknown> | null;
}

export async function queryDatabase(databaseId: string) {
  try {
    // Si estamos usando la API key mock, devolver datos de ejemplo
    if (apiKey === MOCK_API_KEY) {
      console.log('Using mock data for development');
      const notionData: NotionDataType = {
        results: [
          {
            id: 'mock_page_1',
            properties: {
              Name: { 
                type: 'title',
                title: [{ plain_text: 'Mock Page 1' }] 
              },
              Description: { 
                type: 'rich_text',
                rich_text: [{ plain_text: 'This is a mock page for development' }] 
              },
              Status: {
                type: 'select',
                select: { name: 'In Progress' }
              },
              Date: {
                type: 'date',
                date: { start: '2025-02-28' }
              }
            }
          },
          {
            id: 'mock_page_2',
            properties: {
              Name: { 
                type: 'title',
                title: [{ plain_text: 'Mock Page 2' }] 
              },
              Description: { 
                type: 'rich_text',
                rich_text: [{ plain_text: 'Another mock page for testing' }] 
              },
              Status: {
                type: 'select',
                select: { name: 'Completed' }
              },
              Date: {
                type: 'date',
                date: { start: '2025-02-25' }
              }
            }
          }
        ],
        object: 'list',
        page: {} as Record<string, unknown>
      };
      return notionData;
    }

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
            title?: { text: { content: string }[] };
            rich_text?: { text: { content: string }[] }[];
            select?: { name: string };
            multi_select?: { name: string }[];
            files?: { name: string; file?: { url: string }; external?: { url: string } }[];
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
              // Asegurar que la propiedad es compatible con el tipo esperado
              typedPage.properties[propertyName] = propertyResponse as { id: string; type: string; [key: string]: unknown };
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
    const notionData: NotionDataType = {
      ...response,
      results: pagesWithProperties,
      object: 'list',
      page: {} as Record<string, unknown>
    };
    return notionData;
  } catch (error) {
    console.error('Error querying Notion database:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Función para obtener la estructura de una base de datos de Notion
export async function getDatabaseStructure(databaseId: string) {
  try {
    // Si estamos usando la API key mock, devolver estructura de ejemplo
    if (apiKey === MOCK_API_KEY) {
      console.log('Using mock database structure for development');
      return {
        id: 'mock_database',
        title: [{ plain_text: 'Mock Database' }],
        properties: {
          Name: {
            id: 'title',
            name: 'Name',
            type: 'title'
          },
          Description: {
            id: 'rich_text',
            name: 'Description',
            type: 'rich_text'
          },
          Status: {
            id: 'select',
            name: 'Status',
            type: 'select',
            select: {
              options: [
                { name: 'Not Started', color: 'gray' },
                { name: 'In Progress', color: 'blue' },
                { name: 'Completed', color: 'green' },
              ]
            }
          },
          Date: {
            id: 'date',
            name: 'Date',
            type: 'date'
          },
          Tags: {
            id: 'multi_select',
            name: 'Tags',
            type: 'multi_select',
            multi_select: {
              options: [
                { name: 'Frontend', color: 'red' },
                { name: 'Backend', color: 'blue' },
                { name: 'Design', color: 'purple' },
              ]
            }
          },
          Done: {
            id: 'checkbox',
            name: 'Done',
            type: 'checkbox'
          },
          Priority: {
            id: 'number',
            name: 'Priority',
            type: 'number'
          }
        }
      };
    }

    console.log('Fetching database structure for ID:', databaseId);
    const response = await notion.databases.retrieve({
      database_id: databaseId,
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
      databaseName: 'Notion Database', // El título no está disponible directamente en GetDatabaseResponse
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
