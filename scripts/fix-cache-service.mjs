/**
 * Script para corregir errores en el archivo cache-service.ts
 */

import fs from 'fs';
import path from 'path';

console.log('Corrigiendo errores en cache-service.ts...');

const cacheServicePath = path.join(process.cwd(), 'src/lib/field-mapper/cache-service.ts');

// Leer el contenido del archivo
let content = fs.readFileSync(cacheServicePath, 'utf8');
const originalContent = content;

// Corregir operadores de acceso opcional innecesarios
content = content.replace(/this\?\.(\w+)/g, 'this.$1');
content = content.replace(/entry\?\.(\w+)/g, 'entry.$1');
content = content.replace(/Date\?\.now\(\)/g, 'Date.now()');
content = content.replace(/Object\?\.entries/g, 'Object.entries');
content = content.replace(/JSON\?\.parse/g, 'JSON.parse');
content = content.replace(/JSON\?\.stringify/g, 'JSON.stringify');

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(cacheServicePath, content);
  console.log('Archivo cache-service.ts corregido');
} else {
  console.log('No se encontraron patrones para corregir en cache-service.ts');
}

console.log('Correcciones completadas');
