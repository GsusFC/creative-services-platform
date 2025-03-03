/**
 * Script para corregir todos los errores restantes de TypeScript
 * 
 * Este script ejecuta todos los scripts de corrección de errores
 * y genera un informe final.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Iniciando corrección de todos los errores restantes...');

// Lista de scripts a ejecutar
const scripts = [
  'fix-common-ts-errors.mjs',
  'fix-validation-ts.mjs',
  'fix-validation-types.mjs',
  'fix-cache-service.mjs',
  'fix-pricing-ts.mjs',
  'fix-tailwind-config.mjs',
  'fix-notion-api.mjs',
  'fix-react-components.mjs',
  'fix-optimization-service.mjs',
  'fix-performance-charts.mjs',
  'fix-cache-service-advanced.mjs',
  'fix-optimization-service-advanced.mjs',
  'fix-optimization-service-extra.mjs',
  'fix-validation-ts-advanced.mjs',
  'fix-remaining-errors.js'
];

// Ejecutar cada script
let successCount = 0;
let errorCount = 0;
const results = [];

for (const script of scripts) {
  const scriptPath = path.join(__dirname, script);
  
  // Verificar si el script existe
  if (!fs.existsSync(scriptPath)) {
    console.log(`Script no encontrado: ${script}`);
    continue;
  }
  
  console.log(`Ejecutando: ${script}`);
  
  try {
    // Ejecutar el script
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
    console.log(output);
    
    results.push({
      script,
      success: true,
      output
    });
    
    successCount++;
  } catch (error) {
    console.error(`Error al ejecutar ${script}:`, error.message);
    
    results.push({
      script,
      success: false,
      error: error.message
    });
    
    errorCount++;
  }
}

// Generar informe
const reportPath = path.join(__dirname, '../ts-errors-fix-report-final.md');
const reportContent = `# Informe Final de Corrección de Errores TypeScript

## Resumen
- Scripts ejecutados: ${scripts.length}
- Exitosos: ${successCount}
- Con errores: ${errorCount}

## Detalles

${results.map(result => {
  if (result.success) {
    return `### ✅ ${result.script}\n\`\`\`\n${result.output}\n\`\`\`\n`;
  } else {
    return `### ❌ ${result.script}\n\`\`\`\n${result.error}\n\`\`\`\n`;
  }
}).join('\n')}

## Próximos Pasos
1. Verificar errores restantes con \`npx tsc --noEmit\`
2. Corregir manualmente los errores que no pudieron ser resueltos automáticamente
3. Implementar pruebas para verificar que la funcionalidad no se haya visto afectada

## Fecha
${new Date().toISOString()}
`;

fs.writeFileSync(reportPath, reportContent);

console.log(`Informe generado: ${reportPath}`);
console.log('Proceso de corrección completado.');

// Ejecutar TypeScript para verificar errores restantes
try {
  console.log('Verificando errores restantes...');
  const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
  console.log('No se encontraron errores de TypeScript.');
} catch (error) {
  console.log('Errores restantes:');
  console.log(error.stdout);
  
  // Contar errores restantes
  const errorLines = error.stdout.split('\n').filter(line => line.includes('error TS'));
  console.log(`Total de errores restantes: ${errorLines.length}`);
}
