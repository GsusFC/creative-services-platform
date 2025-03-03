/**
 * Script para corregir errores en el archivo pricing.ts
 */

import fs from 'fs';
import path from 'path';

console.log('Corrigiendo errores en pricing.ts...');

const pricingFilePath = path.join(process.cwd(), 'src/lib/pricing.ts');

// Leer el contenido del archivo
let content = fs.readFileSync(pricingFilePath, 'utf8');
const originalContent = content;

// Corregir el error de discount posiblemente undefined
content = content.replace(/return discount.discountPercentage \|\| 0/g, 'return discount?.discountPercentage || 0');

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(pricingFilePath, content);
  console.log('Archivo pricing.ts corregido');
} else {
  console.log('No se encontraron patrones para corregir en pricing.ts');
}

console.log('Correcciones completadas');
