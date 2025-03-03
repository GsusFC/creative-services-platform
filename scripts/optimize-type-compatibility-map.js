#!/usr/bin/env node

/**
 * Script para optimizar el TYPE_COMPATIBILITY_MAP en el Field Mapper
 * 
 * Este script asegura que el TYPE_COMPATIBILITY_MAP sea consistente en todo el código
 * y que contenga todas las entradas necesarias para los tipos definidos.
 */

'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Archivos principales a analizar
const typesFile = 'src/lib/field-mapper/types.ts';
const validationFile = 'src/lib/field-mapper/validation.ts';

// Función para extraer tipos de un archivo
function extractTypes(filePath, typeRegex) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(typeRegex);
  
  if (!matches) return [];
  
  return matches.map(match => {
    const typeMatch = match.match(/'([^']+)'/);
    return typeMatch ? typeMatch[1] : null;
  }).filter(Boolean);
}

// Función para extraer el TYPE_COMPATIBILITY_MAP actual
function extractCompatibilityMap(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar el mapa de compatibilidad
  const mapMatch = content.match(/export const TYPE_COMPATIBILITY_MAP[^{]*{([^}]*)}/s);
  
  if (!mapMatch) return null;
  
  const mapContent = mapMatch[1];
  const entries = {};
  
  // Extraer cada entrada del mapa
  const entryRegex = /'([^']+)':\s*\[(.*?)\]/g;
  let entryMatch;
  
  while ((entryMatch = entryRegex.exec(mapContent)) !== null) {
    const notionType = entryMatch[1];
    const websiteTypesStr = entryMatch[2];
    
    // Extraer los tipos de sitio web
    const websiteTypes = websiteTypesStr.match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || [];
    
    entries[notionType] = websiteTypes;
  }
  
  return entries;
}

// Función para generar un nuevo TYPE_COMPATIBILITY_MAP optimizado
function generateOptimizedMap(notionTypes, websiteTypes, currentMap) {
  const optimizedMap = {};
  
  // Asegurarse de que todos los tipos de Notion estén en el mapa
  for (const notionType of notionTypes) {
    // Si ya existe en el mapa actual, mantener esos valores
    if (currentMap && currentMap[notionType]) {
      optimizedMap[notionType] = currentMap[notionType];
    } else {
      // Si no existe, generar una entrada basada en heurísticas
      optimizedMap[notionType] = determineCompatibleTypes(notionType, websiteTypes);
    }
  }
  
  return optimizedMap;
}

// Función para determinar tipos compatibles basados en heurísticas
function determineCompatibleTypes(notionType, websiteTypes) {
  const compatibleTypes = [];
  
  // Siempre incluir 'string' como tipo compatible
  if (websiteTypes.includes('string')) {
    compatibleTypes.push('string');
  }
  
  // Mapeo basado en nombres similares
  const similarType = websiteTypes.find(t => 
    t.toLowerCase() === notionType.toLowerCase() ||
    t.replace(/_/g, '').toLowerCase() === notionType.replace(/_/g, '').toLowerCase()
  );
  
  if (similarType && !compatibleTypes.includes(similarType)) {
    compatibleTypes.push(similarType);
  }
  
  // Mapeos específicos basados en el tipo
  switch (notionType) {
    case 'title':
    case 'richText':
      if (websiteTypes.includes('text')) compatibleTypes.push('text');
      if (websiteTypes.includes('richText')) compatibleTypes.push('richText');
      if (websiteTypes.includes('html')) compatibleTypes.push('html');
      break;
      
    case 'number':
      if (websiteTypes.includes('number')) compatibleTypes.push('number');
      if (websiteTypes.includes('float')) compatibleTypes.push('float');
      if (websiteTypes.includes('integer')) compatibleTypes.push('integer');
      break;
      
    case 'select':
    case 'status':
      if (websiteTypes.includes('enum')) compatibleTypes.push('enum');
      if (websiteTypes.includes('category')) compatibleTypes.push('category');
      if (websiteTypes.includes('status')) compatibleTypes.push('status');
      break;
      
    case 'multi_select':
      if (websiteTypes.includes('array')) compatibleTypes.push('array');
      if (websiteTypes.includes('tags')) compatibleTypes.push('tags');
      if (websiteTypes.includes('categories')) compatibleTypes.push('categories');
      break;
      
    case 'date':
    case 'created_time':
    case 'last_edited_time':
      if (websiteTypes.includes('date')) compatibleTypes.push('date');
      if (websiteTypes.includes('datetime')) compatibleTypes.push('datetime');
      break;
      
    case 'people':
    case 'created_by':
    case 'last_edited_by':
      if (websiteTypes.includes('user')) compatibleTypes.push('user');
      if (websiteTypes.includes('array')) compatibleTypes.push('array');
      break;
      
    case 'files':
      if (websiteTypes.includes('file')) compatibleTypes.push('file');
      if (websiteTypes.includes('image')) compatibleTypes.push('image');
      if (websiteTypes.includes('gallery')) compatibleTypes.push('gallery');
      if (websiteTypes.includes('array')) compatibleTypes.push('array');
      break;
      
    case 'checkbox':
      if (websiteTypes.includes('boolean')) compatibleTypes.push('boolean');
      break;
      
    case 'url':
      if (websiteTypes.includes('url')) compatibleTypes.push('url');
      if (websiteTypes.includes('link')) compatibleTypes.push('link');
      break;
      
    case 'email':
      if (websiteTypes.includes('email')) compatibleTypes.push('email');
      break;
      
    case 'phone_number':
      if (websiteTypes.includes('phone')) compatibleTypes.push('phone');
      break;
      
    case 'formula':
      if (websiteTypes.includes('number')) compatibleTypes.push('number');
      if (websiteTypes.includes('boolean')) compatibleTypes.push('boolean');
      if (websiteTypes.includes('date')) compatibleTypes.push('date');
      break;
      
    case 'relation':
      if (websiteTypes.includes('reference')) compatibleTypes.push('reference');
      if (websiteTypes.includes('array')) compatibleTypes.push('array');
      break;
      
    case 'rollup':
      if (websiteTypes.includes('array')) compatibleTypes.push('array');
      if (websiteTypes.includes('number')) compatibleTypes.push('number');
      break;
      
    default:
      // Para tipos desconocidos, solo incluir string
      break;
  }
  
  // Eliminar duplicados
  return [...new Set(compatibleTypes)];
}

