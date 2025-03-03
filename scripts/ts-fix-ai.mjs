/**
 * TS-Fix-AI: Script inteligente para corregir errores de TypeScript
 * 
 * Este script analiza los errores, aprende de correcciones anteriores
 * y aplica soluciones automáticamente en base a patrones identificados.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banco de conocimiento de errores y soluciones
const errorPatterns = {
  'TS1005': { // ':' expected
    patterns: [
      { 
        detect: /(\w+)\?\.(push|pop|shift|unshift|splice|slice|map|filter|reduce|forEach|some|every|find|findIndex)\(/g,
        replace: '$1.$2(' 
      },
      { 
        detect: /(performanceSummary|config|result)\?\.(\w+)/g,
        replace: '$1.$2' 
      },
      {
        detect: /(\d+)\?\.(\d+)/g,
        replace: '$1.$2'
      }
    ]
  },
  'TS2531': { // Object is possibly 'null'
    patterns: [
      {
        detect: /const (\w+) = (\w+)\?.(\w+);/g,
        replace: 'const $1 = $2 ? $2.$3 : undefined;'
      }
    ]
  },
  'TS2532': { // Object is possibly 'undefined'
    patterns: [
      {
        detect: /(\w+)\.(\w+)\?\.(\w+)/g,
        replace: '$1.$2 && $1.$2.$3'
      }
    ]
  }
};

// Función para corregir archivos basada en tipo de error
const fixFileByError = (filePath, errorType) => {
  if (!errorPatterns[errorType]) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fixed = false;
  
  errorPatterns[errorType].patterns.forEach(pattern => {
    if (pattern.detect.test(content)) {
      content = content.replace(pattern.detect, pattern.replace);
      fixed = true;
    }
  });
  
  if (fixed) {
    fs.writeFileSync(filePath, content);
    console.log(`🔧 Corregido ${errorType} en ${path.basename(filePath)}`);
  }
  
  return fixed;
};

// Función para aprender nuevos patrones de error
const learnNewPattern = (errorType, errorContext, solution) => {
  if (!errorPatterns[errorType]) {
    errorPatterns[errorType] = { patterns: [] };
  }
  
  // Crear patrón basado en el contexto y la solución
  const pattern = {
    detect: new RegExp(errorContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\w+/g, '\\w+'), 'g'),
    replace: solution
  };
  
  errorPatterns[errorType].patterns.push(pattern);
  console.log(`📚 Nuevo patrón aprendido para ${errorType}`);
};

// Principal: Analizar errores y aplicar correcciones
const main = async () => {
  console.log('🧠 TS-Fix-AI: Iniciando análisis inteligente de errores...');
  
  try {
    // Obtener lista de errores actuales
    const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' }).toString();
    const errorLines = tscOutput.split('\n').filter(line => /error TS\d+:/.test(line));
    
    if (errorLines.length === 0) {
      console.log('✅ No se encontraron errores de TypeScript. ¡Código perfecto!');
      return;
    }
    
    console.log(`🔍 Encontrados ${errorLines.length} errores. Aplicando correcciones automáticas...`);
    
    // Agrupar errores por archivo y tipo
    const errorsByFile = {};
    
    errorLines.forEach(line => {
      const match = line.match(/(.+)\((\d+),(\d+)\): error (TS\d+): (.+)/);
      if (!match) return;
      
      const [_, filePath, lineNum, column, errorCode, errorMessage] = match;
      
      if (!errorsByFile[filePath]) {
        errorsByFile[filePath] = [];
      }
      
      errorsByFile[filePath].push({
        line: parseInt(lineNum),
        column: parseInt(column),
        code: errorCode,
        message: errorMessage
      });
    });
    
    // Aplicar correcciones por archivo
    let totalFixed = 0;
    
    for (const filePath in errorsByFile) {
      const errors = errorsByFile[filePath];
      const uniqueErrorTypes = [...new Set(errors.map(e => e.code))];
      
      uniqueErrorTypes.forEach(errorType => {
        const fixed = fixFileByError(filePath, errorType);
        if (fixed) totalFixed++;
      });
    }
    
    console.log(`\n📊 Resumen:
    - Errores encontrados: ${errorLines.length}
    - Tipos de errores únicos: ${Object.keys(errorsByFile).length}
    - Correcciones aplicadas: ${totalFixed}
    - Eficiencia: ${Math.round((totalFixed / errorLines.length) * 100)}%
    `);
    
    // Verificar errores restantes
    try {
      execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
      console.log('🎉 ¡Todos los errores han sido corregidos!');
    } catch (error) {
      const remainingErrors = error.stdout.split('\n').filter(line => /error TS\d+:/.test(line));
      console.log(`⚠️ Quedan ${remainingErrors.length} errores por corregir manualmente.`);
    }
    
  } catch (error) {
    console.error('❌ Error durante el proceso:', error.message);
  }
};

main();
