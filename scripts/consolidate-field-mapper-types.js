#!/usr/bin/env node

/**
 * Script para consolidar tipos duplicados y generar un TYPE_COMPATIBILITY_MAP completo
 * 
 * Este script busca tipos duplicados en el Field Mapper y los consolida en types.ts.
 * También genera un TYPE_COMPATIBILITY_MAP completo basado en los tipos definidos.
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
  white: '\x1b[37m',
};

// Directorios a analizar
const directories = [
  'src/lib/field-mapper',
  'src/components/field-mapper',
  'src/app/api/notion'
];

console.log(`${colors.cyan}Iniciando consolidación de tipos del Field Mapper...${colors.reset}\n`);

// Encontrar todos los archivos TypeScript en los directorios especificados
let allFiles = [];
directories.forEach(dir => {
  try {
    const output = execSync(`find ${dir} -type f -name "*.ts" -o -name "*.tsx"`, { encoding: 'utf8' });
    allFiles = allFiles.concat(output.trim().split('\n').filter(Boolean));
  } catch (error) {
    console.error(`${colors.red}Error al buscar archivos en ${dir}:${colors.reset}`, error.message);
  }
});

console.log(`${colors.green}Encontrados ${allFiles.length} archivos para analizar${colors.reset}\n`);

// Buscar definiciones de tipos
const typeDefinitions = {};
const typeContents = {};

allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar definiciones de tipos e interfaces
    const typeRegex = /export\s+(type|interface)\s+(\w+)([^{]*{[^}]*}|[^=]*=[^;]*;)/g;
    let match;
    
    while ((match = typeRegex.exec(content)) !== null) {
      const typeName = match[2];
      const typeContent = match[0];
      
      if (!typeDefinitions[typeName]) {
        typeDefinitions[typeName] = [];
        typeContents[typeName] = [];
      }
      typeDefinitions[typeName].push(filePath);
      typeContents[typeName].push(typeContent);
    }
  } catch (error) {
    console.error(`${colors.red}Error al analizar tipos en ${filePath}:${colors.reset}`, error.message);
  }
});

// Identificar tipos duplicados
const duplicateTypes = Object.keys(typeDefinitions).filter(type => typeDefinitions[type].length > 1);

if (duplicateTypes.length > 0) {
  console.log(`${colors.yellow}Tipos duplicados encontrados:${colors.reset}`);
  
  duplicateTypes.forEach(type => {
    console.log(`  ${colors.magenta}${type}${colors.reset} definido en:`);
    typeDefinitions[type].forEach((file, index) => {
      console.log(`    ${colors.blue}${file}${colors.reset}: ${typeContents[type][index].substring(0, 100)}...`);
    });
  });
  
  // Consolidar tipos duplicados en types.ts
  console.log(`\n${colors.cyan}Consolidando tipos duplicados en types.ts...${colors.reset}`);
  
  // Leer types.ts
  const typesPath = 'src/lib/field-mapper/types.ts';
  let typesContent = '';
  
  try {
    typesContent = fs.readFileSync(typesPath, 'utf8');
  } catch (error) {
    console.error(`${colors.red}Error al leer types.ts:${colors.reset}`, error.message);
    return;
  }
  
  // Para cada tipo duplicado, verificar si ya está en types.ts
  duplicateTypes.forEach(type => {
    const typeRegex = new RegExp(`export\\s+(type|interface)\\s+${type}([^{]*{[^}]*}|[^=]*=[^;]*;)`, 'g');
    
    if (!typeRegex.test(typesContent)) {
      // Si no está en types.ts, añadirlo
      console.log(`  Añadiendo ${colors.magenta}${type}${colors.reset} a types.ts`);
      
      // Usar la primera definición encontrada
      const typeContent = typeContents[type][0];
      typesContent += `\n\n${typeContent}`;
      
      // Eliminar el tipo de los otros archivos
      typeDefinitions[type].forEach((file, index) => {
        if (file !== typesPath) {
          try {
            const fileContent = fs.readFileSync(file, 'utf8');
            const newContent = fileContent.replace(typeContents[type][index], 
              `// Tipo movido a types.ts\nimport { ${type} } from './types';`);
            
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`  Eliminado ${colors.magenta}${type}${colors.reset} de ${colors.blue}${file}${colors.reset}`);
          } catch (error) {
            console.error(`${colors.red}Error al actualizar ${file}:${colors.reset}`, error.message);
          }
        }
      });
    } else {
      console.log(`  ${colors.magenta}${type}${colors.reset} ya existe en types.ts`);
      
      // Eliminar el tipo de los otros archivos
      typeDefinitions[type].forEach((file, index) => {
        if (file !== typesPath) {
          try {
            const fileContent = fs.readFileSync(file, 'utf8');
            const newContent = fileContent.replace(typeContents[type][index], 
              `// Tipo movido a types.ts\nimport { ${type} } from './types';`);
            
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`  Eliminado ${colors.magenta}${type}${colors.reset} de ${colors.blue}${file}${colors.reset}`);
          } catch (error) {
            console.error(`${colors.red}Error al actualizar ${file}:${colors.reset}`, error.message);
          }
        }
      });
    }
  });
  
  // Guardar types.ts actualizado
  fs.writeFileSync(typesPath, typesContent, 'utf8');
  console.log(`${colors.green}types.ts actualizado con éxito${colors.reset}`);
} else {
  console.log(`${colors.green}No se encontraron tipos duplicados${colors.reset}`);
}

// Generar TYPE_COMPATIBILITY_MAP completo
console.log(`\n${colors.cyan}Generando TYPE_COMPATIBILITY_MAP completo...${colors.reset}`);

// Leer types.ts para obtener los tipos
let websiteFieldTypes = [];
let notionFieldTypes = [];

try {
  const typesContent = fs.readFileSync('src/lib/field-mapper/types.ts', 'utf8');
  
  // Extraer WebsiteFieldType
  const websiteFieldTypeMatch = typesContent.match(/export\s+type\s+WebsiteFieldType\s*=\s*([^;]+)/);
  if (websiteFieldTypeMatch) {
    const typeString = websiteFieldTypeMatch[1];
    websiteFieldTypes = typeString.match(/'[^']+'/g) || [];
    websiteFieldTypes = websiteFieldTypes.map(t => t.replace(/'/g, ''));
    
    console.log(`  Encontrados ${colors.yellow}${websiteFieldTypes.length}${colors.reset} tipos de Website:`);
    websiteFieldTypes.forEach(type => {
      console.log(`    ${colors.magenta}${type}${colors.reset}`);
    });
  } else {
    console.log(`${colors.red}No se pudo encontrar WebsiteFieldType en types.ts${colors.reset}`);
  }
  
  // Extraer NotionFieldType
  const notionFieldTypeMatch = typesContent.match(/export\s+type\s+NotionFieldType\s*=\s*([^;]+)/);
  if (notionFieldTypeMatch) {
    const typeString = notionFieldTypeMatch[1];
    notionFieldTypes = typeString.match(/'[^']+'/g) || [];
    notionFieldTypes = notionFieldTypes.map(t => t.replace(/'/g, ''));
    
    console.log(`\n  Encontrados ${colors.yellow}${notionFieldTypes.length}${colors.reset} tipos de Notion:`);
    notionFieldTypes.forEach(type => {
      console.log(`    ${colors.magenta}${type}${colors.reset}`);
    });
  } else {
    console.log(`${colors.red}No se pudo encontrar NotionFieldType en types.ts${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Error al analizar types.ts:${colors.reset}`, error.message);
}

// Generar el mapa de compatibilidad
if (websiteFieldTypes.length > 0 && notionFieldTypes.length > 0) {
  console.log(`\n${colors.cyan}Generando mapa de compatibilidad...${colors.reset}`);
  
  // Definir compatibilidades predeterminadas
  const defaultCompatibility = {
    'title': ['text', 'richText', 'string'],
    'richText': ['text', 'richText', 'string'],
    'number': ['number', 'string'],
    'select': ['select', 'string'],
    'multi_select': ['multiSelect', 'array'],
    'date': ['date', 'string'],
    'people': ['string', 'array'],
    'files': ['file', 'array'],
    'checkbox': ['boolean', 'string'],
    'url': ['url', 'string'],
    'email': ['email', 'string'],
    'phone_number': ['phone', 'string'],
    'formula': ['string', 'number', 'boolean', 'date'],
    'relation': ['reference', 'string', 'array'],
    'rollup': ['string', 'number', 'array'],
    'created_time': ['date', 'string'],
    'created_by': ['string'],
    'last_edited_time': ['date', 'string'],
    'last_edited_by': ['string'],
    'status': ['status', 'string']
  };
  
  // Generar el mapa
  let compatibilityMap = 'export const TYPE_COMPATIBILITY_MAP: Record<NotionFieldType, WebsiteFieldType[]> = {\n';
  
  notionFieldTypes.forEach(type => {
    const compatibleTypes = defaultCompatibility[type] || ['string'];
    // Filtrar para incluir solo tipos válidos de WebsiteFieldType
    const validTypes = compatibleTypes.filter(t => websiteFieldTypes.includes(t));
    
    compatibilityMap += `  '${type}': [${validTypes.map(t => `'${t}'`).join(', ')}],\n`;
  });
  
  compatibilityMap += '};\n';
  
  // Buscar validation.ts
  const validationPath = 'src/lib/field-mapper/validation.ts';
  
  try {
    let validationContent = fs.readFileSync(validationPath, 'utf8');
    
    // Verificar si ya existe TYPE_COMPATIBILITY_MAP
    const mapRegex = /export\s+const\s+TYPE_COMPATIBILITY_MAP\s*=\s*{[\s\S]+?\n\s*};/;
    
    if (mapRegex.test(validationContent)) {
      // Reemplazar el mapa existente
      validationContent = validationContent.replace(mapRegex, compatibilityMap);
      console.log(`  Reemplazando TYPE_COMPATIBILITY_MAP existente en ${colors.blue}${validationPath}${colors.reset}`);
    } else {
      // Añadir el mapa al final del archivo
      validationContent += `\n\n${compatibilityMap}`;
      console.log(`  Añadiendo TYPE_COMPATIBILITY_MAP a ${colors.blue}${validationPath}${colors.reset}`);
    }
    
    // Guardar el archivo actualizado
    fs.writeFileSync(validationPath, validationContent, 'utf8');
    console.log(`${colors.green}validation.ts actualizado con éxito${colors.reset}`);
    
    // Mostrar el mapa generado
    console.log(`\n${colors.yellow}TYPE_COMPATIBILITY_MAP generado:${colors.reset}`);
    console.log(compatibilityMap);
  } catch (error) {
    console.error(`${colors.red}Error al actualizar validation.ts:${colors.reset}`, error.message);
  }
} else {
  console.log(`${colors.red}No se pudo generar el mapa de compatibilidad${colors.reset}`);
}

// Guardar un informe de las correcciones
const reportOutput = `
# Informe de Consolidación de Tipos del Field Mapper

Fecha: ${new Date().toLocaleString()}

## Tipos duplicados

${duplicateTypes.length > 0 ? 
  duplicateTypes.map(type => {
    return `### ${type}
Definido en:
${typeDefinitions[type].map(file => `- ${file}`).join('\n')}

Acción: Consolidado en src/lib/field-mapper/types.ts`;
  }).join('\n\n') 
  : 'No se encontraron tipos duplicados'
}

## Tipos de Website

${websiteFieldTypes.length > 0 ? 
  websiteFieldTypes.map(type => `- ${type}`).join('\n') 
  : 'No se pudieron encontrar tipos de Website'
}

## Tipos de Notion

${notionFieldTypes.length > 0 ? 
  notionFieldTypes.map(type => `- ${type}`).join('\n') 
  : 'No se pudieron encontrar tipos de Notion'
}

## TYPE_COMPATIBILITY_MAP

\`\`\`typescript
${websiteFieldTypes.length > 0 && notionFieldTypes.length > 0 ? 
  (() => {
    const defaultCompatibility = {
      'title': ['text', 'richText', 'string'],
      'richText': ['text', 'richText', 'string'],
      'number': ['number', 'string'],
      'select': ['select', 'string'],
      'multi_select': ['multiSelect', 'array'],
      'date': ['date', 'string'],
      'people': ['string', 'array'],
      'files': ['file', 'array'],
      'checkbox': ['boolean', 'string'],
      'url': ['url', 'string'],
      'email': ['email', 'string'],
      'phone_number': ['phone', 'string'],
      'formula': ['string', 'number', 'boolean', 'date'],
      'relation': ['reference', 'string', 'array'],
      'rollup': ['string', 'number', 'array'],
      'created_time': ['date', 'string'],
      'created_by': ['string'],
      'last_edited_time': ['date', 'string'],
      'last_edited_by': ['string'],
      'status': ['status', 'string']
    };
    
    let compatibilityMap = 'export const TYPE_COMPATIBILITY_MAP: Record<NotionFieldType, WebsiteFieldType[]> = {\n';
    
    notionFieldTypes.forEach(type => {
      const compatibleTypes = defaultCompatibility[type] || ['string'];
      const validTypes = compatibleTypes.filter(t => websiteFieldTypes.includes(t));
      
      compatibilityMap += `  '${type}': [${validTypes.map(t => `'${t}'`).join(', ')}],\n`;
    });
    
    compatibilityMap += '};';
    
    return compatibilityMap;
  })() 
  : 'No se pudo generar el mapa de compatibilidad'
}
\`\`\`

## Próximos pasos recomendados

1. Revisar los archivos con uso de 'any' y reemplazarlos con tipos específicos
2. Verificar el manejo de null/undefined en los archivos con más ocurrencias
3. Ejecutar las pruebas para verificar que las correcciones no han introducido errores
4. Revisar y ajustar el TYPE_COMPATIBILITY_MAP según las necesidades específicas del proyecto
`;

fs.writeFileSync('field-mapper-types-consolidation-report.md', reportOutput);
console.log(`\n${colors.green}Informe guardado en field-mapper-types-consolidation-report.md${colors.reset}`);
