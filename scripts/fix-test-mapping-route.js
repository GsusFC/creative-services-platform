/**
 * Script para corregir errores en test-mapping/route.ts
 * 
 * Este script está diseñado para corregir errores relacionados con:
 * 1. Problemas con tipos undefined en database_id
 * 2. Errores de propiedades en respuestas de la API de Notion
 * 3. Operadores lógicos mal combinados
 */

const fs = require('fs');
const path = require('path');

// Path al archivo que queremos corregir
const testMappingFilePath = path.join(__dirname, '../src/app/api/notion/test-mapping/route.ts');

console.log(`Corrigiendo errores en: ${testMappingFilePath}`);

// Leer el contenido del archivo
let content = fs.readFileSync(testMappingFilePath, 'utf8');

// 1. Corregir problema con database_id undefined
content = content.replace(
  /database_id: process\.env\.NOTION_CASES_DATABASE_ID,/g,
  'database_id: process.env.NOTION_CASES_DATABASE_ID || "", // Aseguramos que nunca sea undefined'
);

// 2. Corregir comprobación de longitud de respuesta que no existe en QueryDatabaseResponse
content = content.replace(
  /if \(response\?\.length === 0\) \{/g,
  'if (!response || response.results.length === 0) {'
);

// 3. Corregir el acceso a page?.properties que puede no existir
// Primero añadimos una función para acceso seguro a properties
const safePropertiesCheck = `
// Función para acceso seguro a propiedades
function hasProperties(page: any): page is PageObjectResponse {
  return page && 'properties' in page;
}
`;

// Insertar la función después de las importaciones
content = content.replace(
  /(import .+\n\n)/,
  `$1${safePropertiesCheck}\n`
);

// 4. Reemplazar accesos no seguros con comprobaciones
content = content.replace(
  /const propertyName = Object\.keys\(page\?\.properties\)\.find\(/g,
  'const propertyName = hasProperties(page) ? Object.keys(page.properties).find('
);

content = content.replace(
  /name => page\?\.properties\[name\]\.id === mapping\?\.notionField/g,
  'name => page.properties[name].id === mapping?.notionField) : null'
);

// 5. Reemplazar acceso no seguro a propiedad
content = content.replace(
  /const property = page\?\.properties\[propertyName\];/g,
  'const property = hasProperties(page) && propertyName ? page.properties[propertyName] : null;'
);

// 6. Corregir operadores lógicos mezclados
content = content.replace(
  /f\?\.file\?\.url \|\| f\?\.external\?\.url \?\? ''/g,
  '(f?.file?.url || f?.external?.url || "")'
);

// Guardar el archivo modificado
fs.writeFileSync(testMappingFilePath, content);

console.log('Correcciones aplicadas con éxito.');
