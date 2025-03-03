#!/usr/bin/env node

/**
 * Script para analizar errores de TypeScript en el proyecto
 * 
 * Este script ejecuta el compilador de TypeScript y analiza los errores
 * para agruparlos por tipo y archivo, facilitando su resolución.
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

console.log(`${colors.cyan}Analizando errores de TypeScript...${colors.reset}\n`);

try {
  // Ejecutar tsc y capturar la salida
  const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log(`${colors.green}¡No se encontraron errores!${colors.reset}`);
} catch (error) {
  // Analizar la salida de error
  const errorOutput = error.stdout;
  
  // Expresión regular para extraer información de los errores
  const errorRegex = /(.+\.tsx?):(\d+):(\d+) - error TS(\d+): (.+)/g;
  
  // Almacenar errores por archivo y por código
  const errorsByFile = {};
  const errorsByCode = {};
  let totalErrors = 0;
  
  let match;
  while ((match = errorRegex.exec(errorOutput)) !== null) {
    totalErrors++;
    const [, filePath, line, column, errorCode, errorMessage] = match;
    
    // Normalizar la ruta del archivo
    const normalizedPath = filePath.replace(/^\.\//, '');
    
    // Agrupar por archivo
    if (!errorsByFile[normalizedPath]) {
      errorsByFile[normalizedPath] = [];
    }
    errorsByFile[normalizedPath].push({
      line: parseInt(line),
      column: parseInt(column),
      code: errorCode,
      message: errorMessage
    });
    
    // Agrupar por código de error
    if (!errorsByCode[errorCode]) {
      errorsByCode[errorCode] = [];
    }
    errorsByCode[errorCode].push({
      file: normalizedPath,
      line: parseInt(line),
      column: parseInt(column),
      message: errorMessage
    });
  }
  
  // Mostrar resumen
  console.log(`${colors.red}Se encontraron ${totalErrors} errores${colors.reset}\n`);
  
  // Mostrar errores por archivo
  console.log(`${colors.cyan}=== Errores por archivo ===${colors.reset}`);
  Object.keys(errorsByFile).sort().forEach(file => {
    const errors = errorsByFile[file];
    console.log(`\n${colors.yellow}${file}${colors.reset} (${errors.length} errores)`);
    
    errors.forEach(error => {
      console.log(`  ${colors.magenta}Línea ${error.line}:${error.column}${colors.reset} - TS${error.code}: ${error.message}`);
    });
  });
  
  // Mostrar errores por código
  console.log(`\n\n${colors.cyan}=== Errores por código ===${colors.reset}`);
  Object.keys(errorsByCode).sort().forEach(code => {
    const errors = errorsByCode[code];
    console.log(`\n${colors.yellow}TS${code}${colors.reset} (${errors.length} ocurrencias)`);
    
    // Mostrar el primer error como ejemplo
    const firstError = errors[0];
    console.log(`  Ejemplo: ${colors.magenta}${firstError.file}:${firstError.line}${colors.reset} - ${firstError.message}`);
    
    // Listar los archivos afectados
    console.log(`  Archivos afectados:`);
    const affectedFiles = {};
    errors.forEach(error => {
      if (!affectedFiles[error.file]) {
        affectedFiles[error.file] = 0;
      }
      affectedFiles[error.file]++;
    });
    
    Object.keys(affectedFiles).sort().forEach(file => {
      console.log(`    ${colors.blue}${file}${colors.reset} (${affectedFiles[file]} ocurrencias)`);
    });
  });
  
  // Sugerencias para errores comunes
  console.log(`\n\n${colors.cyan}=== Sugerencias para errores comunes ===${colors.reset}`);
  
  if (errorsByCode['2339']) {
    console.log(`\n${colors.yellow}TS2339 (Property does not exist)${colors.reset}`);
    console.log(`  - Verifica que estás accediendo a propiedades que existen en el tipo.`);
    console.log(`  - Usa type guards (if (objeto && 'propiedad' in objeto)) para verificar la existencia.`);
    console.log(`  - Considera usar tipos más específicos en lugar de 'any'.`);
  }
  
  if (errorsByCode['2322']) {
    console.log(`\n${colors.yellow}TS2322 (Type is not assignable)${colors.reset}`);
    console.log(`  - Asegúrate de que los tipos coincidan en las asignaciones.`);
    console.log(`  - Usa type assertions (as) con precaución cuando estés seguro.`);
    console.log(`  - Considera revisar las definiciones de interfaces/tipos.`);
  }
  
  if (errorsByCode['2345']) {
    console.log(`\n${colors.yellow}TS2345 (Argument not assignable to parameter)${colors.reset}`);
    console.log(`  - Verifica los tipos de los argumentos que pasas a las funciones.`);
    console.log(`  - Asegúrate de que los objetos tienen todas las propiedades requeridas.`);
  }
  
  if (errorsByCode['7053']) {
    console.log(`\n${colors.yellow}TS7053 (Element implicitly has 'any' type)${colors.reset}`);
    console.log(`  - Verifica que estás usando el tipo correcto como índice.`);
    console.log(`  - Asegúrate de que la propiedad existe en el tipo indexado.`);
    console.log(`  - Considera usar Record<K, V> para mapeos de tipos.`);
  }
  
  // Guardar el análisis en un archivo
  const analysisOutput = `
# Análisis de Errores de TypeScript

Fecha: ${new Date().toLocaleString()}
Total de errores: ${totalErrors}

## Errores por archivo

${Object.keys(errorsByFile).sort().map(file => {
  const errors = errorsByFile[file];
  return `### ${file} (${errors.length} errores)
${errors.map(error => `- **Línea ${error.line}:${error.column}** - TS${error.code}: ${error.message}`).join('\n')}
`;
}).join('\n')}

## Errores por código

${Object.keys(errorsByCode).sort().map(code => {
  const errors = errorsByCode[code];
  return `### TS${code} (${errors.length} ocurrencias)
Ejemplo: ${errors[0].file}:${errors[0].line} - ${errors[0].message}

Archivos afectados:
${Object.keys(errors.reduce((acc, error) => {
  acc[error.file] = (acc[error.file] || 0) + 1;
  return acc;
}, {})).sort().map(file => `- ${file}`).join('\n')}
`;
}).join('\n')}
`;

  fs.writeFileSync('typescript-errors-analysis.md', analysisOutput);
  console.log(`\n${colors.green}Análisis guardado en typescript-errors-analysis.md${colors.reset}`);
}
