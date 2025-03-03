#!/usr/bin/env node

/**
 * Script para corregir problemas comunes en el Field Mapper
 * 
 * Este script corrige automáticamente algunos de los problemas
 * identificados en el análisis del Field Mapper.
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

console.log(`${colors.cyan}Iniciando corrección automática de problemas en el Field Mapper...${colors.reset}\n`);

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

console.log(`${colors.green}Encontrados ${allFiles.length} archivos para procesar${colors.reset}\n`);

// Correcciones a realizar
const fixes = [
  {
    name: 'Unificar rich_text a richText',
    find: /'rich_text'|"rich_text"/g,
    replace: "'richText'",
    description: 'Cambiando rich_text a richText para unificar nombres de tipos'
  },
  {
    name: 'Corregir importaciones de FieldMapping',
    find: /import\s+\{\s*FieldMapping\s*\}\s*from\s+['"]\.\/store['"]/g,
    replace: "import { FieldMapping } from './types'",
    description: 'Corrigiendo importaciones de FieldMapping desde store.ts a types.ts'
  },
  {
    name: 'Corregir typeof para tipos de array',
    find: /typeof\s+(\w+)\[\]/g,
    replace: (match, typeName) => `${typeName}[]`,
    description: 'Eliminando uso innecesario de typeof para tipos de array'
  }
];

// Estadísticas de correcciones
const stats = {
  filesModified: 0,
  totalChanges: 0,
  changesByFix: {}
};

fixes.forEach(fix => {
  stats.changesByFix[fix.name] = {
    count: 0,
    files: []
  };
});

// Procesar cada archivo
allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileModified = false;
    
    // Aplicar cada corrección
    fixes.forEach(fix => {
      const matches = content.match(fix.find);
      
      if (matches && matches.length > 0) {
        newContent = newContent.replace(fix.find, fix.replace);
        stats.changesByFix[fix.name].count += matches.length;
        if (!stats.changesByFix[fix.name].files.includes(filePath)) {
          stats.changesByFix[fix.name].files.push(filePath);
        }
        fileModified = true;
        console.log(`  ${colors.yellow}${filePath}${colors.reset}: ${fix.description} (${matches.length} ocurrencias)`);
      }
    });
    
    // Guardar el archivo si se modificó
    if (fileModified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      stats.filesModified++;
      stats.totalChanges += fixes.reduce((sum, fix) => {
        const matchCount = (content.match(fix.find) || []).length;
        return sum + matchCount;
      }, 0);
    }
  } catch (error) {
    console.error(`${colors.red}Error al procesar ${filePath}:${colors.reset}`, error.message);
  }
});

// Mostrar estadísticas
console.log(`\n${colors.cyan}=== Resumen de correcciones ===${colors.reset}`);
console.log(`${colors.green}Archivos modificados: ${stats.filesModified}${colors.reset}`);
console.log(`${colors.green}Total de cambios: ${stats.totalChanges}${colors.reset}\n`);

Object.keys(stats.changesByFix).forEach(fixName => {
  const fixStats = stats.changesByFix[fixName];
  console.log(`${colors.yellow}${fixName}${colors.reset}: ${fixStats.count} correcciones en ${fixStats.files.length} archivos`);
  
  if (fixStats.files.length > 0) {
    console.log(`  Archivos afectados:`);
    fixStats.files.forEach(file => {
      console.log(`    ${colors.blue}${file}${colors.reset}`);
    });
  }
});

// Verificar si hay tipos duplicados
console.log(`\n${colors.cyan}=== Verificando tipos duplicados ===${colors.reset}`);

// Buscar definiciones de tipos
const typeDefinitions = {};
allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar definiciones de tipos e interfaces
    const typeRegex = /export\s+(type|interface)\s+(\w+)/g;
    let match;
    
    while ((match = typeRegex.exec(content)) !== null) {
      const typeName = match[2];
      
      if (!typeDefinitions[typeName]) {
        typeDefinitions[typeName] = [];
      }
      typeDefinitions[typeName].push(filePath);
    }
  } catch (error) {
    console.error(`${colors.red}Error al analizar tipos en ${filePath}:${colors.reset}`, error.message);
  }
});

// Identificar tipos definidos en múltiples archivos
const duplicateTypes = Object.keys(typeDefinitions).filter(type => typeDefinitions[type].length > 1);

if (duplicateTypes.length > 0) {
  console.log(`${colors.yellow}Se encontraron tipos duplicados:${colors.reset}`);
  
  duplicateTypes.forEach(type => {
    console.log(`  ${colors.magenta}${type}${colors.reset} definido en:`);
    typeDefinitions[type].forEach(file => {
      console.log(`    ${colors.blue}${file}${colors.reset}`);
    });
  });
  
  console.log(`\n${colors.yellow}Recomendación:${colors.reset} Consolidar estos tipos en src/lib/field-mapper/types.ts`);
} else {
  console.log(`${colors.green}No se encontraron tipos duplicados${colors.reset}`);
}

// Verificar TYPE_COMPATIBILITY_MAP
console.log(`\n${colors.cyan}=== Verificando TYPE_COMPATIBILITY_MAP ===${colors.reset}`);

// Buscar definiciones de tipos en types.ts
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
  }
  
  // Extraer NotionFieldType
  const notionFieldTypeMatch = typesContent.match(/export\s+type\s+NotionFieldType\s*=\s*([^;]+)/);
  if (notionFieldTypeMatch) {
    const typeString = notionFieldTypeMatch[1];
    notionFieldTypes = typeString.match(/'[^']+'/g) || [];
    notionFieldTypes = notionFieldTypes.map(t => t.replace(/'/g, ''));
  }
} catch (error) {
  console.error(`${colors.red}Error al analizar types.ts:${colors.reset}`, error.message);
}

// Buscar TYPE_COMPATIBILITY_MAP en validation.ts
try {
  const validationContent = fs.readFileSync('src/lib/field-mapper/validation.ts', 'utf8');
  
  // Extraer TYPE_COMPATIBILITY_MAP
  const mapMatch = validationContent.match(/export\s+const\s+TYPE_COMPATIBILITY_MAP\s*=\s*({[\s\S]+?\n\s*})/);
  if (mapMatch) {
    const mapString = mapMatch[1];
    
    console.log(`${colors.yellow}Verificando cobertura de TYPE_COMPATIBILITY_MAP:${colors.reset}`);
    
    // Verificar que todos los tipos de Notion tienen una entrada
    const missingNotionTypes = notionFieldTypes.filter(type => !mapString.includes(`'${type}':`));
    if (missingNotionTypes.length > 0) {
      console.log(`  ${colors.red}Tipos de Notion sin entrada en el mapa:${colors.reset}`);
      missingNotionTypes.forEach(type => {
        console.log(`    ${colors.magenta}${type}${colors.reset}`);
      });
    } else {
      console.log(`  ${colors.green}Todos los tipos de Notion tienen entrada en el mapa${colors.reset}`);
    }
    
    // Verificar que todos los tipos de Website están cubiertos
    const websiteTypesInMap = [];
    const typeEntryRegex = /'[^']+'\s*:\s*\[\s*([^\]]+)\s*\]/g;
    let entryMatch;
    while ((entryMatch = typeEntryRegex.exec(mapString)) !== null) {
      const compatibleTypes = entryMatch[1];
      const types = compatibleTypes.match(/'[^']+'/g) || [];
      types.forEach(t => {
        const type = t.replace(/'/g, '');
        if (!websiteTypesInMap.includes(type)) {
          websiteTypesInMap.push(type);
        }
      });
    }
    
    const missingWebsiteTypes = websiteFieldTypes.filter(type => !websiteTypesInMap.includes(type));
    if (missingWebsiteTypes.length > 0) {
      console.log(`  ${colors.red}Tipos de Website no cubiertos en el mapa:${colors.reset}`);
      missingWebsiteTypes.forEach(type => {
        console.log(`    ${colors.magenta}${type}${colors.reset}`);
      });
    } else {
      console.log(`  ${colors.green}Todos los tipos de Website están cubiertos en el mapa${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}No se pudo encontrar TYPE_COMPATIBILITY_MAP en validation.ts${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Error al analizar validation.ts:${colors.reset}`, error.message);
}

// Guardar un informe de las correcciones
const reportOutput = `
# Informe de Correcciones del Field Mapper

Fecha: ${new Date().toLocaleString()}

## Resumen de correcciones
- Archivos modificados: ${stats.filesModified}
- Total de cambios: ${stats.totalChanges}

${Object.keys(stats.changesByFix).map(fixName => {
  const fixStats = stats.changesByFix[fixName];
  return `### ${fixName}
${fixStats.count} correcciones en ${fixStats.files.length} archivos

${fixStats.files.length > 0 ? `Archivos afectados:
${fixStats.files.map(file => `- ${file}`).join('\n')}` : 'Ningún archivo afectado'}
`;
}).join('\n')}

## Tipos duplicados
${duplicateTypes.length > 0 ? 
  duplicateTypes.map(type => {
    return `### ${type}
Definido en:
${typeDefinitions[type].map(file => `- ${file}`).join('\n')}`;
  }).join('\n\n') 
  : 'No se encontraron tipos duplicados'
}

## Verificación de TYPE_COMPATIBILITY_MAP
${notionFieldTypes.length > 0 && websiteFieldTypes.length > 0 ? `
### Tipos de Notion sin entrada en el mapa
${notionFieldTypes.filter(type => {
  try {
    const validationContent = fs.readFileSync('src/lib/field-mapper/validation.ts', 'utf8');
    const mapMatch = validationContent.match(/export\s+const\s+TYPE_COMPATIBILITY_MAP\s*=\s*({[\s\S]+?\n\s*})/);
    if (mapMatch) {
      return !mapMatch[1].includes(`'${type}':`);
    }
    return true;
  } catch (error) {
    return true;
  }
}).map(type => `- ${type}`).join('\n') || 'Todos los tipos tienen entrada'}

### Tipos de Website no cubiertos en el mapa
${(() => {
  try {
    const validationContent = fs.readFileSync('src/lib/field-mapper/validation.ts', 'utf8');
    const mapMatch = validationContent.match(/export\s+const\s+TYPE_COMPATIBILITY_MAP\s*=\s*({[\s\S]+?\n\s*})/);
    if (mapMatch) {
      const mapString = mapMatch[1];
      const websiteTypesInMap = [];
      const typeEntryRegex = /'[^']+'\s*:\s*\[\s*([^\]]+)\s*\]/g;
      let entryMatch;
      while ((entryMatch = typeEntryRegex.exec(mapString)) !== null) {
        const compatibleTypes = entryMatch[1];
        const types = compatibleTypes.match(/'[^']+'/g) || [];
        types.forEach(t => {
          const type = t.replace(/'/g, '');
          if (!websiteTypesInMap.includes(type)) {
            websiteTypesInMap.push(type);
          }
        });
      }
      
      const missingWebsiteTypes = websiteFieldTypes.filter(type => !websiteTypesInMap.includes(type));
      return missingWebsiteTypes.map(type => `- ${type}`).join('\n') || 'Todos los tipos están cubiertos';
    }
    return 'No se pudo analizar el mapa';
  } catch (error) {
    return 'Error al analizar el mapa';
  }
})()}
` : 'No se pudieron analizar los tipos'}

## Próximos pasos recomendados

1. Revisar los archivos con uso de 'any' y reemplazarlos con tipos específicos
2. Verificar el manejo de null/undefined en los archivos con más ocurrencias
3. Consolidar los tipos duplicados en src/lib/field-mapper/types.ts
4. Completar TYPE_COMPATIBILITY_MAP con los tipos faltantes
5. Ejecutar las pruebas para verificar que las correcciones no han introducido errores
`;

fs.writeFileSync('field-mapper-fixes-report.md', reportOutput);
console.log(`\n${colors.green}Informe guardado en field-mapper-fixes-report.md${colors.reset}`);
