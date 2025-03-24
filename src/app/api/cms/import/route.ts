import { NextResponse } from 'next/server';
import { NotionService } from '@/lib/notion/service';
import { saveCaseStudy } from '@/lib/storage/case-studies';

export async function POST() {
  try {
    console.log('🔄 Iniciando importación desde Notion...');
    
    const notionService = new NotionService();
    const studies = await notionService.getAllCaseStudies();
    
    console.log(`✅ Se obtuvieron ${studies.length} casos de estudio de Notion`);
    
    // Guardar cada caso de estudio individualmente
    for (const study of studies) {
      await saveCaseStudy({
        ...study,
        synced: true,
        updatedAt: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Importados ${studies.length} casos de estudio`,
      studies: studies.map(s => ({ title: s.title, status: s.status }))
    });
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
