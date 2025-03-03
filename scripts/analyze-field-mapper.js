#!/usr/bin/env node

/**
 * Script para analizar los archivos del Field Mapper
 * 
 * Este script examina los archivos relacionados con el Field Mapper,
 * buscando inconsistencias en tipos, importaciones y posibles problemas.
 */

'use strict';

const fs = require('fs');
const childProcess = require('child_process');

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

// Patrones a buscar
const patterns = [
  { 
    name: 'Importaciones de tipos desde store.ts', 
    regex: /import.*\bFieldMapping\b.*from ['"]\.\/store['"]/g,
    suggestion: 'Importar tipos desde ./types en lugar de ./store'
  },
  { 
    name: 'Uso de typeof para tipos', 
    regex: /typeof\s+\w+\[\]/g,
    suggestion: 'Usar el tipo directamente en lugar de typeof Type[]'
  },
  { 
    name: 'Uso de any', 
    regex: /\bany\b/g,
    suggestion: 'Reemplazar any con tipos específicos'
  },
  { 
    name: 'Posibles errores de null/undefined', 
    regex: /(\w+)\?\.|\?\s*(\w+)|\w+\s*!\./g,
    suggestion: 'Verificar manejo de null/undefined'
  },
  { 
    name: 'Inconsistencia en nombres de tipos', 
    regex: /rich_text|richText/g,
    suggestion: 'Unificar el uso de rich_text y richText'
  },
  { 
    name: 'Posibles errores en TYPE_COMPATIBILITY_MAP', 
    regex: /TYPE_COMPATIBILITY_MAP/g,
    suggestion: 'Verificar que TYPE_COMPATIBILITY_MAP tiene todas las entradas necesarias'
  }
];

console.log(`${colors.cyan}Analizando archivos del Field Mapper...${colors.reset}\n`);

// Encontrar todos los archivos TypeScript en los directorios especificados
let allFiles = [];
directories.forEach(dir => {
  try {
    const output = childProcess.execSync(`find ${dir} -type f -name "*.ts" -o -name "*.tsx"`, { encoding: 'utf8' });
    allFiles = allFiles.concat(output.trim().split('\n').filter(Boolean));
  } catch (error) {
    console.error(`${colors.red}Error al buscar archivos en ${dir}:${colors.reset}`, error.message);
  }
});

console.log(`${colors.green}Encontrados ${allFiles.length} archivos para analizar${colors.reset}\n`);

// Resultados por archivo y por patrón
const resultsByFile = {};
const resultsByPattern = {};

// Analizar cada archivo
allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileResults = [];
    
    // Buscar cada patrón en el contenido del archivo
    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex) || [];
      
      if (matches.length > 0) {
        fileResults.push({
          pattern: pattern.name,
          matches: matches.length,
          suggestion: pattern.suggestion
        });
        
        // Agregar a resultados por patrón
        if (!resultsByPattern[pattern.name]) {
          resultsByPattern[pattern.name] = [];
        }
        resultsByPattern[pattern.name].push({
          file: filePath,
          matches: matches.length
        });
      }
    });
    
    if (fileResults.length > 0) {
      resultsByFile[filePath] = fileResults;
    }
  } catch (error) {
    console.error(`${colors.red}Error al analizar ${filePath}:${colors.reset}`, error.message);
  }
});

// Mostrar resultados por archivo
console.log(`${colors.cyan}=== Resultados por archivo ===${colors.reset}`);
Object.keys(resultsByFile).sort().forEach(file => {
  const results = resultsByFile[file];
  console.log(`\n${colors.yellow}${file}${colors.reset}`);
  
  results.forEach(result => {
    console.log(`  ${colors.magenta}${result.pattern}${colors.reset}: ${result.matches} coincidencias`);
    console.log(`    Sugerencia: ${result.suggestion}`);
  });
});

// Mostrar resultados por patrón
console.log(`\n\n${colors.cyan}=== Resultados por patrón ===${colors.reset}`);
Object.keys(resultsByPattern).sort().forEach(patternName => {
  const results = resultsByPattern[patternName];
  const totalMatches = results.reduce((sum, result) => sum + result.matches, 0);
  
  console.log(`\n${colors.yellow}${patternName}${colors.reset} (${totalMatches} coincidencias totales)`);
  console.log(`  Archivos afectados:`);
  
  results.sort((a, b) => b.matches - a.matches).forEach(result => {
    console.log(`    ${colors.blue}${result.file}${colors.reset}: ${result.matches} coincidencias`);
  });
  
  // Mostrar la sugerencia
  const suggestion = patterns.find(p => p.name === patternName).suggestion;
  console.log(`  Sugerencia: ${suggestion}`);
});

// Buscar dependencias entre archivos
console.log(`\n\n${colors.cyan}=== Análisis de dependencias ===${colors.reset}`);

const dependencies = {};
allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Solo considerar importaciones relativas al proyecto
      if (importPath.startsWith('./') || importPath.startsWith('../') || importPath.startsWith('@/')) {
        imports.push(importPath);
      }
    }
    
    if (imports.length > 0) {
      dependencies[filePath] = imports;
    }
  } catch (error) {
    console.error(`${colors.red}Error al analizar dependencias en ${filePath}:${colors.reset}`, error.message);
  }
});

