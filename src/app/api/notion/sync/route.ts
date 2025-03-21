import { NextResponse } from 'next/server';
import { NotionService } from '@/lib/notion/service';

export async function GET() {
  try {
    const notionService = new NotionService();
    const studies = await notionService.getAllCaseStudies();
    
    return NextResponse.json({
      success: true,
      data: studies
    });
  } catch (error) {
    console.error('Error syncing with Notion:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al sincronizar con Notion' 
      },
      { status: 500 }
    );
  }
}
