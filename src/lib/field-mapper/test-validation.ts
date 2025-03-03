/**
 * Script de prueba para validar el funcionamiento del Field Mapper
 */

import { validateTypeCompatibility, getCompatibilityLevel, CompatibilityLevel } from './validation';
import { typeValidationCache } from './cache-service';
import { NotionFieldType, WebsiteFieldType } from './types';

// Función para ejecutar pruebas
function runTests() {
  console?.log('=== Iniciando pruebas del Field Mapper ===');
  
  // Prueba 1: Validación de tipos compatibles
  const test1 = validateTypeCompatibility('title' as NotionFieldType, 'string' as WebsiteFieldType);
  console?.log('Prueba 1 - title → string:', test1);
  
  // Prueba 2: Validación de tipos incompatibles
  const test2 = validateTypeCompatibility('title' as NotionFieldType, 'number' as WebsiteFieldType);
  console?.log('Prueba 2 - title → number:', test2);
  
  // Prueba 3: Nivel de compatibilidad
  const test3 = getCompatibilityLevel('richText' as NotionFieldType, 'richText' as WebsiteFieldType);
  console?.log('Prueba 3 - rich_text → richText (nivel):', 
    test3, 
    test3 === CompatibilityLevel?.PERFECT ? 'PERFECT' : 
    test3 === CompatibilityLevel?.HIGH ? 'HIGH' : 
    test3 === CompatibilityLevel?.MEDIUM ? 'MEDIUM' : 
    test3 === CompatibilityLevel?.LOW ? 'LOW' : 'NONE'
  );
  
  // Prueba 4: Caché
  console?.log('Prueba 4 - Estadísticas de caché antes:', typeValidationCache?.getStats());
  
  // Ejecutar la misma validación varias veces para probar la caché
  for (let i = 0; i < 5; i++) {
    validateTypeCompatibility('date' as NotionFieldType, 'date' as WebsiteFieldType);
  }
  
  console?.log('Prueba 4 - Estadísticas de caché después:', typeValidationCache?.getStats());
  
  console?.log('=== Pruebas completadas ===');
}

// Ejecutar las pruebas
runTests();

export {};
