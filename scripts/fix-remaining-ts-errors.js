#!/usr/bin/env node

/**
 * Script para corregir errores específicos de TypeScript restantes
 * 
 * Este script corrige errores específicos de TypeScript que aún persisten
 * después de las mejoras realizadas en el Field Mapper.
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

// Correcciones específicas por archivo
const specificFixes = {
  'src/lib/field-mapper/utils.ts': [
    {
      search: /let timeout: NodeJS\?\.Timeout \| null = null;/g,
      replace: 'let timeout: NodeJS.Timeout | null = null;',
      description: 'Corrección de NodeJS?.Timeout'
    },
    {
      search: /Math\?\.abs/g,
      replace: 'Math.abs',
      description: 'Corrección de Math?.abs'
    },
    {
      search: /(first \* )005/g,
      replace: '$10.05',
      description: 'Corrección de literal octal 005'
    },
    {
      search: /thresholds\?\.cacheHitRate \* 05/g,
      replace: 'thresholds?.cacheHitRate * 0.5',
      description: 'Corrección de literal octal 05'
    }
  ],
  'src/components/field-mapper/FieldTypeBadge.tsx': [
    {
      search: /type FieldTypeBadgeProps = \{[^}]*\}/s,
      replace: `type FieldTypeBadgeProps = {
  type: string;
  source: 'notion' | 'website';
  className?: string;
}`,
      description: 'Corrección de FieldTypeBadgeProps'
    },
    {
      search: /const getTypeColor = \(type: string, source: string\): string => \{/g,
      replace: 'const getTypeColor = (type: string, source: \'notion\' | \'website\'): string => {',
      description: 'Corrección de getTypeColor'
    }
  ],
  'src/components/field-mapper/Mapping.tsx': [
    {
      search: /const validateMapping = \(mapping: FieldMapping\) => \{/g,
      replace: 'const validateMapping = (mapping: FieldMapping): { isValid: boolean; message?: string } => {',
      description: 'Añadir tipo de retorno a validateMapping'
    }
  ],
  'src/lib/field-mapper/performance-service.ts': [
    {
      search: /performance as \{ memory: \{ usedJSHeapSize: number \} \}/g,
      replace: '(performance as unknown) as { memory: { usedJSHeapSize: number } }',
      description: 'Corrección de aserción de tipo para performance.memory'
    }
  ]
};

// Función principal
async function main() {
  console.log('Iniciando corrección de errores específicos de TypeScript restantes...\n');

  // Estadísticas
  const stats = {
    filesModified: 0,
    totalChanges: 0,
    changesByFile: {}
  };

  // Procesar cada archivo con correcciones específicas
  for (const [file, fixes] of Object.entries(specificFixes)) {
    try {
      if (!fs.existsSync(file)) {
        console.warn(`${colors.yellow}Archivo no encontrado: ${file}${colors.reset}`);
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      let newContent = content;
      let fileModified = false;
      stats.changesByFile[file] = [];

      // Aplicar cada corrección específica
      for (const fix of fixes) {
        const matches = newContent.match(fix.search) || [];
        
        if (matches.length > 0) {
          newContent = newContent.replace(fix.search, fix.replace);
          stats.changesByFile[file].push({
            description: fix.description,
            count: matches.length
          });
          fileModified = true;
          
          console.log(`${colors.green}${file}:${colors.reset} ${matches.length} ${fix.description}`);
        }
      }

      // Guardar el archivo modificado
      if (fileModified) {
        fs.writeFileSync(file, newContent, 'utf8');
        stats.filesModified++;
        stats.totalChanges += stats.changesByFile[file].reduce((acc, fix) => acc + fix.count, 0);
      }
    } catch (error) {
      console.error(`${colors.red}Error al procesar ${file}:${colors.reset}`, error.message);
    }
  }

  // Mostrar resumen
  console.log('\n=== Resumen de correcciones ===');
  console.log(`Archivos modificados: ${stats.filesModified}`);
  console.log(`Total de cambios: ${stats.totalChanges}\n`);

  for (const [file, fixes] of Object.entries(stats.changesByFile)) {
    if (fixes.length > 0) {
      console.log(`${colors.blue}${file}:${colors.reset}`);
      for (const fix of fixes) {
        console.log(`  - ${fix.description}: ${fix.count} correcciones`);
      }
      console.log('');
    }
  }

  // Guardar informe
  const report = `# Informe de corrección de errores específicos de TypeScript restantes

## Resumen
- Archivos modificados: ${stats.filesModified}
- Total de cambios: ${stats.totalChanges}

## Detalles por archivo
${Object.entries(stats.changesByFile).filter(([_, fixes]) => fixes.length > 0).map(([file, fixes]) => `
### ${file}
${fixes.map(fix => `- ${fix.description}: ${fix.count} correcciones`).join('\n')}
`).join('\n')}

## Fecha de ejecución
${new Date().toISOString()}
`;

  fs.writeFileSync('ts-remaining-errors-fixes-report.md', report, 'utf8');
  console.log('\nInforme guardado en ts-remaining-errors-fixes-report.md');
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
