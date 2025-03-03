/**
 * Script para corregir los errores persistentes de TypeScript en todo el proyecto
 * 
 * Este script busca y corrige patrones comunes de errores de TypeScript que
 * hemos identificado en el proyecto.
 */

// Importamos módulos usando sintaxis CommonJS con declaraciones const
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

// Creamos funciones asíncronas para leer y escribir archivos, y ejecutar comandos
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const execAsync = promisify(exec);

// Archivos principales a corregir
const TARGET_FILES = [
  'src/app/api/notion/database/structure/route.ts',
  'src/lib/field-mapper/transformation-service.ts',
  'src/components/field-mapper/OptimizationRecommendations.tsx',
  'src/components/field-mapper/PerformanceCharts.tsx',
  'src/lib/notion.ts',
  // Añadir más archivos según sea necesario
];

// Patrones de errores y sus correcciones
const ERROR_PATTERNS = [
  // Errores de Promise
  { pattern: /Promise<any>\./g, replacement: 'Promise.' },
  { pattern: /Promise<any>\?/g, replacement: 'Promise' },
  { pattern: /const requestPromise<any> =/g, replacement: 'const requestPromise =' },
  
  // Operadores opcionales innecesarios
  { pattern: /(\w+)\?\./g, replacement: (match, p1) => {
    // Excluir casos como "data?.field" donde el operador opcional puede ser necesario
    const exclusions = ['data', 'result', 'response.title', 'item', 'record', 'user', 'session'];
    return exclusions.includes(p1) ? match : `${p1}.`;
  }},
  
  // Errores de sintaxis de array
  { pattern: /Array<(\w+)>/g, replacement: '$1[]' },
  
  // Tipos genéricos mal formados
  { pattern: /<any,\s*any>/g, replacement: '<any>' },
  { pattern: /<unknown,\s*unknown>/g, replacement: '<unknown>' },
  
  // Errores de React Query
  { pattern: /useQuery<(\w+)>/g, replacement: 'useQuery' },
];

/**
 * Función para corregir un archivo específico
 */
async function fixFile(filePath) {
  // Construimos la ruta completa del archivo
  const fullPath = path.join(__dirname, '..', filePath);
  console.log(`Procesando: ${filePath}`);
  
  try {
    // Leer el contenido del archivo
    const content = await readFileAsync(fullPath, 'utf8');
    
    // Aplicar todas las correcciones
    let correctedContent = content;
    let patternsApplied = 0;
    
    // Recorremos los patrones de errores y aplicamos las correcciones
    ERROR_PATTERNS.forEach(({ pattern, replacement }) => {
      // Si el reemplazo es una función, usamos replace con callback
      if (typeof replacement === 'function') {
        const newContent = correctedContent.replace(pattern, replacement);
        if (newContent !== correctedContent) {
          patternsApplied++;
        }
        correctedContent = newContent;
      } else {
        // Si es un string, usamos replace normal
        const newContent = correctedContent.replace(pattern, replacement);
        if (newContent !== correctedContent) {
          patternsApplied++;
        }
        correctedContent = newContent;
      }
    });
    
    // Guardar el contenido corregido solo si hubo cambios
    if (content !== correctedContent) {
      await writeFileAsync(fullPath, correctedContent, 'utf8');
      console.log(`✅ Corregido: ${filePath} (${patternsApplied} patrones aplicados)`);
      return true; // Indica que se realizaron cambios
    }
    
    console.log(`ℹ️ Sin cambios: ${filePath}`);
    return false; // No hubo cambios
  } catch (error) {
    console.error(`❌ Error al procesar ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Verificar los errores de TypeScript restantes después de las correcciones
 */
async function checkRemainingErrors() {
  try {
    console.log('\n🔍 Verificando errores TypeScript restantes...');
    await execAsync('npx tsc --noEmit').catch(error => {
      console.log('⚠️ Todavía hay errores TypeScript restantes:');
      console.log(error.stdout);
    });
    console.log('✅ Verificación completada.');
  } catch (error) {
    console.error('⚠️ Error al verificar errores TypeScript:', error);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🛠️ Iniciando corrección de errores TypeScript...\n');
  
  let totalFixed = 0;
  
  // Recorremos los archivos objetivo y aplicamos las correcciones
  for (const file of TARGET_FILES) {
    const successful = await fixFile(file);
    if (successful) {
      totalFixed++;
    }
  }
  
  console.log(`\n📊 Resumen: Corregidos ${totalFixed} de ${TARGET_FILES.length} archivos`);
  
  await checkRemainingErrors();
}

// Ejecutar el script
main().catch(error => {
  console.error('❌ Error en la ejecución del script:', error);
  process.exit(1);
});
