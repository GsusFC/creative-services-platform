/**
 * Script para corregir errores en el archivo tailwind.config.ts
 */

import fs from 'fs';
import path from 'path';

console.log('Corrigiendo errores en tailwind.config.ts...');

const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');

// Leer el contenido del archivo
let content = fs.readFileSync(tailwindConfigPath, 'utf8');
const originalContent = content;

// Buscar y corregir propiedades duplicadas
const keyframesMatch = content.match(/keyframes: {[\s\S]*?},/g);
if (keyframesMatch && keyframesMatch.length > 1) {
  // Mantener solo la primera ocurrencia
  for (let i = 1; i < keyframesMatch.length; i++) {
    content = content.replace(keyframesMatch[i], '// Removed duplicate keyframes');
  }
}

const animationMatch = content.match(/animation: {[\s\S]*?},/g);
if (animationMatch && animationMatch.length > 1) {
  // Mantener solo la primera ocurrencia
  for (let i = 1; i < animationMatch.length; i++) {
    content = content.replace(animationMatch[i], '// Removed duplicate animation');
  }
}

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(tailwindConfigPath, content);
  console.log('Archivo tailwind.config.ts corregido');
} else {
  console.log('No se encontraron patrones para corregir en tailwind.config.ts');
}

console.log('Correcciones completadas');
