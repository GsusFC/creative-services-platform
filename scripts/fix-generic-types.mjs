/**
 * Fix-Generic-Types
 * 
 * Script especializado para detectar y corregir errores comunes 
 * relacionados con tipos genéricos en TypeScript.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patrones de error comunes con tipos genéricos
const GENERIC_TYPE_ERROR_PATTERNS = [
  {
    // Error de tipo genérico sin especificar
    pattern: /Type '(.+?)' is not assignable to type '(.+?)<(.+?)>'/g,
    description: 'Tipo genérico no especificado o incompatible',
    fix: (content, matches) => {
      // Este es un caso complejo que requiere análisis contextual
      console.log(`  🔍 Analizando error de tipo genérico: ${matches[0]} no asignable a ${matches[1]}<${matches[2]}>`);
      return content;
    }
  },
  {
    // Error de tipo genérico en React.FC
    pattern: /Type '{ (.+?): (.+?); }' is not assignable to type 'IntrinsicAttributes & (.+?)'/g,
    description: 'Props incorrectas en componente con tipo genérico',
    fix: (content, matches) => {
      console.log(`  🔧 Detectadas props incorrectas en componente React: ${matches[0]}`);
      return content;
    }
  },
  {
    // Inferencia incorrecta en Promise<T>
    pattern: /Property '(.+?)' does not exist on type '(.+?)<(.+?)>'/g,
    description: 'Propiedad no existe en tipo genérico (posible problema de Promise)',
    fix: (content, matches) => {
      console.log(`  🔍 Propiedad ${matches[0]} no existe en ${matches[1]}<${matches[2]}>`);
      return content;
    }
  },
  {
    // Array vacío inferido como never[]
    pattern: /Type 'never\[\]' is not assignable to type '(.+?)\[\]'/g,
    description: 'Array vacío inferido como never[]',
    fix: (content, file, match) => {
      console.log(`  🔧 Corrigiendo array vacío inferido como never[] en ${file}`);
      
      // Encuentra la ubicación del arreglo vacío y corrige
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('[]') && !lines[i].includes('as')) {
          // Reemplazar [] con un casting explícito basado en el tipo esperado
          lines[i] = lines[i].replace(/\[\]/g, `[] as ${match[1]}[]`);
          console.log(`  ✅ Línea ${i+1}: Añadido casting explícito para arreglo vacío`);
        }
      }
      
      return lines.join('\n');
    }
  },
  {
    // Falta especificar tipo genérico en hook (useState, useQuery, etc.)
    pattern: /use([A-Z][a-z]+?)<(.+?)>/g,
    description: 'Hook sin tipo genérico especificado',
    fix: (content, file) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        // Detecta hooks de React sin tipo genérico
        if (/const \[[a-zA-Z]+, set[A-Z][a-zA-Z]+\] = useState\(\);/.test(lines[i])) {
          // Intenta inferir el tipo basado en el uso
          let inferredType = 'any'; // Por defecto
          
          // Busca en las próximas líneas para inferir el tipo
          for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
            if (lines[j].includes(lines[i].match(/const \[([a-zA-Z]+)/)[1])) {
              // Intenta determinar el tipo
              if (lines[j].includes('?')) inferredType = 'boolean';
              else if (lines[j].includes('+=') || lines[j].includes('-=')) inferredType = 'number';
              else if (lines[j].includes('\`')) inferredType = 'string';
              break;
            }
          }
          
          lines[i] = lines[i].replace('useState()', `useState<${inferredType}>()`);
          console.log(`  ✅ Línea ${i+1}: Añadido tipo genérico <${inferredType}> a useState`);
        }
        
        // Detecta useQuery sin tipo genérico
        if (/useQuery\(['"](.+?)['"]/.test(lines[i]) && !lines[i].includes('<')) {
          lines[i] = lines[i].replace(/useQuery\(/g, 'useQuery<any, Error>(');
          console.log(`  ✅ Línea ${i+1}: Añadido tipo genérico <any, Error> a useQuery`);
        }
      }
      
      return lines.join('\n');
    }
  }
];

// Función principal
async function fixGenericTypes() {
  console.log('🧬 Iniciando corrección de tipos genéricos...');
  
  // Encontrar archivos TypeScript
  const tsFiles = findTsFiles();
  console.log(`📁 Encontrados ${tsFiles.length} archivos TypeScript para analizar`);
  
  let totalFixed = 0;
  let filesModified = 0;
  
  // Procesar cada archivo
  for (const file of tsFiles) {
    console.log(`\n📄 Analizando ${file}`);
    
    // Leer el archivo
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // Aplicar cada patrón de corrección
    for (const pattern of GENERIC_TYPE_ERROR_PATTERNS) {
      content = applyFixPattern(content, file, pattern);
    }
    
    // Buscar React.FC sin tipos genéricos
    content = fixReactFC(content, file);
    
    // Buscar Promise sin manejo adecuado
    content = fixPromiseHandling(content, file);
    
    // Si el contenido cambió, guardar el archivo
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`  💾 Guardado ${file} con correcciones`);
      filesModified++;
      totalFixed++;
    }
  }
  
  console.log(`\n✅ Proceso completado!`);
  console.log(`📊 Resumen: ${totalFixed} correcciones aplicadas en ${filesModified} archivos`);
}

// Encuentra todos los archivos TypeScript en el proyecto
function findTsFiles() {
  const projectRoot = path.resolve(__dirname, '..');
  const cmd = `find ${projectRoot}/src -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".test." | grep -v ".spec."`;
  
  try {
    const result = execSync(cmd).toString().trim();
    return result.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error al buscar archivos TypeScript:', error);
    return [];
  }
}

// Aplica un patrón de corrección a un archivo
function applyFixPattern(content, file, pattern) {
  const { pattern: regex, description, fix } = pattern;
  
  // Reiniciar regex (necesario para patrones globales)
  regex.lastIndex = 0;
  
  let match;
  let modified = false;
  
  while ((match = regex.exec(content)) !== null) {
    console.log(`  🔍 Encontrado: ${description}`);
    const newContent = fix(content, file, match);
    
    if (newContent !== content) {
      content = newContent;
      modified = true;
      break; // Solo una corrección a la vez para evitar conflictos
    }
  }
  
  return content;
}

// Corrige componentes React.FC sin tipos genéricos
function fixReactFC(content, file) {
  if (!content.includes('React.FC') && !content.includes('FC<')) return content;
  
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    // Buscar componentes React.FC sin tipo genérico
    if ((lines[i].includes('React.FC') || lines[i].includes('FC ')) && !lines[i].includes('<')) {
      console.log(`  🔧 Componente React.FC sin tipo genérico en línea ${i+1}`);
      
      // Extraer el nombre del componente
      const componentNameMatch = lines[i].match(/(?:const|function)\s+([A-Z][a-zA-Z0-9]*)/);
      if (!componentNameMatch) continue;
      
      const componentName = componentNameMatch[1];
      
      // Buscar uso de props
      let propsType = '{}';
      let hasProps = false;
      
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('props') || lines[j].includes('{ ')) {
          hasProps = true;
          break;
        }
      }
      
      if (hasProps) {
        // Crear interfaz de props si no existe
        const propsInterface = `interface ${componentName}Props {}`;
        propsType = `${componentName}Props`;
        
        // Si no hay una interfaz de props definida, añadirla
        if (!content.includes(`interface ${componentName}Props`)) {
          lines.splice(i, 0, propsInterface);
          i++;
        }
      }
      
      // Reemplazar FC sin tipo por FC con tipo
      if (lines[i].includes('React.FC')) {
        lines[i] = lines[i].replace('React.FC', `React.FC<${propsType}>`);
      } else if (lines[i].includes('FC ')) {
        lines[i] = lines[i].replace('FC ', `FC<${propsType}> `);
      }
      
      console.log(`  ✅ Añadido tipo genérico <${propsType}> a FC en línea ${i+1}`);
    }
  }
  
  return lines.join('\n');
}

// Corrige errores comunes con Promises
function fixPromiseHandling(content, file) {
  if (!content.includes('Promise')) return content;
  
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    // Fix 1: Promise sin tipo genérico especificado
    if (lines[i].includes('Promise') && !lines[i].includes('Promise<')) {
      console.log(`  🔧 Promise sin tipo genérico en línea ${i+1}`);
      
      // Trata de inferir el tipo de retorno
      let returnType = 'any';
      
      // Busca un return en el cuerpo de la función
      for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
        if (lines[j].includes('return') && lines[j].includes(';')) {
          if (lines[j].includes('null')) returnType = 'null';
          else if (lines[j].includes('true') || lines[j].includes('false')) returnType = 'boolean';
          else if (lines[j].includes('"') || lines[j].includes("'")) returnType = 'string';
          else if (/return \d+;/.test(lines[j])) returnType = 'number';
          else if (lines[j].includes('[]')) returnType = 'any[]';
          else if (lines[j].includes('{')) returnType = 'Record<string, any>';
          break;
        }
      }
      
      lines[i] = lines[i].replace('Promise', `Promise<${returnType}>`);
      console.log(`  ✅ Añadido tipo genérico <${returnType}> a Promise en línea ${i+1}`);
      modified = true;
    }
    
    // Fix 2: Acceso directo a propiedades de Promise sin await
    if (lines[i].includes('.then(') && lines[i].match(/\.(\w+)\s*;/)) {
      console.log(`  🔧 Posible acceso incorrecto a propiedad de Promise en línea ${i+1}`);
      // Este es un caso complejo que podría requerir refactorización manual
      // Por ahora solo lo reportamos
    }
  }
  
  return modified ? lines.join('\n') : content;
}

// Ejecutar función principal
fixGenericTypes().catch(console.error);
