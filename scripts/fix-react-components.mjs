/**
 * Script para corregir errores comunes en componentes React
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

console.log('Corrigiendo errores en componentes React...');

// Encontrar componentes React con problemas
const targetFiles = [
  'src/components/field-mapper/PerformanceCharts.tsx',
  'src/components/field-mapper/OptimizationRecommendations.tsx',
  'src/components/field-mapper/TransformationConfig.tsx'
];

let totalFixed = 0;

// Procesar cada archivo
targetFiles.forEach(relativeFilePath => {
  const filePath = path.join(process.cwd(), relativeFilePath);
  
  // Verificar si el archivo existe
  if (!fs.existsSync(filePath)) {
    console.log(`Archivo no encontrado: ${relativeFilePath}`);
    return;
  }
  
  // Leer el contenido del archivo
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Corregir problemas comunes en componentes React
  
  // 1. Corregir props sin tipo definido
  if (content.includes('export default function') && !content.includes('Props')) {
    const componentName = path.basename(relativeFilePath, '.tsx');
    content = content.replace(
      `export default function ${componentName}(`,
      `interface ${componentName}Props {}\n\nexport default function ${componentName}(`
    );
    content = content.replace(
      `export default function ${componentName}(`,
      `export default function ${componentName}({}: ${componentName}Props`
    );
  }
  
  // 2. Corregir acceso a propiedades posiblemente undefined
  content = content.replace(/(\w+)\.(\w+)/g, (match, obj, prop) => {
    // Evitar reemplazar imports, exports, etc.
    if (['import', 'export', 'from', 'as', 'default', 'const', 'let', 'var', 'function', 'class', 'interface', 'type'].includes(obj)) {
      return match;
    }
    // Evitar reemplazar objetos conocidos que son seguros
    if (['React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'console'].includes(obj)) {
      return match;
    }
    return `${obj}?.${prop}`;
  });
  
  // 3. Corregir tipos de eventos
  content = content.replace(
    /onClick={\s*\(e\)\s*=>/g, 
    'onClick={(e: React.MouseEvent<HTMLElement>)=>'
  );
  content = content.replace(
    /onChange={\s*\(e\)\s*=>/g, 
    'onChange={(e: React.ChangeEvent<HTMLInputElement>)=>'
  );
  
  // 4. Corregir useState sin tipo
  content = content.replace(
    /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\(\)/g,
    (match, state, setter) => {
      const stateType = state.toLowerCase().includes('count') ? 'number' : 
                       state.toLowerCase().includes('is') || state.toLowerCase().includes('has') ? 'boolean' : 
                       state.toLowerCase().includes('list') || state.toLowerCase().includes('array') ? 'any[]' : 
                       'any';
      return `const [${state}, set${setter}] = useState<${stateType}>()`;
    }
  );
  
  // 5. Corregir useEffect sin dependencias
  content = content.replace(
    /useEffect\(\(\)\s*=>\s*{\s*([^}]+)}\)/g,
    'useEffect(() => {\n    $1\n  }, [])'
  );
  
  // Si se hicieron cambios, guardar el archivo
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Archivo corregido: ${relativeFilePath}`);
    totalFixed++;
  } else {
    console.log(`No se requirieron cambios en: ${relativeFilePath}`);
  }
});

console.log(`Correcciones completadas. Total de archivos corregidos: ${totalFixed}`);
