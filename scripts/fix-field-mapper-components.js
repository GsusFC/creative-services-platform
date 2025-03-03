/**
 * Script para corregir errores en los componentes del Field Mapper
 *
 * Este script se enfoca en corregir patrones comunes de errores en los componentes
 * React del Field Mapper, incluyendo problemas de tipado, operadores opcionales
 * innecesarios y declaraciones incorrectas.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Directorio de componentes del Field Mapper
const COMPONENTS_DIR = path.join(__dirname, '../src/components/field-mapper');

// Patrones de errores comunes en los componentes
const COMPONENT_ERROR_PATTERNS = [
  // Operadores opcionales innecesarios
  { pattern: /React\?\./g, replacement: 'React.' },
  { pattern: /useState\?\.</g, replacement: 'useState<' },
  { pattern: /useEffect\?\(/g, replacement: 'useEffect(' },
  { pattern: /useRef\?\.</g, replacement: 'useRef<' },
  { pattern: /useCallback\?\(/g, replacement: 'useCallback(' },
  { pattern: /useMemo\?\(/g, replacement: 'useMemo(' },
  
  // Tipos incorrectos
  { pattern: /React\.FC<(\w+)>/g, replacement: 'React.FC<$1>' },
  { pattern: /React\.ReactNode\?/g, replacement: 'React.ReactNode' },
  
  // Operadores de acceso opcional innecesarios para métodos estándar
  { pattern: /\.map\?\(/g, replacement: '.map(' },
  { pattern: /\.filter\?\(/g, replacement: '.filter(' },
  { pattern: /\.reduce\?\(/g, replacement: '.reduce(' },
  { pattern: /\.forEach\?\(/g, replacement: '.forEach(' },
  { pattern: /\.join\?\(/g, replacement: '.join(' },
  { pattern: /\.includes\?\(/g, replacement: '.includes(' },
  
  // Nombres de variables de estado incorrectos
  { pattern: /const \[(\w+), set\1\] = useState\?\.</g, replacement: 'const [$1, set$1] = useState<' },
  
  // Props opcionales incorrectas
  { pattern: /(\w+)\?:\s*(React\.ReactNode|string|number|boolean|any\[\])/g, replacement: '$1?: $2' },
  
  // Sintaxis incorrecta de tipos genéricos
  { pattern: /<(\w+)>\?/g, replacement: '<$1>' },
];

/**
 * Función para corregir un archivo de componente
 * @param {string} filePath - Ruta al archivo
 * @returns {Promise<boolean>} - True si se realizaron cambios
 */
async function fixComponentFile(filePath) {
  try {
    console.log(`Procesando: ${filePath}`);
    
    // Leer el contenido del archivo
    const content = await readFileAsync(filePath, 'utf8');
    
    // Aplicar correcciones
    let correctedContent = content;
    
    COMPONENT_ERROR_PATTERNS.forEach(({ pattern, replacement }) => {
      if (typeof replacement === 'function') {
        correctedContent = correctedContent.replace(pattern, replacement);
      } else {
        correctedContent = correctedContent.replace(pattern, replacement);
      }
    });
    
    // Guardar si hay cambios
    if (content !== correctedContent) {
      await writeFileAsync(filePath, correctedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error al procesar ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Función para encontrar y procesar todos los archivos .tsx en un directorio
 * @param {string} dir - Directorio a procesar
 * @returns {Promise<string[]>} - Lista de archivos procesados
 */
async function processDirectory(dir) {
  const processedFiles = [];
  
  try {
    const files = await readdirAsync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await statAsync(filePath);
      
      if (stats.isDirectory()) {
        // Recursivamente procesar subdirectorios
        const subDirFiles = await processDirectory(filePath);
        processedFiles.push(...subDirFiles);
      } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
        // Procesar archivos .tsx y .ts
        const wasFixed = await fixComponentFile(filePath);
        if (wasFixed) {
          processedFiles.push(filePath);
        }
      }
    }
    
    return processedFiles;
  } catch (error) {
    console.error(`Error al procesar directorio ${dir}:`, error.message);
    return processedFiles;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🛠️ Iniciando corrección de componentes del Field Mapper');
  
  try {
    const fixedFiles = await processDirectory(COMPONENTS_DIR);
    
    console.log(`\n📊 Resumen: Corregidos ${fixedFiles.length} archivos`);
    
    if (fixedFiles.length > 0) {
      console.log('\nArchivos corregidos:');
      fixedFiles.forEach(file => console.log(`- ${path.relative(__dirname, file)}`));
    }
  } catch (error) {
    console.error('❌ Error en la ejecución del script:', error);
  }
}

// Ejecutar el script
main().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
