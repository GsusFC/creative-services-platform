/**
 * Script específico para corregir los errores de TypeScript en el sistema Field Mapper
 * 
 * Este script corrige:
 * 1. Actualiza tipos en types.ts para incluir 'website-to-notion'
 * 2. Corrige errores en el mapa de compatibilidad en validation.ts
 */

const fs = require('fs');
const path = require('path');

// Rutas a los archivos principales
const typesFilePath = path.join(__dirname, '../src/lib/field-mapper/types.ts');
const validationFilePath = path.join(__dirname, '../src/lib/field-mapper/validation.ts');

console.log(' Iniciando corrección de errores en el sistema Field Mapper');

// Paso 1: Actualizar la definición de WebsiteFieldType en types.ts
console.log(`\nActualizando tipos en: ${typesFilePath}`);
try {
  let typesContent = fs.readFileSync(typesFilePath, 'utf8');
  
  // Buscar y modificar WebsiteFieldType para incluir 'website-to-notion'
  const websiteTypeRegex = /export type WebsiteFieldType =\s*(?:\|[^;]+)+;/;
  const websiteTypeDefinition = typesContent.match(websiteTypeRegex);
  
  if (websiteTypeDefinition) {
    // Verificar si ya contiene 'website-to-notion'
    if (!websiteTypeDefinition[0].includes("'website-to-notion'")) {
      const updatedDefinition = websiteTypeDefinition[0].replace(
        /(\s*\| '[^']+');/,
        "$1\n  | 'website-to-notion';"
      );
      
      typesContent = typesContent.replace(websiteTypeRegex, updatedDefinition);
      fs.writeFileSync(typesFilePath, typesContent, 'utf8');
      console.log(' WebsiteFieldType actualizado para incluir website-to-notion');
    } else {
      console.log(' WebsiteFieldType ya incluye website-to-notion');
    }
  } else {
    console.log(' No se pudo encontrar la definición de WebsiteFieldType');
  }
  
  // Buscar y modificar NotionFieldType para incluir 'website-to-notion'
  const notionTypeRegex = /export type NotionFieldType =\s*(?:\|[^;]+)+;/;
  const notionTypeDefinition = typesContent.match(notionTypeRegex);
  
  if (notionTypeDefinition) {
    // Verificar si ya contiene 'website-to-notion'
    if (!notionTypeDefinition[0].includes("'website-to-notion'")) {
      const updatedDefinition = notionTypeDefinition[0].replace(
        /(\s*\| '[^']+');/,
        "$1\n  | 'website-to-notion';"
      );
      
      typesContent = typesContent.replace(notionTypeRegex, updatedDefinition);
      fs.writeFileSync(typesFilePath, typesContent, 'utf8');
      console.log(' NotionFieldType actualizado para incluir website-to-notion');
    } else {
      console.log(' NotionFieldType ya incluye website-to-notion');
    }
  } else {
    console.log(' No se pudo encontrar la definición de NotionFieldType');
  }
} catch (error) {
  console.error(` Error al actualizar types.ts: ${error.message}`);
}

// Paso 2: Corregir el mapa de compatibilidad en validation.ts
console.log(`\nCorrigiendo mapa de compatibilidad en: ${validationFilePath}`);
try {
  let validationContent = fs.readFileSync(validationFilePath, 'utf8');
  
  // Corregir el INVERSE_TYPE_COMPATIBILITY_MAP para 'website-to-notion'
  if (validationContent.includes('website-to-notion')) {
    // Reemplazar con un arreglo simple de tipos compatibles
    validationContent = validationContent.replace(
      /'website-to-notion': \[[^\]]*\]/,
      "'website-to-notion': ['string']"
    );
    
    // Corregir la declaración del enum CompatibilityLevel
    if (validationContent.includes('enum CompatibilityLevel') && 
        validationContent.includes('export enum CompatibilityLevel')) {
      validationContent = validationContent.replace(
        /enum CompatibilityLevel\s*{[^}]+}/,
        "// Enum CompatibilityLevel definido más adelante como export"
      );
    }
    
    fs.writeFileSync(validationFilePath, validationContent, 'utf8');
    console.log(' Mapa de compatibilidad corregido');
  } else {
    console.log(' No se encontró website-to-notion en el mapa de compatibilidad');
  }
} catch (error) {
  console.error(` Error al corregir validation.ts: ${error.message}`);
}

console.log('\n Correcciones completadas');