// Identificar posibles ciclos de dependencia
console.log(`\n${colors.yellow}Posibles ciclos de dependencia:${colors.reset}`);
let cyclesFound = false;

Object.keys(dependencies).forEach(file => {
  const imports = dependencies[file];
  
  imports.forEach(importPath => {
    // Convertir la ruta de importación a una ruta de archivo
    let resolvedPath = importPath;
    
    if (importPath.startsWith('@/')) {
      resolvedPath = importPath.replace('@/', 'src/');
    } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
      resolvedPath = require('path').resolve(require('path').dirname(file), importPath);
    }
    
    // Verificar si hay un ciclo
    if (resolvedPath.endsWith('.ts') || resolvedPath.endsWith('.tsx')) {
      // Ya es una ruta de archivo
    } else {
      // Intentar resolver a un archivo
      ['', '.ts', '.tsx', '/index.ts', '/index.tsx'].forEach(ext => {
        const testPath = resolvedPath + ext;
        if (fs.existsSync(testPath) && dependencies[testPath] && dependencies[testPath].some(dep => {
          const depResolved = require('path').resolve(require('path').dirname(testPath), dep);
          return depResolved === file || depResolved.startsWith(file);
        })) {
          console.log(`  ${colors.red}Ciclo detectado:${colors.reset} ${file} -> ${testPath} -> ${file}`);
          cyclesFound = true;
        }
      });
    }
  });
});

if (!cyclesFound) {
  console.log(`  ${colors.green}No se detectaron ciclos de dependencia${colors.reset}`);
}

// Analizar el uso de tipos
console.log(`\n${colors.yellow}Análisis de tipos:${colors.reset}`);

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
  console.log(`  ${colors.red}Tipos definidos en múltiples archivos:${colors.reset}`);
  
  duplicateTypes.forEach(type => {
    console.log(`    ${colors.magenta}${type}${colors.reset} definido en:`);
    typeDefinitions[type].forEach(file => {
      console.log(`      ${colors.blue}${file}${colors.reset}`);
    });
  });
} else {
  console.log(`  ${colors.green}No se encontraron tipos duplicados${colors.reset}`);
}

// Guardar el análisis en un archivo
const analysisOutput = `
# Análisis del Field Mapper

Fecha: ${new Date().toLocaleString()}
Archivos analizados: ${allFiles.length}

## Resultados por archivo

${Object.keys(resultsByFile).sort().map(file => {
  const results = resultsByFile[file];
  return `### ${file}
${results.map(result => `- **${result.pattern}**: ${result.matches} coincidencias
  - Sugerencia: ${result.suggestion}`).join('\n')}
`;
}).join('\n')}

## Resultados por patrón

${Object.keys(resultsByPattern).sort().map(patternName => {
  const results = resultsByPattern[patternName];
  const totalMatches = results.reduce((sum, result) => sum + result.matches, 0);
  const suggestion = patterns.find(p => p.name === patternName).suggestion;
  
  return `### ${patternName} (${totalMatches} coincidencias totales)
Sugerencia: ${suggestion}

Archivos afectados:
${results.sort((a, b) => b.matches - a.matches).map(result => `- ${result.file}: ${result.matches} coincidencias`).join('\n')}
`;
}).join('\n')}

## Análisis de dependencias

### Posibles ciclos de dependencia
${cyclesFound ? 
  Object.keys(dependencies).map(file => {
    const imports = dependencies[file];
    return imports.map(importPath => {
      let resolvedPath = importPath;
      if (importPath.startsWith('@/')) {
        resolvedPath = importPath.replace('@/', 'src/');
      } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
        resolvedPath = require('path').resolve(require('path').dirname(file), importPath);
      }
      
      if (resolvedPath.endsWith('.ts') || resolvedPath.endsWith('.tsx')) {
        // Ya es una ruta de archivo
      } else {
        // Intentar resolver a un archivo
        ['', '.ts', '.tsx', '/index.ts', '/index.tsx'].forEach(ext => {
          const testPath = resolvedPath + ext;
          if (fs.existsSync(testPath) && dependencies[testPath] && dependencies[testPath].some(dep => {
            const depResolved = require('path').resolve(require('path').dirname(testPath), dep);
            return depResolved === file || depResolved.startsWith(file);
          })) {
            return `- Ciclo detectado: ${file} -> ${testPath} -> ${file}`;
          }
        });
      }
      return null;
    }).filter(Boolean).join('\n');
  }).filter(Boolean).join('\n') 
  : '- No se detectaron ciclos de dependencia'
}

### Tipos definidos en múltiples archivos
${duplicateTypes.length > 0 ? 
  duplicateTypes.map(type => {
    return `#### ${type}
Definido en:
${typeDefinitions[type].map(file => `- ${file}`).join('\n')}`;
  }).join('\n\n') 
  : '- No se encontraron tipos duplicados'
}
`;

fs.writeFileSync('field-mapper-analysis.md', analysisOutput);
console.log(`\n${colors.green}Análisis guardado en field-mapper-analysis.md${colors.reset}`);
