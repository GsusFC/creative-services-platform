/**
 * Script para corregir los errores persistentes en el archivo de ruta de estructura de base de datos
 */

const fs = require('fs');
const path = require('path');

// Ruta al archivo con errores
const filePath = path.join(__dirname, '../src/app/api/notion/database/structure/route.ts');

// Leer el contenido actual del archivo
console.log(`Leyendo archivo: ${filePath}`);
const fileContent = fs.readFileSync(filePath, 'utf8');

// Hacer las correcciones necesarias
const correctedContent = fileContent
  // Corregir el uso incorrecto de Promise
  .replace(/const requestPromise<any> = notion\.retrieve/g, 'const requestPromise = notion.retrieve')
  .replace(/const response = await Promise<any>\.race/g, 'const response = await Promise.race')
  .replace(/Promise<any>\?\.race/g, 'Promise.race')
  .replace(/Promise<any>\?\.resolve/g, 'Promise.resolve')
  // Eliminar operadores opcionales innecesarios
  .replace(/response\?\.properties/g, 'response.properties')
  .replace(/value\?\.type/g, 'value.type')
  .replace(/value\?\.id/g, 'value.id')
  .replace(/response\?\.title\?/g, 'response.title?')
  .replace(/title\?/g, 'title?')
  .replace(/plain_text \?\? /g, 'plain_text ?? ')
  .replace(/NextResponse\?\.json/g, 'NextResponse.json')
  .replace(/console\?\.error/g, 'console.error')
  .replace(/error\?\.message/g, 'error.message');

// Guardar las correcciones
console.log('Aplicando correcciones...');
fs.writeFileSync(filePath, correctedContent, 'utf8');

console.log('✅ Correcciones aplicadas con éxito');
