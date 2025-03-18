import { NextResponse } from 'next/server';
import { getDatabase, NOTION_DATABASE_ID } from '@/lib/notion/client';

export async function GET() {
  try {
    // Obtener datos directamente del cliente para debug
    const response = await getDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa con Notion',
      databaseId: NOTION_DATABASE_ID,
      response: response,
      error: null
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error testing Notion connection:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      error: {
        stack: error.stack,
        code: error.code,
        status: error.status,
      },
      databaseId: NOTION_DATABASE_ID
    }, { status: error.status || 500 });
  }
}
