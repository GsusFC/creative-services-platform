// Versión mock de la integración con Notion
// Reemplaza la dependencia real por una implementación simulada para despliegue

// Mock de Client
export class Client {
  constructor(config: { auth: string }) {
    // Constructor simulado
  }

  databases = {
    retrieve: async () => {
      return {
        title: [{ plain_text: 'Mock Notion Database' }],
        properties: {}
      };
    },
    query: async () => {
      return {
        results: []
      };
    }
  };
}

// Inicializar el cliente de Notion (mock)
export const notion = new Client({
  auth: process.env.NOTION_API_KEY || ''
});

export const databaseId = process.env.NOTION_DATABASE_ID || '';

// Función para obtener la estructura de una base de datos (simulada)
export async function getDatabaseStructure() {
  return {
    databaseId: databaseId,
    databaseName: 'Mock Notion Database',
    properties: []
  };
}

// Función para obtener un sample de datos (simulada)
export async function getSampleData() {
  return [];
}