// Función para generar el código del TYPE_COMPATIBILITY_MAP
function generateMapCode(optimizedMap) {
  let code = 'export const TYPE_COMPATIBILITY_MAP: Record<NotionFieldType, WebsiteFieldType[]> = {\n';
  
  for (const [notionType, websiteTypes] of Object.entries(optimizedMap)) {
    code += `  '${notionType}': [${websiteTypes.map(t => `'${t}'`).join(', ')}],\n`;
  }
  
  code += '};';
  
  return code;
}

// Función para actualizar el archivo de validación con el nuevo mapa
function updateValidationFile(filePath, newMapCode) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar el mapa de compatibilidad actual
  const mapRegex = /export const TYPE_COMPATIBILITY_MAP[^{]*{[^}]*}/s;
  
  if (!content.match(mapRegex)) {
    console.error(`${colors.red}No se pudo encontrar TYPE_COMPATIBILITY_MAP en ${filePath}${colors.reset}`);
    return false;
  }
  
  // Reemplazar el mapa actual con el nuevo
  const newContent = content.replace(mapRegex, newMapCode);
  
  // Guardar el archivo actualizado
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return true;
}

// Función para generar el mapa inverso
function generateInverseMap(optimizedMap) {
  const inverseMap = {};
  
  // Inicializar el mapa inverso con arrays vacíos para cada tipo de sitio web
  const allWebsiteTypes = new Set();
  Object.values(optimizedMap).forEach(types => {
    types.forEach(type => allWebsiteTypes.add(type));
  });
  
  allWebsiteTypes.forEach(type => {
    inverseMap[type] = [];
  });
  
  // Llenar el mapa inverso
  for (const [notionType, websiteTypes] of Object.entries(optimizedMap)) {
    for (const websiteType of websiteTypes) {
      if (!inverseMap[websiteType].includes(notionType)) {
        inverseMap[websiteType].push(notionType);
      }
    }
  }
  
  return inverseMap;
}

// Función para generar el código del INVERSE_TYPE_COMPATIBILITY_MAP
function generateInverseMapCode(inverseMap) {
  let code = 'export const INVERSE_TYPE_COMPATIBILITY_MAP: Record<WebsiteFieldType, NotionFieldType[]> = {\n';
  
  for (const [websiteType, notionTypes] of Object.entries(inverseMap)) {
    code += `  '${websiteType}': [${notionTypes.map(t => `'${t}'`).join(', ')}],\n`;
  }
  
  code += '};';
  
  return code;
}

