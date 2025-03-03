/**
 * Script para corregir errores comunes de TypeScript
 * 
 * Este script corrige patrones de error que aparecen en múltiples archivos
 * como operadores de acceso opcional incorrectos, problemas con imports, etc.
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

console.log('Corrigiendo errores comunes de TypeScript...');

// Encontrar todos los archivos TypeScript en el proyecto
const tsFiles = glob.sync('src/**/*.{ts,tsx}', {
  cwd: path.join(process.cwd()),
  ignore: ['**/*.d.ts', '**/node_modules/**']
});

let totalFixed = 0;

// Procesar cada archivo
tsFiles.forEach(relativeFilePath => {
  const filePath = path.join(process.cwd(), relativeFilePath);
  
  // Leer el contenido del archivo
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Corregir operadores de acceso opcional
  content = content.replace(/process\?\.(\w+)/g, 'process.$1');
  content = content.replace(/request\?\.(\w+)/g, 'request.$1');
  content = content.replace(/notion\?\.(\w+)/g, 'notion.$1');
  content = content.replace(/property\?\.(\w+)/g, 'property.$1');
  content = content.replace(/option\?\.(\w+)/g, 'option.$1');
  content = content.replace(/t\?\.(\w+)/g, 't.$1');
  
  // Corregir números con punto opcional
  content = content.replace(/(\d)\?\.(\d)/g, '$1.$2');
  
  // Corregir referencias a React
  content = content.replace(/React\?\.(\w+)/g, 'React.$1');
  
  // Corregir referencias a import
  content = content.replace(/import\?\.(\w+)/g, 'import.meta.$1');
  
  // Si se hicieron cambios, guardar el archivo
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Archivo corregido: ${relativeFilePath}`);
    totalFixed++;
  }
});

console.log(`Correcciones completadas. Total de archivos corregidos: ${totalFixed}`);
