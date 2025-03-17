#!/usr/bin/env node

/**
 * Script para analizar la calidad de tipos en el proyecto
 * 
 * Este script realiza un análisis estático del código TypeScript para identificar:
 * - Uso implícito de 'any'
 * - Posibles errores de null/undefined
 * - Inconsistencias en nombres de tipos
 * - Funciones sin tipo de retorno explícito
 * 
 * Uso: node scripts/analyze-types.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk') || { red: (s) => `\x1b[31m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, blue: (s) => `\x1b[34m${s}\x1b[0m`, gray: (s) => `\x1b[90m${s}\x1b[0m` };

// Configuración
const SRC_DIR = path.join(__dirname, '..', 'src');
const TYPE_PATTERNS = {
  implicitAny: /(?:function|const|let|var)\s+(\w+)(?!\s*:\s*\w+)/g,
  inconsistentNaming: /(?:interface|type)\s+(\w+)(?:_\w+|\w+_)/g,
  nullChecks: /(\w+)(?:\?\.|\!\.|\.)\w+/g,
  missingReturnType: /(?:function|const|let|var)\s+(\w+)\s*=\s*(?:\(.*?\)|async\s*\(.*?\))\s*(?:=>|{)(?!\s*:\s*\w+)/g,
};

// Contadores
const stats = {
  totalFiles: 0,
  implicitAny: 0,
  inconsistentNaming: 0,
  nullChecks: 0,
  missingReturnType: 0,
  filesWith: {
    implicitAny: new Set(),
    inconsistentNaming: new Set(),
    nullChecks: new Set(),
    missingReturnType: new Set(),
  }
};

// Resultados detallados
const details = {
  implicitAny: [],
  inconsistentNaming: [],
  nullChecks: [],
  missingReturnType: [],
};

/**
 * Analiza un archivo en busca de patrones problemáticos
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    let fileHasIssues = false;
    
    // Buscar patrones
    for (const [patternName, pattern] of Object.entries(TYPE_PATTERNS)) {
      let match;
      pattern.lastIndex = 0; // Resetear el índice
      
      while ((match = pattern.exec(content)) !== null) {
        // Ignorar falsos positivos en comentarios
        const lineStart = content.lastIndexOf('\n', match.index) + 1;
        const lineEnd = content.indexOf('\n', match.index);
        const line = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);
        
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue;
        }
        
        // Registrar el problema
        stats[patternName]++;
        stats.filesWith[patternName].add(relativePath);
        details[patternName].push({
          file: relativePath,
          line: content.substring(0, match.index).split('\n').length,
          context: line.trim(),
          match: match[0],
        });
        
        fileHasIssues = true;
      }
    }
    
    if (fileHasIssues) {
      stats.totalFiles++;
    }
  } catch (error) {
    console.error(`Error al analizar ${filePath}:`, error.message);
  }
}

/**
 * Recorre recursivamente un directorio
 */
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ignorar node_modules y .next
      if (file !== 'node_modules' && file !== '.next') {
        traverseDirectory(fullPath);
      }
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      analyzeFile(fullPath);
    }
  }
}

/**
 * Imprime un resumen de los resultados
 */
function printSummary() {
  console.log('\n' + chalk.blue('=== ANÁLISIS DE TIPOS TYPESCRIPT ==='));
  console.log(chalk.blue(`Archivos con problemas: ${stats.totalFiles}`));
  console.log('\n' + chalk.yellow('RESUMEN DE PROBLEMAS:'));
  console.log(chalk.yellow(`- Posibles 'any' implícitos: ${stats.implicitAny} (en ${stats.filesWith.implicitAny.size} archivos)`));
  console.log(chalk.yellow(`- Nombres de tipos inconsistentes: ${stats.inconsistentNaming} (en ${stats.filesWith.inconsistentNaming.size} archivos)`));
  console.log(chalk.yellow(`- Posibles errores de null/undefined: ${stats.nullChecks} (en ${stats.filesWith.nullChecks.size} archivos)`));
  console.log(chalk.yellow(`- Funciones sin tipo de retorno: ${stats.missingReturnType} (en ${stats.filesWith.missingReturnType.size} archivos)`));
  
  // Imprimir detalles si hay problemas
  if (stats.implicitAny > 0) {
    console.log('\n' + chalk.red('DETALLES DE POSIBLES ANY IMPLÍCITOS:'));
    details.implicitAny.slice(0, 10).forEach(item => {
      console.log(chalk.gray(`${item.file}:${item.line} - ${item.context}`));
    });
    if (details.implicitAny.length > 10) {
      console.log(chalk.gray(`... y ${details.implicitAny.length - 10} más`));
    }
  }
  
  if (stats.inconsistentNaming > 0) {
    console.log('\n' + chalk.red('DETALLES DE NOMBRES INCONSISTENTES:'));
    details.inconsistentNaming.slice(0, 10).forEach(item => {
      console.log(chalk.gray(`${item.file}:${item.line} - ${item.context}`));
    });
    if (details.inconsistentNaming.length > 10) {
      console.log(chalk.gray(`... y ${details.inconsistentNaming.length - 10} más`));
    }
  }
  
  // Ejecutar tsc para obtener errores de compilación
  try {
    console.log('\n' + chalk.blue('EJECUTANDO VERIFICACIÓN DE TIPOS CON TSC...'));
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log(chalk.green('✓ No se encontraron errores de tipo con tsc'));
  } catch (error) {
    // tsc ya imprime los errores
    console.log(chalk.red('× Se encontraron errores de tipo con tsc'));
  }
  
  // Recomendaciones
  console.log('\n' + chalk.blue('RECOMENDACIONES:'));
  if (stats.implicitAny > 0) {
    console.log(chalk.yellow('- Añade tipos explícitos a variables y parámetros de funciones'));
  }
  if (stats.inconsistentNaming > 0) {
    console.log(chalk.yellow('- Estandariza los nombres de tipos (usa camelCase o PascalCase consistentemente)'));
  }
  if (stats.nullChecks > 0) {
    console.log(chalk.yellow('- Revisa el manejo de null/undefined y considera usar operadores de encadenamiento opcional'));
  }
  if (stats.missingReturnType > 0) {
    console.log(chalk.yellow('- Añade tipos de retorno explícitos a las funciones'));
  }
}

// Ejecutar el análisis
console.log(chalk.blue('Analizando tipos en el código TypeScript...'));
traverseDirectory(SRC_DIR);
printSummary();

// Guardar resultados en un archivo para referencia
const outputFile = path.join(__dirname, 'type-analysis-results.json');
fs.writeFileSync(outputFile, JSON.stringify({
  stats,
  details,
  timestamp: new Date().toISOString(),
}, null, 2));

console.log(chalk.blue(`\nResultados detallados guardados en ${outputFile}`));
