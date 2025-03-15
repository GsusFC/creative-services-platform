// Script temporal para inspeccionar la estructura de Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validar que las variables de entorno están definidas
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Función principal
async function main() {
  try {
    console.log('🔍 Inspeccionando base de datos Supabase...\n');
    
    // 1. Listar tablas en el esquema public
    console.log('📋 Tablas en la base de datos:');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .not('table_name', 'like', 'pg_%');
    
    if (tablesError) {
      throw new Error(`Error al listar tablas: ${tablesError.message}`);
    }
    
    if (!tables || tables.length === 0) {
      console.log('   No se encontraron tablas en el esquema public');
    } else {
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }
    
    // 2. Verificar si existen las tablas que necesitamos para el módulo Do It Yourself
    const requiredTables = [
      'service_categories',
      'services',
      'budgets',
      'budget_services'
    ];
    
    console.log('\n🔎 Verificando tablas necesarias para Do It Yourself:');
    const existingTables = tables ? tables.map(t => t.table_name) : [];
    
    for (const tableName of requiredTables) {
      const exists = existingTables.includes(tableName);
      console.log(`   ${exists ? '✅' : '❌'} ${tableName}`);
    }
    
    // 3. Si existe una tabla de servicios o categorías, mostrar algunos registros
    if (existingTables.includes('service_categories')) {
      console.log('\n📊 Muestra de categorías de servicios:');
      const { data: categories, error: catError } = await supabase
        .from('service_categories')
        .select('*')
        .limit(5);
      
      if (catError) {
        console.log(`   Error al consultar categorías: ${catError.message}`);
      } else if (categories && categories.length > 0) {
        console.table(categories);
      } else {
        console.log('   No hay categorías registradas');
      }
    }
    
    if (existingTables.includes('services')) {
      console.log('\n📊 Muestra de servicios:');
      const { data: services, error: servError } = await supabase
        .from('services')
        .select('*')
        .limit(5);
      
      if (servError) {
        console.log(`   Error al consultar servicios: ${servError.message}`);
      } else if (services && services.length > 0) {
        console.table(services);
      } else {
        console.log('   No hay servicios registrados');
      }
    }
    
    console.log('\n✨ Inspección completada');
  } catch (error) {
    console.error('Error durante la inspección:', error);
  }
}

// Ejecutar script
main();
