import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ENV_FILE = path.join(process.cwd(), '.env.local');

/**
 * Actualiza la configuración del CMS
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verificar que tenemos las variables de entorno necesarias
    if (!data.notionDatabaseId || !data.notionApiKey) {
      return NextResponse.json(
        { error: 'Database ID y API Key de Notion son requeridos' },
        { status: 400 }
      );
    }

    // Leer el archivo .env.local
    let envContent = await fs.readFile(ENV_FILE, 'utf-8');

    // Actualizar las variables de Notion
    envContent = envContent.replace(
      /NEXT_PUBLIC_NOTION_DATABASE_ID=".*"/,
      `NEXT_PUBLIC_NOTION_DATABASE_ID="${data.notionDatabaseId}"`
    );

    envContent = envContent.replace(
      /NEXT_PUBLIC_NOTION_API_KEY=".*"/,
      `NEXT_PUBLIC_NOTION_API_KEY="${data.notionApiKey}"`
    );

    // Guardar los cambios
    await fs.writeFile(ENV_FILE, envContent, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la configuración' },
      { status: 500 }
    );
  }
}

/**
 * Obtiene la configuración actual del CMS
 */
export async function GET() {
  try {
    return NextResponse.json({
      notionDatabaseId: process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] || '',
      notionApiKeyConfigured: Boolean(process.env['NEXT_PUBLIC_NOTION_API_KEY'])
    });
  } catch (error) {
    console.error('Error al obtener la configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener la configuración' },
      { status: 500 }
    );
  }
}
