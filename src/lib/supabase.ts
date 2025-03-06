import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Crear un cliente de Supabase usando las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Faltan variables de entorno para Supabase. Asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Verifica la conexión con Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  try {
    // Intentar una operación simple para verificar la conexión
    const { data, error } = await supabase.from('case_studies').select('count');
    
    if (error) throw error;
    
    return { connected: true };
  } catch (error) {
    console.error('Error conectando con Supabase:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Verifica el estado del Foreign Data Wrapper de Notion
 */
export async function checkNotionFdwStatus(): Promise<{
  configured: boolean;
  databaseCount?: number;
  error?: string;
}> {
  try {
    // Esta es una consulta de ejemplo. El esquema específico dependerá 
    // de cómo esté configurado el FDW de Notion en Supabase
    const { data, error } = await supabase.rpc('check_notion_fdw_status');
    
    if (error) throw error;
    
    return {
      configured: Boolean(data?.configured),
      databaseCount: data?.database_count || 0,
    };
  } catch (error) {
    console.error('Error verificando el estado del FDW de Notion:', error);
    return {
      configured: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Sincroniza los datos entre Notion y Supabase
 */
export async function syncNotionData(): Promise<{
  success: boolean;
  added?: number;
  updated?: number;
  error?: string;
}> {
  try {
    // Llamar a una función de RPC en Supabase que maneje la sincronización
    const { data, error } = await supabase.rpc('sync_notion_data');
    
    if (error) throw error;
    
    return {
      success: true,
      added: data?.added || 0,
      updated: data?.updated || 0,
    };
  } catch (error) {
    console.error('Error sincronizando datos con Notion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
