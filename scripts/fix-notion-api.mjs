/**
 * Script para corregir errores comunes en los archivos de API de Notion
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

console.log('Corrigiendo errores en archivos de API de Notion...');

// Encontrar todos los archivos de API de Notion
const notionApiFiles = glob.sync('src/app/api/notion/**/*.ts', {
  cwd: process.cwd()
});

let totalFixed = 0;

// Procesar cada archivo
notionApiFiles.forEach(relativeFilePath => {
  const filePath = path.join(process.cwd(), relativeFilePath);
  
  // Leer el contenido del archivo
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Corregir acceso a variables de entorno
  content = content.replace(/process\.NOTION_API_KEY/g, 'process.env.NOTION_API_KEY');
  content = content.replace(/process\.NOTION_CASES_DATABASE_ID/g, 'process.env.NOTION_CASES_DATABASE_ID');
  
  // Corregir problemas con NextRequest
  content = content.replace(/request\.searchParams/g, 'new URL(request.url).searchParams');
  
  // Corregir problemas con Client de Notion
  content = content.replace(/notion\.query\(/g, 'notion.databases.query(');
  
  // Corregir problemas con propiedades de tipo desconocido
  content = content.replace(/switch \(property\.type\)/g, 'switch ((property as any).type)');
  content = content.replace(/property\.id/g, '(property as any).id');
  content = content.replace(/property\.map/g, '(property as any).map');
  content = content.replace(/property\.title/g, '(property as any).title');
  content = content.replace(/property\.rich_text/g, '(property as any).rich_text');
  content = content.replace(/property\.number/g, '(property as any).number');
  content = content.replace(/property\.select/g, '(property as any).select');
  content = content.replace(/property\.multi_select/g, '(property as any).multi_select');
  content = content.replace(/property\.date/g, '(property as any).date');
  content = content.replace(/property\.files/g, '(property as any).files');
  content = content.replace(/property\.checkbox/g, '(property as any).checkbox');
  content = content.replace(/property\.url/g, '(property as any).url');
  content = content.replace(/property\.email/g, '(property as any).email');
  
  // Si se hicieron cambios, guardar el archivo
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Archivo corregido: ${relativeFilePath}`);
    totalFixed++;
  }
});

console.log(`Correcciones completadas. Total de archivos corregidos: ${totalFixed}`);
