// Script simplificado para inspeccionar Supabase
import { createClient } from '@supabase/supabase-js';

// Credenciales desde las variables de entorno de la aplicación
const supabaseUrl = 'https://myztmiixcmbmlndxesed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15enRtaWl4Y21ibWxuZHhlc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDM0MTUsImV4cCI6MjA1Njg3OTQxNX0._DQwO_QN1UlIu7-ltxSZSJ8steCqr62TmMIyG2j-exQ';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar tablas específicas
async function checkTable(tableName) {
  try {
    console.log(`Verificando tabla: ${tableName}`);
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return false;
    } else {
      console.log(`  ✅ Tabla existe (${count || 0} registros)`);
      if (data && data.length > 0) {
        console.log(`  Ejemplo de registro:`);
        console.log(JSON.stringify(data[0], null, 2));
      }
      return true;
    }
  } catch (e) {
    console.log(`  ❌ Error al verificar: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Inspeccionando Supabase...\n');
  console.log(`URL: ${supabaseUrl}\n`);
  
  // Verificar conexión
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(`Error de conexión: ${error.message}`);
    } else {
      console.log('✅ Conexión establecida correctamente\n');
    }
  } catch (e) {
    console.log(`Error de conexión: ${e.message}`);
    return;
  }
  
  // Lista de tablas a verificar
  const tables = [
    'service_categories',
    'services', 
    'budgets', 
    'budget_services',
    // Otras tablas que podrían existir
    'case_studies',
    'media_items'
  ];
  
  // Verificar cada tabla
  for (const table of tables) {
    await checkTable(table);
    console.log(''); // Espacio entre tablas
  }
  
  console.log('✨ Inspección completa');
}

main().catch(err => {
  console.error('Error general:', err);
});
