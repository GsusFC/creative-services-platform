#!/usr/bin/env node

/**
 * Script para reemplazar 'any' con tipos específicos
 * 
 * Este script analiza los archivos del Field Mapper y sugiere reemplazos
 * para el tipo 'any' con tipos más específicos.
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
  white: '\x1b[37m',
};

// Directorios a analizar
const directories = [
  'src/lib/field-mapper',
  'src/components/field-mapper',
  'src/app/api/notion'
];

console.log(`${colors.cyan}Analizando uso de 'any' en el Field Mapper...${colors.reset}\n`);

// Encontrar todos los archivos TypeScript en los directorios especificados
let allFiles = [];
directories.forEach(dir => {
  try {
    const output = execSync(`find ${dir} -type f -name "*.ts" -o -name "*.tsx"`, { encoding: 'utf8' });
    allFiles = allFiles.concat(output.trim().split('\n').filter(Boolean));
  } catch (error) {
    console.error(`${colors.red}Error al buscar archivos en ${dir}:${colors.reset}`, error.message);
  }
});

console.log(`${colors.green}Encontrados ${allFiles.length} archivos para analizar${colors.reset}\n`);

// Buscar uso de 'any'
const anyUsage = {};

allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar usos de 'any'
    const anyRegex = /\bany\b/g;
    const matches = content.match(anyRegex);
    
    if (matches && matches.length > 0) {
      anyUsage[filePath] = {
        count: matches.length,
        contexts: []
      };
      
      // Buscar el contexto de cada uso de 'any'
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('any')) {
          anyUsage[filePath].contexts.push({
            line: index + 1,
            content: line.trim(),
            suggestion: suggestReplacement(line, filePath)
          });
        }
      });
    }
  } catch (error) {
    console.error(`${colors.red}Error al analizar ${filePath}:${colors.reset}`, error.message);
  }
});

// Mostrar resultados
console.log(`${colors.cyan}=== Uso de 'any' por archivo ===${colors.reset}`);

Object.keys(anyUsage).sort().forEach(file => {
  const usage = anyUsage[file];
  console.log(`\n${colors.yellow}${file}${colors.reset} (${usage.count} ocurrencias)`);
  
  usage.contexts.forEach(context => {
    console.log(`  ${colors.magenta}Línea ${context.line}:${colors.reset} ${context.content}`);
    console.log(`    ${colors.green}Sugerencia:${colors.reset} ${context.suggestion}`);
  });
});

// Preguntar si se desea aplicar las sugerencias
console.log(`\n${colors.cyan}¿Desea aplicar automáticamente las sugerencias? (s/n)${colors.reset}`);
console.log(`Por seguridad, este script no aplicará cambios automáticamente.`);
console.log(`Revise las sugerencias y aplique los cambios manualmente en los archivos indicados.`);

// Guardar un informe de las sugerencias
const reportOutput = `
# Informe de Uso de 'any' en el Field Mapper

Fecha: ${new Date().toLocaleString()}

## Resumen

Total de archivos con 'any': ${Object.keys(anyUsage).length}
Total de ocurrencias: ${Object.keys(anyUsage).reduce((sum, file) => sum + anyUsage[file].count, 0)}

## Detalle por archivo

${Object.keys(anyUsage).sort().map(file => {
  const usage = anyUsage[file];
  return `### ${file} (${usage.count} ocurrencias)

${usage.contexts.map(context => {
  return `**Línea ${context.line}:** \`${context.content}\`
- Sugerencia: ${context.suggestion}`;
}).join('\n\n')}
`;
}).join('\n')}

## Recomendaciones generales

1. Reemplazar \`any[]\` con un tipo de array específico, como \`T[]\` donde T es un tipo concreto
2. Usar \`unknown\` en lugar de \`any\` cuando no se conoce el tipo exacto pero se necesita verificación de tipo
3. Crear interfaces o tipos para objetos complejos en lugar de usar \`Record<string, any>\`
4. Utilizar genéricos para funciones que pueden trabajar con múltiples tipos
5. Considerar el uso de \`Partial<T>\` para objetos que pueden tener propiedades opcionales

## Próximos pasos

1. Revisar cada sugerencia y aplicar los cambios apropiados
2. Ejecutar pruebas para verificar que los cambios no han introducido errores
3. Actualizar la documentación para reflejar los nuevos tipos
`;

fs.writeFileSync('field-mapper-any-usage-report.md', reportOutput);
console.log(`\n${colors.green}Informe guardado en field-mapper-any-usage-report.md${colors.reset}`);

// Función para sugerir reemplazos
function suggestReplacement(line, filePath) {
  // Extraer el contexto del uso de 'any'
  if (line.includes('any[]')) {
    // Array de any
    if (filePath.includes('field-mapper')) {
      return "Reemplazar 'any[]' con 'Field[]', 'FieldMapping[]' u otro tipo de array específico";
    }
    return "Reemplazar 'any[]' con un tipo de array específico, como 'T[]'";
  } else if (line.includes(': any,') || line.includes(': any)') || line.includes(': any;')) {
    // Parámetro o propiedad de tipo any
    if (line.includes('data') || line.includes('result')) {
      return "Reemplazar 'any' con un tipo específico como 'Record<string, unknown>' o crear una interfaz";
    } else if (line.includes('event')) {
      return "Reemplazar 'any' con 'React.ChangeEvent<HTMLInputElement>' u otro tipo de evento específico";
    } else if (line.includes('props')) {
      return "Crear una interfaz Props específica para este componente";
    }
    return "Reemplazar 'any' con un tipo más específico basado en el uso";
  } else if (line.includes('as any')) {
    // Type assertion
    return "Evitar 'as any' y usar un tipo específico para la aserción";
  } else if (line.includes('Record<string, any>')) {
    // Record con any
    return "Reemplazar 'Record<string, any>' con 'Record<string, unknown>' o un tipo más específico";
  } else if (line.includes('Promise<any>')) {
    // Promise de any
    return "Reemplazar 'Promise<any>' con 'Promise<T>' donde T es el tipo de resultado esperado";
  } else if (line.includes('function') && line.includes('any')) {
    // Función con parámetros any
    return "Usar genéricos o tipos específicos para los parámetros de la función";
  }
  
  // Caso general
  return "Reemplazar 'any' con un tipo más específico o 'unknown' si es necesario";
}
