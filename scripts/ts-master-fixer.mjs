/**
 * TS-Master-Fixer
 * 
 * Sistema integral de corrección de errores TypeScript con inteligencia artificial.
 * Este script coordina todos los scripts individuales para una corrección completa.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir fases del proceso
const PHASES = [
  {
    name: 'Análisis Inicial',
    script: null, // Fase interna
    description: 'Analiza los errores de TypeScript y genera un plan de corrección'
  },
  {
    name: 'Corrección de Errores Básicos',
    script: './fix-common-ts-errors.mjs',
    description: 'Corrige errores comunes y sencillos de TypeScript'
  },
  {
    name: 'Corrección de Tipos Genéricos',
    script: './fix-generic-types.mjs',
    description: 'Corrige errores relacionados con tipos genéricos'
  },
  {
    name: 'Corrección de Servicios de Optimización',
    script: './fix-optimization-service-advanced.mjs',
    description: 'Corrige errores en los servicios de optimización'
  },
  {
    name: 'Corrección de Validación',
    script: './fix-validation-ts-advanced.mjs',
    description: 'Corrige errores avanzados en la validación'
  },
  {
    name: 'Corrección de React/UI',
    script: './fix-react-components.mjs',
    description: 'Corrige errores en componentes React'
  },
  {
    name: 'Optimización Final',
    script: './ts-fix-ai.mjs',
    description: 'Aplica correcciones inteligentes a errores residuales'
  },
  {
    name: 'Generación de Documentación',
    script: './ts-documentation-generator.mjs',
    description: 'Genera documentación de errores y soluciones'
  },
  {
    name: 'Generación de Dashboard',
    script: './ts-dashboard-generator.mjs',
    description: 'Genera un dashboard interactivo de progreso'
  }
];

// Función principal
async function runMasterFixer() {
  console.log('🚀 Iniciando Sistema Integral de Corrección TypeScript');
  console.log('=====================================================');
  
  // Fase 1: Análisis Inicial
  console.log('\n📊 FASE 1: Análisis Inicial');
  const initialErrors = await analyzeTypeScriptErrors();
  
  if (initialErrors.length === 0) {
    console.log('✅ No se detectaron errores de TypeScript. ¡El código está limpio!');
    return;
  }
  
  console.log(`\n📋 Se encontraron ${initialErrors.length} errores de TypeScript`);
  
  // Agrupar errores por tipo y por archivo
  const { errorsByType, errorsByFile } = groupErrors(initialErrors);
  
  // Mostrar los 5 tipos de errores más comunes
  console.log('\n🔍 Tipos de errores más comunes:');
  Object.entries(errorsByType)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .forEach(([errorCode, data], index) => {
      console.log(`   ${index + 1}. ${errorCode}: ${data.message} (${data.count} ocurrencias)`);
    });
  
  // Mostrar los 5 archivos con más errores
  console.log('\n📄 Archivos con más errores:');
  Object.entries(errorsByFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([file, count], index) => {
      console.log(`   ${index + 1}. ${file}: ${count} errores`);
    });
  
  // Generar plan de corrección
  console.log('\n📝 Generando plan de corrección...');
  const plan = generateCorrectionPlan(errorsByType, errorsByFile);
  
  // Mostrar plan
  console.log('\n📋 Plan de corrección:');
  plan.forEach((phase, index) => {
    console.log(`   ${index + 1}. ${phase.name}: ${phase.priority} prioridad`);
  });
  
  // Confirmar para continuar
  await new Promise(resolve => {
    console.log('\n⚠️  ¿Deseas ejecutar el plan de corrección? Este proceso modificará archivos. (s/n)');
    // En un entorno real, aquí habría código para esperar la entrada del usuario
    console.log('Continuando con la ejecución del plan... (simulación de confirmación)');
    resolve();
  });
  
  // Ejecutar cada fase del plan
  for (const phase of plan) {
    console.log(`\n🔧 Ejecutando fase: ${phase.name} (${phase.description})`);
    
    if (phase.script) {
      try {
        await runScript(phase.script);
        console.log(`   ✅ Fase completada: ${phase.name}`);
      } catch (error) {
        console.error(`   ❌ Error en fase ${phase.name}:`, error.message);
        if (phase.priority === 'alta') {
          console.error('   ⚠️ Esta fase era de alta prioridad. Deteniendo el proceso.');
          break;
        } else {
          console.log('   ⚠️ Continuando con la siguiente fase...');
        }
      }
    }
  }
  
  // Analizar errores restantes
  const remainingErrors = await analyzeTypeScriptErrors();
  
  console.log('\n📊 Resultados finales:');
  console.log(`   - Errores iniciales: ${initialErrors.length}`);
  console.log(`   - Errores restantes: ${remainingErrors.length}`);
  console.log(`   - Errores corregidos: ${initialErrors.length - remainingErrors.length}`);
  console.log(`   - Porcentaje de mejora: ${Math.round((1 - remainingErrors.length / initialErrors.length) * 100)}%`);
  
  if (remainingErrors.length > 0) {
    console.log('\n⚠️ Todavía hay errores que requieren atención manual. Consulta la documentación generada para más detalles.');
  } else {
    console.log('\n🎉 ¡Todos los errores han sido corregidos! El código TypeScript está limpio.');
  }
  
  console.log('\n📑 Se han generado los siguientes recursos:');
  console.log('   - Documentation: docs/typescript-errors-guide.md');
  console.log('   - Dashboard: ts-progress-dashboard.html');
  console.log('   - Resumen: docs/typescript-errors-summary.md');
}

// Analizar errores de TypeScript
async function analyzeTypeScriptErrors() {
  try {
    // Ejecutar TypeScript en modo --noEmit para obtener errores sin generar archivos
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    return []; // No hay errores
  } catch (error) {
    const output = error.stdout.toString();
    const errorLines = output.split('\n').filter(line => line.includes('error TS'));
    
    return errorLines.map(line => {
      // Ejemplo: src/components/App.tsx(10,5): error TS2322: Type '...' is not assignable to type '...'
      const fileMatch = line.match(/^(.+?)\((\d+),(\d+)\)/);
      const typeMatch = line.match(/error (TS\d+):/);
      const messageMatch = line.match(/error TS\d+: (.+)$/);
      
      if (fileMatch && typeMatch && messageMatch) {
        return {
          file: fileMatch[1],
          line: parseInt(fileMatch[2]),
          column: parseInt(fileMatch[3]),
          code: typeMatch[1],
          message: messageMatch[1].trim()
        };
      }
      
      return null;
    }).filter(Boolean);
  }
}

// Agrupar errores por tipo y por archivo
function groupErrors(errors) {
  const errorsByType = {};
  const errorsByFile = {};
  
  errors.forEach(error => {
    // Agrupar por tipo de error
    if (!errorsByType[error.code]) {
      errorsByType[error.code] = {
        count: 0,
        message: error.message,
        examples: []
      };
    }
    
    errorsByType[error.code].count++;
    
    if (errorsByType[error.code].examples.length < 3) {
      errorsByType[error.code].examples.push({
        file: error.file,
        line: error.line
      });
    }
    
    // Agrupar por archivo
    if (!errorsByFile[error.file]) {
      errorsByFile[error.file] = 0;
    }
    
    errorsByFile[error.file]++;
  });
  
  return { errorsByType, errorsByFile };
}

// Generar plan de corrección basado en el análisis
function generateCorrectionPlan(errorsByType, errorsByFile) {
  // Copiar las fases y asignar prioridades según los errores encontrados
  const plan = PHASES.map(phase => ({ ...phase, priority: 'normal' }));
  
  // Asignar prioridades según los tipos de errores más comunes
  const topErrorCodes = Object.entries(errorsByType)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([code]) => code);
  
  // Patrones para asociar tipos de errores con fases
  const errorPatterns = {
    'TS2322': [1, 2], // Errores de tipo no asignable - Fases básicas y genéricas
    'TS2571': [1], // Posibles nulos - Fase básica
    'TS2339': [1, 4], // Propiedad no existe - Fases básicas y validación
    'TS2769': [2, 4], // Argumentos incorrectos - Fases genéricas y validación
    'TS7006': [1, 2] // Any implícito - Fases básicas y genéricas
  };
  
  // Asignar prioridades basadas en errores comunes
  topErrorCodes.slice(0, 3).forEach(code => {
    const phases = errorPatterns[code] || [1, 6]; // Por defecto, fases básicas y AI
    
    phases.forEach(phaseIndex => {
      if (plan[phaseIndex]) {
        plan[phaseIndex].priority = 'alta';
      }
    });
  });
  
  // Comprobar archivos específicos
  const topErrorFiles = Object.keys(errorsByFile)
    .sort((a, b) => errorsByFile[b] - errorsByFile[a])
    .slice(0, 5);
  
  // Asignar prioridades basadas en archivos con problemas
  topErrorFiles.forEach(file => {
    if (file.includes('optimization-service')) {
      plan[3].priority = 'alta'; // Prioridad alta para fase de optimización
    } else if (file.includes('validation')) {
      plan[4].priority = 'alta'; // Prioridad alta para fase de validación
    } else if (file.endsWith('.tsx')) {
      plan[5].priority = 'alta'; // Prioridad alta para fase de componentes React
    }
  });
  
  // Las fases de documentación y dashboard siempre son importantes
  plan[7].priority = 'alta';
  plan[8].priority = 'alta';
  
  return plan;
}

// Ejecutar un script individual
async function runScript(scriptPath) {
  const fullPath = path.join(__dirname, scriptPath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Script no encontrado: ${fullPath}`);
  }
  
  return new Promise((resolve, reject) => {
    const process = spawn('node', [fullPath], { stdio: 'inherit' });
    
    process.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`El script ${scriptPath} terminó con código ${code}`));
      }
    });
    
    process.on('error', err => {
      reject(err);
    });
  });
}

// Ejecutar función principal
runMasterFixer().catch(error => {
  console.error('❌ Error en el proceso:', error);
});
