/**
 * Script para corregir errores específicos en PerformanceCharts.tsx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Corrigiendo errores en PerformanceCharts.tsx...');

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo
const filePath = path.join(__dirname, '../src/components/field-mapper/PerformanceCharts.tsx');

// Verificar si el archivo existe
if (!fs.existsSync(filePath)) {
  console.log('Archivo no encontrado: PerformanceCharts.tsx');
  process.exit(1);
}

// Leer el contenido del archivo
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar los números con operador opcional
content = content.replace(/0\?\.5/g, '0.5');
content = content.replace(/0\?\.7/g, '0.7');

// Guardar el archivo
fs.writeFileSync(filePath, content);

console.log('Archivo corregido: PerformanceCharts.tsx');
console.log('Correcciones completadas.');
