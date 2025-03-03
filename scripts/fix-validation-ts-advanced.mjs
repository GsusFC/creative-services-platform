/**
 * Script para corregir errores avanzados en el archivo validation.ts
 * 
 * Este script corrige problemas de tipado, operadores opcionales innecesarios,
 * y asegura la consistencia de los tipos en el archivo validation.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo validation.ts
const validationFilePath = path.join(__dirname, '../src/lib/field-mapper/validation.ts');

console.log('Corrigiendo errores avanzados en validation.ts...');

// Leer el contenido del archivo
let content = fs.readFileSync(validationFilePath, 'utf8');

// Corregir operadores opcionales innecesarios
content = content.replace(/TYPE_COMPATIBILITY_MAP\[notionType\]\?\.includes/g, 'TYPE_COMPATIBILITY_MAP[notionType]?.includes');
content = content.replace(/INVERSE_TYPE_COMPATIBILITY_MAP\[websiteType\]\?\.includes/g, 'INVERSE_TYPE_COMPATIBILITY_MAP[websiteType]?.includes');
content = content.replace(/CompatibilityLevel\?\.NONE/g, 'CompatibilityLevel.NONE');
content = content.replace(/CompatibilityLevel\?\.PERFECT/g, 'CompatibilityLevel.PERFECT');
content = content.replace(/CompatibilityLevel\?\.HIGH/g, 'CompatibilityLevel.HIGH');
content = content.replace(/CompatibilityLevel\?\.MEDIUM/g, 'CompatibilityLevel.MEDIUM');
content = content.replace(/CompatibilityLevel\?\.LOW/g, 'CompatibilityLevel.LOW');
content = content.replace(/typeValidationCache\?\.get/g, 'typeValidationCache.get');
content = content.replace(/typeValidationCache\?\.set/g, 'typeValidationCache.set');
content = content.replace(/Array\?\.isArray/g, 'Array.isArray');
content = content.replace(/errors\?\.push/g, 'errors.push');
content = content.replace(/error\?\.message/g, 'error.message');
content = content.replace(/errors\?\.length/g, 'errors.length');
content = content.replace(/notionType\?\.toLowerCase/g, 'notionType.toLowerCase');
content = content.replace(/websiteType\?\.toLowerCase/g, 'websiteType.toLowerCase');
content = content.replace(/normalizedNotionType\?\.includes/g, 'normalizedNotionType.includes');
content = content.replace(/normalizedWebsiteType\?\.includes/g, 'normalizedWebsiteType.includes');

// Añadir la importación de CompatibilityLevel si no existe
if (!content.includes('import { CompatibilityLevel }')) {
  // Buscar la última importación
  const lastImportIndex = content.lastIndexOf('import');
  const lastImportEndIndex = content.indexOf(';', lastImportIndex) + 1;
  
  // Insertar la nueva importación después de la última importación existente
  const beforeImport = content.substring(0, lastImportEndIndex);
  const afterImport = content.substring(lastImportEndIndex);
  
  content = `${beforeImport}
import { CompatibilityLevel } from './types';
${afterImport}`;
}

// Corregir el doble punto y coma al final del objeto INVERSE_TYPE_COMPATIBILITY_MAP
content = content.replace(/};;/, '};');

// Corregir el error en la línea 79
content = content.replace(/'website-to-notion': \['string', 'website-to-notion'\],/, "'website-to-notion': ['string', 'website-to-notion']");

// Escribir el contenido corregido de vuelta al archivo
fs.writeFileSync(validationFilePath, content);

console.log('Archivo corregido: validation.ts');
console.log('Correcciones completadas.');
