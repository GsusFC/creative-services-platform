import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({
  path: path.resolve(process.cwd(), '.env.test')
});

describe('Notion Connection', () => {
  it('should connect to Notion API', async () => {
    const apiKey = process.env['NOTION_API_KEY'];
    const databaseId = process.env['NOTION_DATABASE_ID'];
    
    if (!apiKey || !databaseId) {
      throw new Error('API Key y Database ID son requeridos');
    }

    const notion = new Client({
      auth: apiKey
    });

    const response = await notion.databases.retrieve({
      database_id: databaseId
    });

    expect(response).toBeDefined();
    // El ID puede venir con o sin guiones
    const normalizedResponseId = response.id.replace(/-/g, '');
    const normalizedEnvId = databaseId.replace(/-/g, '');
    expect(normalizedResponseId).toBe(normalizedEnvId);
  });
});
