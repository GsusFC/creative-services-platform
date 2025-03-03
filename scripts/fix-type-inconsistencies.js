#!/usr/bin/env node

/**
 * Script para corregir inconsistencias de tipos y mejorar el manejo de null/undefined
 * 
 * Este script corrige las inconsistencias entre rich_text y richText,
 * y mejora el manejo de null/undefined en el código del Field Mapper.
 */

'use strict';

import fs from 'fs';
import { execSync } from 'child_process';

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

// Directorios a analizar
const directories = [
  'src/lib/field-mapper',
  'src/components/field-mapper',
  'src/app/api/notion'
];

// Patrones para buscar
const patterns = {
  richTextInconsistency: {
    search: /['"]rich_text['"]/g,
    replace: "'richText'",
    description: 'Inconsistencia entre rich_text y richText'
  },
  nullUndefinedCheck: {
    search: /(\w+)(\.\w+)+(?!\s*(\?\.)|\s*&&|\s*\|\||\s*===|\s*!==|\s*==|\s*!=|\s*\?)/g,
    replace: (match, p1, p2) => `${p1}${p2.replace(/\./g, '?.')}`,
    description: 'Posible error de null/undefined'
  },
  optionalChaining: {
    search: /(\w+)(\.\w+\s*\?\s*\.\s*\w+)/g,
    replace: (match, p1, p2) => `${p1}?${p2}`,
    description: 'Mejora de optional chaining'
  },
  nullishCoalescing: {
    search: /(\w+)(\s*\|\|\s*)(['"]|true|false|\d+|null|undefined|\[\]|\{\})/g,
    replace: (match, p1, p2, p3) => `${p1} ?? ${p3}`,
    description: 'Reemplazo de || por ??'
  }
};

// Función principal
async function main() {
  console.log('Iniciando corrección de inconsistencias de tipos y mejora de null/undefined...\n');

  // Buscar archivos TypeScript en los directorios especificados
  let allFiles = [];
  directories.forEach(dir => {
    try {
      const output = execSync(`find ${dir} -type f -name "*.ts" -o -name "*.tsx"`, { encoding: 'utf8' });
      allFiles = allFiles.concat(output.trim().split('\n').filter(Boolean));
    } catch (error) {
      console.error(`${colors.red}Error al buscar archivos en ${dir}:${colors.reset}`, error.message);
    }
  });

  console.log(`Encontrados ${allFiles.length} archivos para procesar\n`);

  // Estadísticas
  const stats = {
    filesModified: 0,
    totalChanges: 0,
    changesByPattern: {}
  };

  // Inicializar estadísticas por patrón
  Object.keys(patterns).forEach(key => {
    stats.changesByPattern[key] = {
      count: 0,
      files: new Set()
    };
  });

  // Procesar cada archivo
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let newContent = content;
      let fileModified = false;

      // Aplicar cada patrón
      for (const [key, pattern] of Object.entries(patterns)) {
        const matches = newContent.match(pattern.search) || [];
        
        if (matches.length > 0) {
          newContent = newContent.replace(pattern.search, pattern.replace);
          stats.changesByPattern[key].count += matches.length;
          stats.changesByPattern[key].files.add(file);
          fileModified = true;
          
          console.log(`${colors.green}${file}:${colors.reset} ${matches.length} ${pattern.description} corregidas`);
        }
      }

      // Guardar el archivo modificado
      if (fileModified) {
        fs.writeFileSync(file, newContent, 'utf8');
        stats.filesModified++;
        stats.totalChanges += Object.values(patterns).reduce((acc, pattern) => {
          const matches = content.match(pattern.search) || [];
          return acc + matches.length;
        }, 0);
      }
    } catch (error) {
      console.error(`${colors.red}Error al procesar ${file}:${colors.reset}`, error.message);
    }
  }

  // Mostrar resumen
  console.log('\n=== Resumen de correcciones ===');
  console.log(`Archivos modificados: ${stats.filesModified}`);
  console.log(`Total de cambios: ${stats.totalChanges}\n`);

  for (const [key, data] of Object.entries(stats.changesByPattern)) {
    console.log(`${patterns[key].description}: ${data.count} correcciones en ${data.files.size} archivos`);
  }

  // Guardar informe
  const report = `# Informe de corrección de inconsistencias de tipos y mejora de null/undefined

## Resumen
- Archivos modificados: ${stats.filesModified}
- Total de cambios: ${stats.totalChanges}

## Detalles por tipo de corrección
${Object.entries(stats.changesByPattern).map(([key, data]) => `
### ${patterns[key].description}
- Total de correcciones: ${data.count}
- Archivos afectados: ${data.files.size}
${Array.from(data.files).map(file => `  - ${file}`).join('\n')}
`).join('\n')}

## Fecha de ejecución
${new Date().toISOString()}
`;

  fs.writeFileSync('field-mapper-type-fixes-report.md', report, 'utf8');
  console.log('\nInforme guardado en field-mapper-type-fixes-report.md');
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
