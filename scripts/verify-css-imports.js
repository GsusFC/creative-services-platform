/**
 * Script para verificar que todos los archivos CSS están siendo importados correctamente en main.css
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const STYLES_DIR = path.join(__dirname, '..', 'src', 'styles');
const MAIN_CSS = path.join(STYLES_DIR, 'main.css');

/**
 * Lee recursivamente todos los archivos CSS en un directorio
 * @param {string} dir - Directorio a leer
 * @returns {Promise<string[]>} - Lista de rutas de archivos CSS
 */
async function readCssFiles(dir) {
  const files = await readdir(dir);
  const cssFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      const subDirFiles = await readCssFiles(filePath);
      cssFiles.push(...subDirFiles);
    } else if (path.extname(file) === '.css' && file !== 'main.css') {
      cssFiles.push(filePath);
    }
  }

  return cssFiles;
}

/**
 * Verifica que todos los archivos CSS están siendo importados en main.css
 */
async function verifyCssImports() {
  try {
    // Leer el contenido de main.css
    const mainCssContent = await readFile(MAIN_CSS, 'utf8');
    
    // Obtener todos los archivos CSS en el directorio de estilos
    const cssFiles = await readCssFiles(STYLES_DIR);
    
    console.log(`\nVerificando importaciones de CSS en main.css...\n`);
    console.log(`Encontrados ${cssFiles.length} archivos CSS en el directorio de estilos.\n`);
    
    // Verificar cada archivo
    let allImported = true;
    const notImported = [];
    
    for (const cssFile of cssFiles) {
      const relativePath = path.relative(STYLES_DIR, cssFile).replace(/\\/g, '/');
      const importStatement = `@import "./${relativePath}";`;
      
      if (!mainCssContent.includes(importStatement)) {
        allImported = false;
        notImported.push(relativePath);
      }
    }
    
    if (allImported) {
      console.log('✅ Todos los archivos CSS están siendo importados correctamente en main.css.');
    } else {
      console.log('❌ Los siguientes archivos CSS no están siendo importados en main.css:');
      notImported.forEach(file => console.log(`   - ${file}`));
      console.log('\nAsegúrate de añadir las importaciones necesarias a main.css.');
    }
    
  } catch (error) {
    console.error('Error al verificar las importaciones de CSS:', error);
  }
}

// Ejecutar la verificación
verifyCssImports();
