import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

/**
 * Endpoint para guardar configuraciones de conexión
 * 
 * IMPORTANTE: Esta implementación es solo para desarrollo local.
 * En un entorno de producción, NUNCA se deben almacenar credenciales
 * de esta manera y se recomienda usar variables de entorno seguras
 * a través de plataformas como Vercel.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Valida que los datos requeridos estén presentes
    if (!data.supabaseUrl || !data.supabaseKey) {
      return NextResponse.json(
        { error: 'URL y API Key de Supabase son requeridos' },
        { status: 400 }
      )
    }
    
    // Obtener el contenido actual del archivo .env
    const envPath = path.join(process.cwd(), '.env')
    let envContent = await fs.readFile(envPath, 'utf-8')
    
    // Actualizar las variables de Supabase
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_URL=".*"/,
      `NEXT_PUBLIC_SUPABASE_URL="${data.supabaseUrl}"`
    )
    
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY=".*"/,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY="${data.supabaseKey}"`
    )
    
    // Si hay configuración de Notion, actualizarla también
    if (data.notionApiKey) {
      envContent = envContent.replace(
        /NOTION_API_KEY=".*"/,
        `NOTION_API_KEY="${data.notionApiKey}"`
      )
    }
    
    if (data.notionDatabaseId) {
      envContent = envContent.replace(
        /NOTION_DATABASE_ID=".*"/,
        `NOTION_DATABASE_ID="${data.notionDatabaseId}"`
      )
    }
    
    // Guardar el archivo .env actualizado
    await fs.writeFile(envPath, envContent)
    
    // Retornar respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Configuración guardada exitosamente. La aplicación necesita reiniciarse para aplicar los cambios.'
    })
    
  } catch (error) {
    console.error('Error al guardar la configuración:', error)
    return NextResponse.json(
      { 
        error: 'Error al guardar la configuración',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * Endpoint para obtener la configuración actual
 */
export async function GET() {
  try {
    // En un entorno real, esto podría obtener las configuraciones de una base de datos segura
    // Aquí simplemente devolvemos los valores de las variables de entorno
    return NextResponse.json({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      // No devolvemos la clave por seguridad, solo si está configurada
      supabaseKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      notionApiKeyConfigured: Boolean(process.env.NOTION_API_KEY),
      notionDatabaseId: process.env.NOTION_DATABASE_ID || ''
    })
    
  } catch (error) {
    console.error('Error al obtener la configuración:', error)
    return NextResponse.json(
      { error: 'Error al obtener la configuración' },
      { status: 500 }
    )
  }
}
