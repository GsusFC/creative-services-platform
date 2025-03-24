#!/usr/bin/env ts-node
/**
 * Script para migrar los case studies del formato antiguo (un solo JSON) 
 * al nuevo formato (JSON individuales + índice)
 * 
 * Ejecutar con: npm run migrate-case-studies
 */

const { migrateToIndividualFiles } = require('../lib/storage/case-studies');

async function main() {
  console.log('Iniciando migración de case studies...');
  
  try {
    const success = await migrateToIndividualFiles();
    
    if (success) {
      console.log('✅ Migración completada con éxito.');
      console.log('Los case studies ahora están almacenados en archivos individuales.');
      console.log('Se ha creado un índice para acceso rápido a los datos.');
      console.log('El archivo original se ha respaldado como data/case-studies.json.bak');
    } else {
      console.error('❌ La migración falló. Verifica los logs para más detalles.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

main();
