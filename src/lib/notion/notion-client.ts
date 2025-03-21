import { Client } from '@notionhq/client';

const NOTION_API_KEY = process.env['NOTION_API_KEY'];

if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY no está configurada');
}

export const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: '2022-06-28',
  timeoutMs: 60000,
});
