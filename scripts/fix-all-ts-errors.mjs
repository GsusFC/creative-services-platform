/**
 * Script principal para ejecutar todas las correcciones de errores de TypeScript
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Iniciando corrección de errores de TypeScript...');

// Definir la lista de scripts a ejecutar
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
  'fix-remaining-errors.mjs'
];

// Crear un archivo de registro para los resultados
const logFile = path.join(process.cwd(), 'ts-errors-fix-log.md');
fs.writeFileSync(logFile, '# Registro de corrección de errores de TypeScript\n\n');

// Ejecutar cada script y registrar los resultados
scripts.forEach(script => {
  console.log(`\nEjecutando ${script}...`);
  fs.appendFileSync(logFile, `## ${script}\n\n`);
  
  try {
    const output = execSync(`node scripts/${script}`, { encoding: 'utf8' });
    console.log(output);
    fs.appendFileSync(logFile, '```\n' + output + '\n```\n\n');
  } catch (error) {
    console.error(`Error al ejecutar ${script}:`, error.message);
    fs.appendFileSync(logFile, '```\nERROR: ' + error.message + '\n```\n\n');
  }
});

console.log('\nTodas las correcciones han sido aplicadas.');
console.log(`Se ha creado un registro detallado en ${logFile}`);

// Ejecutar tsc para verificar errores restantes
console.log('\nVerificando errores restantes con tsc...');
try {
  const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('No se encontraron errores de TypeScript.');
  fs.appendFileSync(logFile, '## Verificación final\n\n```\nNo se encontraron errores de TypeScript.\n```\n');
} catch (error) {
  console.log('Errores de TypeScript restantes:');
  console.log(error.stdout);
  fs.appendFileSync(logFile, '## Errores restantes\n\n```\n' + error.stdout + '\n```\n');
}

console.log('\nProceso completado.');
