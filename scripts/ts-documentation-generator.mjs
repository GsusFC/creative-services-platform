/**
 * TS-Documentation-Generator
 * 
 * Genera documentación automática de errores TypeScript encontrados y sus soluciones.
 * Esto crea una base de conocimiento para el equipo y facilita el aprendizaje.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base de conocimiento de errores y soluciones
const ERROR_KNOWLEDGE_BASE = {
  'TS2571': {
    title: 'Objeto posiblemente \'null\' o \'undefined\'',
    description: 'El operador de acceso a propiedad común \'.\' no funcionará con valores que pueden ser nulos o indefinidos.',
    solution: 'Utiliza el operador de encadenamiento opcional \'?.\' o realiza una comprobación previa.',
    example: `
// ❌ Error
const value = obj.property;

// ✅ Solución 1: Usar operador de encadenamiento opcional
const value = obj?.property;

// ✅ Solución 2: Comprobar antes
if (obj) {
  const value = obj.property;
}`
  },
  'TS2322': {
    title: 'Tipo no asignable',
    description: 'Un tipo no es asignable a otro tipo esperado.',
    solution: 'Asegúrate de que los tipos coincidan o utiliza un tipo más específico. En algunos casos, puedes usar casting de tipos.',
    example: `
// ❌ Error
const values: string[] = [1, 2, 3];

// ✅ Solución 1: Corrección de tipo
const values: number[] = [1, 2, 3];

// ✅ Solución 2: Casting explícito (usar con cuidado)
const values = [1, 2, 3] as unknown as string[];`
  },
  'TS2339': {
    title: 'La propiedad no existe en el tipo',
    description: 'Se está intentando acceder a una propiedad que no existe en el tipo del objeto.',
    solution: 'Verifica que la propiedad exista en el tipo, añade la propiedad al tipo, o utiliza un casting apropiado.',
    example: `
// ❌ Error
interface User { name: string; }
const user: User = { name: 'Juan' };
console.log(user.age); // Error: La propiedad 'age' no existe en el tipo 'User'

// ✅ Solución 1: Añadir la propiedad al tipo
interface User { name: string; age?: number; }

// ✅ Solución 2: Usar intersección de tipos
const user = { name: 'Juan', age: 30 } as User & { age: number };`
  },
  'TS7006': {
    title: 'Parámetro implícitamente tiene tipo \'any\'',
    description: 'Un parámetro no tiene un tipo explícito y TypeScript lo infiere como \'any\'.',
    solution: 'Añade una anotación de tipo explícita al parámetro.',
    example: `
// ❌ Error
function process(data) {
  return data.id;
}

// ✅ Solución: Añadir tipo explícito
function process(data: { id: string }) {
  return data.id;
}`
  },
  'TS2531': {
    title: 'Objeto posiblemente \'null\'',
    description: 'Se está accediendo a un objeto que podría ser null.',
    solution: 'Usa el operador de aserción no nulo (!) si estás seguro que no será null, o usa una comprobación condicional.',
    example: `
// ❌ Error
const element = document.getElementById('app');
element.innerHTML = 'Hello'; // Error: 'element' posiblemente sea null

// ✅ Solución 1: Comprobación condicional
if (element) {
  element.innerHTML = 'Hello';
}

// ✅ Solución 2: Aserción no nula (solo si estás seguro)
const element = document.getElementById('app')!;
element.innerHTML = 'Hello';`
  },
  'TS2366': {
    title: 'Esta condición siempre devolverá \'true\'',
    description: 'Una condición que siempre evaluará a true debido a tipos incompatibles.',
    solution: 'Verifica y corrige los tipos de la comparación.',
    example: `
// ❌ Error
if (someValue !== undefined || someValue !== null) {
  // Siempre será true porque no puede ser ambos a la vez
}

// ✅ Solución: Usar operador lógico correcto
if (someValue !== undefined && someValue !== null) {
  // Esta es la forma correcta
}`
  },
  'TS2769': {
    title: 'No hay sobrecarga que espere 2 argumentos',
    description: 'Estás llamando a una función con un número incorrecto de argumentos.',
    solution: 'Verifica la definición de la función y proporciona el número correcto de argumentos.',
    example: `
// ❌ Error
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
greet('John', 'Smith'); // Error: No hay sobrecarga que espere 2 argumentos

// ✅ Solución: Proporcionar los argumentos correctos
greet('John');`
  },
  'TS2454': {
    title: 'La variable se usa antes de asignarse',
    description: 'Una variable se está utilizando antes de que se le asigne un valor.',
    solution: 'Asigna un valor a la variable antes de usarla.',
    example: `
// ❌ Error
let value: string;
console.log(value); // Error: La variable 'value' se usa antes de asignarse

// ✅ Solución: Asignar un valor antes de usar
let value: string = '';
console.log(value);`
  },
  'TS2345': {
    title: 'El argumento no es asignable al parámetro',
    description: 'El tipo del argumento proporcionado no coincide con el tipo del parámetro de la función.',
    solution: 'Asegúrate de que el tipo del argumento coincida con el tipo del parámetro.',
    example: `
// ❌ Error
function processUser(user: { id: number; name: string }) {
  // ...
}
processUser({ id: '123', name: 'Juan' }); // Error: El tipo 'string' no es asignable al tipo 'number'

// ✅ Solución: Corregir el tipo del argumento
processUser({ id: 123, name: 'Juan' });`
  },
  'TS2554': {
    title: 'Se esperaba 0 argumentos pero se recibieron N',
    description: 'Se está llamando a una función con un número incorrecto de argumentos.',
    solution: 'Proporciona el número correcto de argumentos según la definición de la función.',
    example: `
// ❌ Error
function closeModal() {
  // ...
}
closeModal('force'); // Error: Se esperaba 0 argumentos pero se recibió 1

// ✅ Solución: Llamar con el número correcto de argumentos
closeModal();`
  }
};

// Función principal
async function generateDocumentation() {
  console.log('📚 Generando documentación de errores TypeScript...');
  
  // Ejecutar el compilador para obtener errores
  const errors = getCompilationErrors();
  
  // Agrupar errores por tipo
  const errorsByType = groupErrorsByType(errors);
  
  // Generar documentación en Markdown
  const documentationContent = createDocumentation(errorsByType);
  
  // Guardar la documentación
  const docsPath = path.join(__dirname, '../docs');
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  }
  
  const docFilePath = path.join(docsPath, 'typescript-errors-guide.md');
  fs.writeFileSync(docFilePath, documentationContent);
  
  console.log(`✅ Documentación generada: ${docFilePath}`);
  
  // Generar resumen de errores más comunes
  generateErrorSummary(errorsByType);
}

// Obtener errores de compilación
function getCompilationErrors() {
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

// Agrupar errores por tipo
function groupErrorsByType(errors) {
  const grouped = {};
  
  errors.forEach(error => {
    if (!grouped[error.code]) {
      grouped[error.code] = {
        code: error.code,
        count: 0,
        examples: [],
        message: error.message
      };
    }
    
    grouped[error.code].count++;
    
    // Limitar a 3 ejemplos por tipo de error
    if (grouped[error.code].examples.length < 3) {
      grouped[error.code].examples.push({
        file: error.file,
        line: error.line,
        column: error.column,
        message: error.message
      });
    }
  });
  
  // Ordenar por frecuencia
  return Object.values(grouped).sort((a, b) => b.count - a.count);
}

// Generar documentación en Markdown
function createDocumentation(errorsByType) {
  const now = new Date();
  const dateFormatted = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  
  let content = `# Guía de Errores TypeScript
  
> Generado automáticamente el ${dateFormatted}

Esta guía documenta los errores de TypeScript más comunes en el proyecto y cómo solucionarlos.

## Índice de contenidos

`;

  // Crear índice
  errorsByType.forEach(error => {
    content += `- [TS${error.code.slice(2)} - ${ERROR_KNOWLEDGE_BASE[error.code]?.title || error.message}](#${error.code})\n`;
  });
  
  content += '\n## Errores y soluciones\n\n';
  
  // Crear secciones detalladas para cada error
  errorsByType.forEach(error => {
    const errorInfo = ERROR_KNOWLEDGE_BASE[error.code] || {
      title: 'Error sin documentación específica',
      description: error.message,
      solution: 'Revisa la documentación oficial de TypeScript.',
      example: '// No hay ejemplo disponible para este error'
    };
    
    content += `### <a id="${error.code}"></a>${error.code} - ${errorInfo.title}

**Frecuencia:** ${error.count} ocurrencias

**Descripción:**  
${errorInfo.description}

**Solución recomendada:**  
${errorInfo.solution}

**Ejemplo de código:**
\`\`\`typescript
${errorInfo.example}
\`\`\`

**Ejemplos en el proyecto:**
`;

    error.examples.forEach(example => {
      content += `
- \`${example.file}\` (línea ${example.line})
  - \`${example.message}\`
`;
    });
    
    content += '\n---\n\n';
  });
  
  content += `## Recursos adicionales

- [Documentación oficial de TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Error Translator](https://ts-error-translator.vercel.app/)
`;
  
  return content;
}

// Genera un resumen de los errores más comunes
function generateErrorSummary(errorsByType) {
  if (errorsByType.length === 0) {
    console.log('No se encontraron errores de TypeScript.');
    return;
  }
  
  const summaryPath = path.join(__dirname, '../docs', 'typescript-errors-summary.md');
  
  let summaryContent = '# Resumen de Errores TypeScript Más Comunes\n\n';
  summaryContent += `> Generado el ${new Date().toLocaleDateString()}\n\n`;
  summaryContent += '| Código | Descripción | Ocurrencias | Principal ubicación |\n';
  summaryContent += '|--------|-------------|-------------|--------------------|\n';
  
  errorsByType.slice(0, 10).forEach(error => {
    const errorInfo = ERROR_KNOWLEDGE_BASE[error.code];
    const mainLocation = error.examples.length > 0 ? `${error.examples[0].file}:${error.examples[0].line}` : 'N/A';
    
    summaryContent += `| ${error.code} | ${errorInfo?.title || error.message} | ${error.count} | \`${mainLocation}\` |\n`;
  });
  
  summaryContent += '\n## Próximos pasos recomendados\n\n';
  
  // Recomendar acciones basadas en los errores más comunes
  if (errorsByType.length > 0) {
    const topError = errorsByType[0];
    
    if (ERROR_KNOWLEDGE_BASE[topError.code]) {
      summaryContent += `1. Concentrarse en resolver los errores ${topError.code} (${ERROR_KNOWLEDGE_BASE[topError.code].title}) que son los más frecuentes\n`;
      summaryContent += `2. Revisar la documentación completa para encontrar soluciones detalladas\n`;
      
      // Recomendaciones específicas según el tipo de error
      if (topError.code === 'TS2571' || topError.code === 'TS2531') {
        summaryContent += `3. Considerar una revisión de la gestión de valores nulos en todo el proyecto\n`;
      } else if (topError.code === 'TS2322') {
        summaryContent += `3. Revisar las definiciones de tipos en el proyecto para hacerlas más precisas\n`;
      } else if (topError.code === 'TS7006') {
        summaryContent += `3. Implementar una regla de ESLint que prohíba los tipos implícitos\n`;
      }
    }
  }
  
  fs.writeFileSync(summaryPath, summaryContent);
  console.log(`✅ Resumen de errores generado: ${summaryPath}`);
}

// Ejecutar función principal
generateDocumentation().catch(console.error);
