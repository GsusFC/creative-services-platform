#!/usr/bin/env ts-node

/**
 * Script para importar datos completos desde Notion
 * 
 * Este script utiliza las funciones existentes en el proyecto para importar
 * todos los casos de estudio desde Notion y guardarlos localmente.
 * 
 * Uso:
 * npx ts-node scripts/import-notion-data.ts
 */

import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { getAllCaseStudies } from '../src/lib/notion/client';
import { CaseStudy } from '../src/types/case-study';

// Cargar variables de entorno
config({ path: path.resolve(process.cwd(), '.env.local') });

// Directorio para almacenar los datos
const DATA_DIR = path.resolve(process.cwd(), 'data');
const CASE_STUDIES_FILE = path.join(DATA_DIR, 'case-studies.json');

// Asegurar que el directorio de datos existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Guarda los casos de estudio en un archivo local
 */
async function saveToLocalStorage(studies: CaseStudy[]): Promise<void> {
  try {
    fs.writeFileSync(
      CASE_STUDIES_FILE,
      JSON.stringify(studies, null, 2),
      'utf-8'
    );
    console.log(`✅ Datos guardados en ${CASE_STUDIES_FILE}`);
  } catch (error) {
    console.error('❌ Error al guardar datos localmente:', error);
    throw error;
  }
}

/**
 * Función principal para importar datos desde Notion
 */
async function importFromNotion(): Promise<void> {
  console.log('🔄 Importando datos desde Notion...');
  
  try {
    // Verificar variables de entorno
    const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
    const apiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY;
    
    if (!databaseId || !apiKey) {
      throw new Error('Variables de entorno no configuradas. Verifica NEXT_PUBLIC_NOTION_DATABASE_ID y NEXT_PUBLIC_NOTION_API_KEY');
    }
    
    console.log(`📋 Usando base de datos: ${databaseId}`);
    
    // Obtener datos de Notion
    const studies = await getAllCaseStudies();
    
    console.log(`✅ Se obtuvieron ${studies.length} casos de estudio de Notion`);
    
    // Mostrar títulos de los casos de estudio
    studies.forEach((study, index) => {
      console.log(`  ${index + 1}. ${study.title} (${study.status})`);
    });
    
    // Guardar datos localmente
    await saveToLocalStorage(studies);
    
    console.log('✅ Importación completada con éxito');
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
importFromNotion();
