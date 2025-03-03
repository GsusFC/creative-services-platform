/**
 * TS-Pipeline-Fixer: Sistema de corrección por fases
 * 
 * Aplica correcciones en múltiples pasadas, con cada fase centrándose
 * en un tipo específico de error, permitiendo correcciones incrementales
 * y optimizadas.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fases de corrección en orden de ejecución
const phases = [
  {
    name: 'Sintaxis básica',
    priority: 1,
    patterns: [
      { find: /(\w+)\?\./g, replace: '$1.' },
      { find: /0\?\.(\d+)/g, replace: '0.$1' }
    ]
  },
  {
    name: 'Tipos e interfaces',
    priority: 2,
    patterns: [
      { find: /function\s+(\w+)\s*\(/g, replace: 'function $1<T>(' }
    ]
  },
  {
    name: 'Acceso a propiedades',
    priority: 3,
    patterns: [
      { find: /const\s+{\s*([^}]+)\s*}\s*=\s*(\w+);/g, replace: 'const { $1 } = $2 || {};' }
    ]
  },
  {
    name: 'Manejo de promesas',
    priority: 4,
    patterns: [
      { find: /return\s+new\s+Promise\(\(/g, replace: 'return new Promise<T>((' }
    ]
  },
  {
    name: 'React hooks',
    priority: 5,
    patterns: [
      { find: /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\(\);/g, 
        replace: (match, p1, p2) => {
          const capitalized = p2 || p1.charAt(0).toUpperCase() + p1.slice(1);
          return `const [${p1}, set${capitalized}] = useState<${capitalized}Type>();`;
        }
      }
    ]
  }
];

// Clase principal del pipeline
class TSPipelineFixer {
  constructor() {
    this.fileCache = new Map();
    this.stats = {
      filesProcessed: 0,
      phaseResults: {},
      totalErrorsBefore: 0,
      totalErrorsAfter: 0,
      startTime: Date.now()
    };
    
    // Inicializar estadísticas por fase
    phases.forEach(phase => {
      this.stats.phaseResults[phase.name] = {
        filesFixed: 0,
        patternsApplied: 0
      };
    });
  }
  
  async run() {
    console.log('🚀 Iniciando TS-Pipeline-Fixer');
    
    // Obtener lista de archivos TypeScript
    const tsFiles = this.findTypeScriptFiles();
    console.log(`📁 Encontrados ${tsFiles.length} archivos TypeScript`);
    
    // Contar errores iniciales
    this.stats.totalErrorsBefore = this.countTSErrors();
    console.log(`⚠️ Errores iniciales: ${this.stats.totalErrorsBefore}`);
    
    // Ejecutar fases en orden
    for (const phase of phases.sort((a, b) => a.priority - b.priority)) {
      console.log(`\n▶️ Fase: ${phase.name} (prioridad ${phase.priority})`);
      await this.runPhase(phase, tsFiles);
      
      // Verificar errores después de la fase
      const errorsAfterPhase = this.countTSErrors();
      const errorsDelta = this.stats.totalErrorsBefore - errorsAfterPhase;
      console.log(`   ✅ Fase completada: ${errorsDelta} errores corregidos`);
      
      this.stats.totalErrorsBefore = errorsAfterPhase;
    }
    
    // Resultados finales
    this.stats.totalErrorsAfter = this.countTSErrors();
    this.generateReport();
  }
  
  findTypeScriptFiles() {
    const srcDir = path.join(__dirname, '../src');
    const result = execSync(`find ${srcDir} -type f -name "*.ts" -o -name "*.tsx"`, 
                           { encoding: 'utf8' }).split('\n').filter(Boolean);
    return result;
  }
  
  countTSErrors() {
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      return 0;
    } catch (error) {
      const errorLines = error.stdout.split('\n').filter(line => line.includes('error TS'));
      return errorLines.length;
    }
  }
  
  async runPhase(phase, files) {
    const startTime = Date.now();
    let filesFixed = 0;
    let patternsApplied = 0;
    
    // Usar paralelismo para procesar archivos más rápido
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      // Procesar batch en paralelo
      const results = await Promise.all(
        batch.map(file => this.processFile(file, phase.patterns))
      );
      
      // Acumular resultados
      results.forEach(result => {
        if (result.fixed) filesFixed++;
        patternsApplied += result.patternsApplied;
      });
      
      // Mostrar progreso
      const progress = Math.round(((i + batch.length) / files.length) * 100);
      process.stdout.write(`   🔄 Progreso: ${progress}% (${filesFixed} archivos corregidos)\r`);
    }
    
    console.log(`   🔄 Progreso: 100% (${filesFixed} archivos corregidos)`);
    
    // Guardar estadísticas
    this.stats.phaseResults[phase.name] = {
      filesFixed,
      patternsApplied,
      timeMs: Date.now() - startTime
    };
    
    this.stats.filesProcessed += filesFixed;
  }
  
  async processFile(filePath, patterns) {
    // Obtener contenido del archivo (usar caché si está disponible)
    let content;
    if (this.fileCache.has(filePath)) {
      content = this.fileCache.get(filePath);
    } else {
      content = fs.readFileSync(filePath, 'utf8');
      this.fileCache.set(filePath, content);
    }
    
    const originalContent = content;
    let patternsApplied = 0;
    
    // Aplicar patrones
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern.find, pattern.replace);
      if (newContent !== content) {
        content = newContent;
        patternsApplied++;
      }
    });
    
    // Si hubo cambios, actualizar archivo y caché
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      this.fileCache.set(filePath, content);
      return { fixed: true, patternsApplied };
    }
    
    return { fixed: false, patternsApplied };
  }
  
  generateReport() {
    const totalTime = Date.now() - this.stats.startTime;
    const errorsCorrected = this.stats.totalErrorsBefore - this.stats.totalErrorsAfter;
    
    const report = `# TypeScript Pipeline Fixer - Informe

## Resumen de la ejecución
- **Tiempo total**: ${(totalTime / 1000).toFixed(2)} segundos
- **Archivos procesados**: ${this.stats.filesProcessed}
- **Errores corregidos**: ${errorsCorrected} (${this.stats.totalErrorsAfter} restantes)
- **Eficiencia**: ${(errorsCorrected / (this.stats.totalErrorsBefore || 1) * 100).toFixed(1)}%

## Resultados por fase
${phases.map(phase => {
  const result = this.stats.phaseResults[phase.name];
  return `### ${phase.name} (prioridad ${phase.priority})
- Archivos corregidos: ${result.filesFixed}
- Patrones aplicados: ${result.patternsApplied}
- Tiempo: ${(result.timeMs / 1000).toFixed(2)} segundos
`;
}).join('\n')}

## Errores restantes
${this.stats.totalErrorsAfter > 0 
  ? 'Todavía hay errores que requieren atención manual. Ejecute `npx tsc --noEmit` para verlos.'
  : '¡Felicidades! No quedan errores de TypeScript.'}

Generado el ${new Date().toISOString()}
`;
    
    const reportPath = path.join(__dirname, '../ts-pipeline-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`\n📊 Informe generado: ${reportPath}`);
  }
}

// Ejecutar el pipeline
new TSPipelineFixer().run();
