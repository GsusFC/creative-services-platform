#!/usr/bin/env node

/**
 * Script para corregir errores en performance-service.ts
 * 
 * Este script corrige errores de sintaxis en el archivo performance-service.ts
 */

'use strict';

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
  gray: '\x1b[90m'
};

// Archivo a modificar
const filePath = 'src/lib/field-mapper/performance-service.ts';

// Función principal
async function main() {
  console.log('Iniciando corrección de errores en performance-service.ts...\n');

  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`${colors.yellow}Archivo no encontrado: ${fullPath}${colors.reset}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Corregir errores de sintaxis (falta de punto y coma)
    const fixedContent = content
      // Añadir punto y coma al final de las líneas que lo necesitan
      .replace(/(\w+)\s*$/gm, '$1;')
      .replace(/(\w+)\s*\n\s*}/gm, '$1;\n}')
      .replace(/(\w+)\s*\n\s*catch/gm, '$1;\n    catch')
      .replace(/(\w+)\s*\n\s*try/gm, '$1;\n    try')
      // Corregir this?. por this.
      .replace(/this\?\./g, 'this.')
      // Corregir errores específicos
      .replace(/const result = await fn\(\)/g, 'const result = await fn();')
      .replace(/const result = fn\(\)/g, 'const result = fn();')
      .replace(/this\.endOperation\(id\)/g, 'this.endOperation(id);')
      .replace(/throw error/g, 'throw error;')
      .replace(/return result/g, 'return result;')
      // Corregir errores de tipos
      .replace(/performance as \{ memory: \{ usedJSHeapSize: number \} \}/g, '(performance as unknown) as { memory: { usedJSHeapSize: number } }');
    
    // Guardar el archivo corregido
    fs.writeFileSync(fullPath, fixedContent, 'utf8');
    
    console.log(`${colors.green}Archivo corregido: ${filePath}${colors.reset}`);
    
    // Contar cambios
    const changes = fixedContent.split(';').length - content.split(';').length;
    console.log(`Se añadieron aproximadamente ${changes} puntos y coma.`);
    
    // Guardar informe
    const report = `# Informe de corrección de errores en performance-service.ts

## Resumen
- Archivo corregido: ${filePath}
- Cambios realizados: aproximadamente ${changes} puntos y coma añadidos

## Tipos de correcciones
- Añadir punto y coma al final de las líneas
- Reemplazar this?. por this.
- Corregir errores de sintaxis específicos
- Corregir errores de tipos

## Fecha de ejecución
${new Date().toISOString()}
`;

    fs.writeFileSync('performance-service-fixes-report.md', report, 'utf8');
    console.log('\nInforme guardado en performance-service-fixes-report.md');
    
  } catch (error) {
    console.error(`${colors.red}Error al procesar ${filePath}:${colors.reset}`, error.message);
  }
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
