'use server';

import { NotionService } from '@/lib/notion/service';
import { saveCaseStudy } from '@/lib/storage/case-studies';
import { revalidatePath } from 'next/cache';

export async function importFromNotion(formData: FormData) {
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

    // Revalidar la ruta de casos de estudio
    revalidatePath('/admin/case-studies');
    
    return {
      success: true,
      message: `Importados ${studies.length} casos de estudio`,
      studies: studies.map(s => ({ title: s.title, status: s.status }))
    };
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  }
}
