/**
 * Script para verificar las variables de entorno
 */

// Importamos dotenv para cargar manualmente las variables de entorno
import * as dotenv from 'dotenv';

// Cargamos las variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===');
console.log('NEXT_PUBLIC_NOTION_API_KEY:', process.env['NEXT_PUBLIC_NOTION_API_KEY'] ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_NOTION_DATABASE_ID:', process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] ? '✅ Configurada' : '❌ No configurada');

// Mostramos los primeros caracteres para verificar que se están cargando correctamente
if (process.env['NEXT_PUBLIC_NOTION_API_KEY']) {
  const apiKey = process.env['NEXT_PUBLIC_NOTION_API_KEY'];
  console.log('NEXT_PUBLIC_NOTION_API_KEY (primeros 5 caracteres):', apiKey.substring(0, 5) + '...');
}

if (process.env['NEXT_PUBLIC_NOTION_DATABASE_ID']) {
  const databaseId = process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'];
  console.log('NEXT_PUBLIC_NOTION_DATABASE_ID (primeros 5 caracteres):', databaseId.substring(0, 5) + '...');
}

export {};
