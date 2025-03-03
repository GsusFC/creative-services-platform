/**
 * Script para corregir errores de tipos en el archivo validation.ts
 */

import fs from 'fs';
import path from 'path';

console.log('Corrigiendo errores de tipos en validation.ts...');

const validationPath = path.join(process.cwd(), 'src/lib/field-mapper/validation.ts');

// Leer el contenido del archivo
let content = fs.readFileSync(validationPath, 'utf8');
const originalContent = content;

// Corregir tipos incorrectos en WEBSITE_TO_NOTION_TYPE_MAP
const typeReplacements = [
  { from: /'text': \['title', 'richText', 'text'\]/g, to: "'text': ['title', 'richText', 'richText' as NotionFieldType]" },
  { from: /'slug': \['title', 'slug'\]/g, to: "'slug': ['title', 'title' as NotionFieldType]" },
  { from: /'html': \['richText', 'html'\]/g, to: "'html': ['richText', 'richText' as NotionFieldType]" },
  { from: /'float': \['number', 'float'\]/g, to: "'float': ['number', 'number' as NotionFieldType]" },
  { from: /'integer': \['number', 'integer'\]/g, to: "'integer': ['number', 'number' as NotionFieldType]" },
  { from: /'enum': \['select', 'status', 'enum'\]/g, to: "'enum': ['select', 'status', 'select' as NotionFieldType]" },
  { from: /'category': \['select', 'category'\]/g, to: "'category': ['select', 'select' as NotionFieldType]" },
  { from: /'array': \['multi_select', 'people', 'files', 'relation', 'rollup', 'array'\]/g, to: "'array': ['multi_select', 'people', 'files', 'relation', 'rollup', 'multi_select' as NotionFieldType]" },
  { from: /'tags': \['multi_select', 'tags'\]/g, to: "'tags': ['multi_select', 'multi_select' as NotionFieldType]" },
  { from: /'categories': \['multi_select', 'categories'\]/g, to: "'categories': ['multi_select', 'multi_select' as NotionFieldType]" },
  { from: /'datetime': \['date', 'created_time', 'last_edited_time', 'datetime'\]/g, to: "'datetime': ['date', 'created_time', 'last_edited_time', 'date' as NotionFieldType]" },
  { from: /'user': \['people', 'created_by', 'last_edited_by', 'user'\]/g, to: "'user': ['people', 'created_by', 'last_edited_by', 'people' as NotionFieldType]" },
  { from: /'image': \['files', 'image'\]/g, to: "'image': ['files', 'files' as NotionFieldType]" },
];

// Aplicar reemplazos
typeReplacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

// Eliminar la segunda declaración de TYPE_COMPATIBILITY_MAP
const compatMapRegex = /export const TYPE_COMPATIBILITY_MAP: Record<NotionFieldType, WebsiteFieldType\[\]> = \{[\s\S]*?\};/g;
const matches = [...content.matchAll(compatMapRegex)];
if (matches.length > 1) {
  const firstMatch = matches[0];
  const secondMatch = matches[1];
  
  // Reemplazar la segunda ocurrencia con un comentario
  content = content.substring(0, secondMatch.index) + 
            '// Segunda declaración de TYPE_COMPATIBILITY_MAP eliminada para evitar duplicación' + 
            content.substring(secondMatch.index + secondMatch[0].length);
}

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(validationPath, content);
  console.log('Archivo validation.ts corregido');
} else {
  console.log('No se encontraron patrones para corregir en validation.ts');
}

console.log('Correcciones completadas');
