#!/usr/bin/env node

/**
 * Script para corregir errores específicos de TypeScript
 * 
 * Este script corrige errores específicos de TypeScript que aparecieron
 * después de las mejoras realizadas en el Field Mapper.
 */

'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

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

// Archivos con errores específicos
const filesWithErrors = [
  'src/lib/field-mapper/utils.ts',
  'src/components/field-mapper/FieldTypeBadge.tsx',
  'src/components/field-mapper/Mapping.tsx',
  'src/lib/field-mapper/performance-service.ts',
  'src/components/field-mapper/VirtualizedMappingList.tsx',
  'src/components/field-mapper/OptimizedMapping.tsx'
];

// Patrones para corregir
const patterns = {
  optionalChainingNumber: {
    search: /(\d+)(\?\.)/g,
    replace: '$1',
    description: 'Corrección de optional chaining en números'
  },
  optionalChainingParenthesis: {
    search: /(\w+\?\.\w+)(\s*[<>=!]+\s*\w+\?\.)/g,
    replace: '($1)$2',
    description: 'Añadir paréntesis alrededor de optional chaining'
  },
  optionalChainingMultiple: {
    search: /(\w+\?\.\w+\?\.\w+)/g,
    replace: '($1)',
    description: 'Añadir paréntesis alrededor de multiple optional chaining'
  },
  typeAssertion: {
    search: /performance as \{ memory: \{ usedJSHeapSize: number \} \}/g,
    replace: '(performance as unknown) as { memory: { usedJSHeapSize: number } }',
    description: 'Corrección de aserción de tipo para performance.memory'
  },
  recordTypeAssertion: {
    search: /(Record<string, unknown>)(\[\])/g,
    replace: 'Array<$1>',
    description: 'Corrección de Record<string, unknown>[]'
  },
  genericType: {
    search: /Parameters<T>/g,
    replace: 'unknown[]',
    description: 'Reemplazo de Parameters<T> por unknown[]'
  }
};

// Función principal
async function main() {
  console.log('Iniciando corrección de errores específicos de TypeScript...\n');

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
  for (const file of filesWithErrors) {
    try {
      if (!fs.existsSync(file)) {
        console.warn(`${colors.yellow}Archivo no encontrado: ${file}${colors.reset}`);
        continue;
      }
      
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
  const report = `# Informe de corrección de errores específicos de TypeScript

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

  fs.writeFileSync('ts-errors-fixes-report.md', report, 'utf8');
  console.log('\nInforme guardado en ts-errors-fixes-report.md');
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
