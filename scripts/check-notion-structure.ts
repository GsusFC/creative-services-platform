import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Cargar variables de entorno de prueba
dotenv.config({ path: '.env.test' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function checkDatabaseStructure() {
  try {
    console.log('Obteniendo estructura de la base de datos...\n');
    
    const database = await notion.databases.retrieve({
      database_id: databaseId!
    });

    console.log('Propiedades encontradas:');
    console.log('=======================\n');
    
    Object.entries(database.properties).forEach(([name, property]) => {
      console.log(`${name}:`);
      console.log(`  Tipo: ${property.type}`);
      console.log('  Configuración:', JSON.stringify(property, null, 2));
      console.log('');
    });

  } catch (error) {
    console.error('Error al obtener la estructura:', error);
  }
}

checkDatabaseStructure();
