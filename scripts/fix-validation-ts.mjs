/**
 * Script para corregir errores en el archivo validation.ts
 */

import fs from 'fs';
import path from 'path';

console.log('Corrigiendo errores en validation.ts...');

const validationFilePath = path.join(process.cwd(), 'src/lib/field-mapper/validation.ts');

// Leer el contenido del archivo
let content = fs.readFileSync(validationFilePath, 'utf8');
const originalContent = content;

// Corregir errores de tipo en el mapa de compatibilidad
content = content.replace(/'file': \['files', 'file'\]/g, "'file': ['files', 'files' as NotionFieldType]");
content = content.replace(/'gallery': \['files', 'gallery'\]/g, "'gallery': ['files', 'files' as NotionFieldType]");
content = content.replace(/'boolean': \['checkbox', 'formula', 'boolean'\]/g, "'boolean': ['checkbox', 'formula', 'checkbox' as NotionFieldType]");
content = content.replace(/'link': \['url', 'link'\]/g, "'link': ['url', 'url' as NotionFieldType]");
content = content.replace(/'phone': \['phone_number', 'phone'\]/g, "'phone': ['phone_number', 'phone_number' as NotionFieldType]");
content = content.replace(/'reference': \['relation', 'reference'\]/g, "'reference': ['relation', 'relation' as NotionFieldType]");

// Corregir redeclaración de TYPE_COMPATIBILITY_MAP
content = content.replace(/export const TYPE_COMPATIBILITY_MAP: Record<NotionFieldType, WebsiteFieldType\[\]> = \{[\s\S]*?\};/g, (match, offset) => {
  // Solo mantener la primera ocurrencia
  if (content.indexOf(match) === offset) {
    return match;
  }
  return '// Removed duplicate TYPE_COMPATIBILITY_MAP';
});

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(validationFilePath, content);
  console.log('Archivo validation.ts corregido');
} else {
  console.log('No se encontraron patrones para corregir en validation.ts');
}

console.log('Correcciones completadas');
