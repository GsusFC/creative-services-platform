// Script temporal para inspeccionar la estructura de Supabase
import { createClient } from '@supabase/supabase-js';
import process from 'process';

// Credenciales proporcionadas directamente
const supabaseUrl = 'https://evlqlqozxtwesjzjgrez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bHFscW96eHR3ZXNqempncmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MzY0NTgsImV4cCI6MjA1NzIxMjQ1OH0.o5zkpoz3Yyz19WdUw0CU_wkJ-_5sFrGQ0qRfs_RfOrA';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función principal
async function main() {
  try {
    console.log('🔍 Inspeccionando base de datos Supabase...\n');
    
    // 1. Listar tablas en el esquema public
    console.log('📋 Tablas en la base de datos:');
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('get_table_info');
    
    if (tablesError) {
      console.log(`   Error al ejecutar RPC get_table_info: ${tablesError.message}`);
      console.log('   Intentando consulta alternativa...');
      
      // Consulta alternativa si no existe la función RPC
      const { data: tables2, error: tables2Error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (tables2Error) {
        throw new Error(`Error al listar tablas: ${tables2Error.message}`);
      }
      
      if (!tables2 || tables2.length === 0) {
        console.log('   No se encontraron tablas en el esquema public');
      } else {
        tables2.forEach(table => {
          console.log(`   - ${table.tablename}`);
        });
      }
    } else {
      if (!tablesData || tablesData.length === 0) {
        console.log('   No se encontraron tablas en el esquema public');
      } else {
        tablesData.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
    }
    
    // 2. Verificar si existen las tablas que necesitamos para el módulo Do It Yourself
    const requiredTables = [
      'service_categories',
      'services',
      'budgets',
      'budget_services'
    ];
    
    console.log('\n🔎 Verificando tablas necesarias para Do It Yourself:');
    
    // Consultar cada tabla directamente para mayor fiabilidad
    for (const tableName of requiredTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`   ❌ ${tableName} - No existe o no se puede acceder`);
        } else {
          console.log(`   ✅ ${tableName} - Existe (${count || 0} registros)`);
        }
      } catch (e) {
        console.log(`   ❌ ${tableName} - Error al verificar: ${e.message}`);
      }
    }
    
    // 3. Obtener información de esquema para las tablas existentes
    console.log('\n📊 Estructura de tablas:');
    
    for (const tableName of requiredTables) {
      try {
        // Intentar obtener información de columnas
        const { data: columns, error } = await supabase
          .rpc('get_table_columns', { table_name: tableName });
        
        if (error) {
          console.log(`   Tabla ${tableName}: No se pudo obtener estructura`);
        } else if (columns && columns.length > 0) {
          console.log(`   Tabla ${tableName}:`);
          columns.forEach(col => {
            console.log(`     - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
          });
        }
      } catch (e) {
        // Silenciar errores para tablas que no existen
      }
    }
    
    console.log('\n✨ Inspección completada');
  } catch (error) {
    console.error('Error durante la inspección:', error);
  }
}

// Ejecutar script
main();
