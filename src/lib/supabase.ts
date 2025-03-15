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
    const { error } = await supabase.from('case_studies').select('count');
    
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

// Funciones adicionales para la gestión de datos Supabase