// Función para actualizar el archivo de validación con el nuevo mapa inverso
function updateInverseMapInFile(filePath, newInverseMapCode) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar el mapa inverso actual
  const inverseMapRegex = /export const INVERSE_TYPE_COMPATIBILITY_MAP[^{]*{[^}]*}/s;
  
  if (!content.match(inverseMapRegex)) {
    console.error(`${colors.red}No se pudo encontrar INVERSE_TYPE_COMPATIBILITY_MAP en ${filePath}${colors.reset}`);
    return false;
  }
  
  // Reemplazar el mapa inverso actual con el nuevo
  const newContent = content.replace(inverseMapRegex, newInverseMapCode);
  
  // Guardar el archivo actualizado
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return true;
}

// Función principal
async function main() {
  console.log('Iniciando optimización del TYPE_COMPATIBILITY_MAP...\n');

  // Extraer tipos de Notion y Website
  const notionTypeRegex = /\| '([^']+)'/g;
  const websiteTypeRegex = /\| '([^']+)'/g;
  
  console.log(`Extrayendo tipos de ${typesFile}...`);
  const notionTypes = extractTypes(typesFile, notionTypeRegex);
  const websiteTypes = extractTypes(typesFile, websiteTypeRegex);
  
  console.log(`Encontrados ${notionTypes.length} tipos de Notion y ${websiteTypes.length} tipos de Website\n`);
  
  // Extraer el mapa de compatibilidad actual
  console.log(`Extrayendo TYPE_COMPATIBILITY_MAP actual de ${validationFile}...`);
  const currentMap = extractCompatibilityMap(validationFile);
  
  if (!currentMap) {
    console.error(`${colors.red}No se pudo extraer el TYPE_COMPATIBILITY_MAP actual${colors.reset}`);
    return;
  }
  
  console.log(`Mapa actual tiene ${Object.keys(currentMap).length} entradas\n`);
  
  // Generar un mapa optimizado
  console.log('Generando mapa optimizado...');
  const optimizedMap = generateOptimizedMap(notionTypes, websiteTypes, currentMap);
  
  console.log(`Mapa optimizado tiene ${Object.keys(optimizedMap).length} entradas\n`);
  
  // Generar el código del nuevo mapa
  const newMapCode = generateMapCode(optimizedMap);
  
  // Actualizar el archivo de validación
  console.log(`Actualizando ${validationFile} con el nuevo mapa...`);
  const updated = updateValidationFile(validationFile, newMapCode);
  
  if (!updated) {
    console.error(`${colors.red}No se pudo actualizar el archivo de validación${colors.reset}`);
    return;
  }
  
  // Generar el mapa inverso
  console.log('Generando mapa inverso...');
  const inverseMap = generateInverseMap(optimizedMap);
  
  // Generar el código del nuevo mapa inverso
  const newInverseMapCode = generateInverseMapCode(inverseMap);
  
  // Actualizar el archivo de validación con el nuevo mapa inverso
  console.log(`Actualizando ${validationFile} con el nuevo mapa inverso...`);
  const updatedInverse = updateInverseMapInFile(validationFile, newInverseMapCode);
  
  if (!updatedInverse) {
    console.error(`${colors.red}No se pudo actualizar el mapa inverso en el archivo de validación${colors.reset}`);
    return;
  }
  
  console.log(`${colors.green}Archivo de validación actualizado con éxito${colors.reset}\n`);
  
  // Mostrar el nuevo mapa
  console.log('Nuevo TYPE_COMPATIBILITY_MAP:');
  console.log(newMapCode);
  
  // Guardar informe
  const report = `# Informe de optimización del TYPE_COMPATIBILITY_MAP

## Resumen
- Tipos de Notion encontrados: ${notionTypes.length}
- Tipos de Website encontrados: ${websiteTypes.length}
- Entradas en el mapa original: ${Object.keys(currentMap).length}
- Entradas en el mapa optimizado: ${Object.keys(optimizedMap).length}

## Nuevas entradas añadidas
${notionTypes.filter(type => !currentMap[type]).map(type => `- ${type}: [${optimizedMap[type].join(', ')}]`).join('\n')}

## Entradas modificadas
${notionTypes.filter(type => currentMap[type] && !arraysEqual(currentMap[type], optimizedMap[type])).map(type => 
  `- ${type}:\n  - Antes: [${currentMap[type].join(', ')}]\n  - Después: [${optimizedMap[type].join(', ')}]`
).join('\n')}

## Nuevo TYPE_COMPATIBILITY_MAP
\`\`\`typescript
${newMapCode}
\`\`\`

## Nuevo INVERSE_TYPE_COMPATIBILITY_MAP
\`\`\`typescript
${newInverseMapCode}
\`\`\`

## Fecha de ejecución
${new Date().toISOString()}
`;

  fs.writeFileSync('type-compatibility-map-optimization-report.md', report, 'utf8');
  console.log('\nInforme guardado en type-compatibility-map-optimization-report.md');
}

// Función auxiliar para comparar arrays
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
