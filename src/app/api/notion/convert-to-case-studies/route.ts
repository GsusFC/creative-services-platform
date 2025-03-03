import { NextRequest, NextResponse } from 'next/server';
import { notionService } from '@/services/notion-service';
import { generateSlug } from '@/lib/utils';
import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';
import { 
  FieldMapperV4Config, 
  FieldMappingV4, 
  TransformationConfig 
} from '@/components/field-mapper/types';

// Función para convertir un proyecto de Notion a un Case Study
const convertProjectToCaseStudy = async (projectId: string, useFieldMapperV4: boolean = true): Promise<{
  success: boolean;
  caseStudy?: CaseStudyDataV4;
  slug?: string;
  error?: string;
}> => {
  try {
    console.log(`Intentando convertir proyecto con ID: ${projectId} usando FieldMapperV4: ${useFieldMapperV4}`);
    
    // Verificar configuración de Notion
    const isConfigured = notionService.isProperlyConfigured();
    console.log(`Estado de configuración de Notion: ${isConfigured ? 'OK' : 'No configurado'}`);
    
    if (!isConfigured) {
      return { 
        success: false, 
        error: 'Notion no está configurado correctamente. Verifica las credenciales en .env.local' 
      };
    }
    
    // Obtener el proyecto de Notion
    const project = await notionService.getProjectById(projectId);
    
    if (!project) {
      console.error(`No se encontró el proyecto con ID: ${projectId}`);
      return { 
        success: false, 
        error: `No se encontró el proyecto con ID: ${projectId}` 
      };
    }
    
    console.log(`Proyecto encontrado: ${project.title}`);
    
    // Generar un slug basado en el título del proyecto
    const slug = generateSlug(project.title);
    
    // Obtener la configuración de mapeo más reciente
    // En una implementación real, esto vendría de una base de datos o archivo de configuración
    const mapperConfig = await fetch('/api/field-mapper/config/latest').then(res => res.json()).catch(() => null);
    
    let caseStudyData: CaseStudyDataV4;
    
    if (useFieldMapperV4 && mapperConfig?.success && mapperConfig?.config?.mappings) {
      // Usar el Field Mapper V4 para transformar los datos
      const { transformNotionToCaseStudyV4 } = await import('@/lib/case-studies/mapper-utils');
      
      // Convertir las propiedades del proyecto a un formato plano para el mapper
      const notionData: Record<string, unknown> = {};
      
      // Extraer valores de las propiedades de Notion
      Object.entries(project.properties).forEach(([key, value]) => {
        // @ts-ignore - Simplificación para el ejemplo
        const type = value.type;
        let extractedValue: unknown = null;
        
        // Extraer el valor según el tipo de propiedad
        if (type === 'title' && Array.isArray(value.title)) {
          extractedValue = value.title.map((t: any) => t.plain_text).join('');
        } else if (type === 'rich_text' && Array.isArray(value.rich_text)) {
          extractedValue = value.rich_text.map((t: any) => t.plain_text).join('');
        } else if (type === 'select' && value.select) {
          extractedValue = value.select.name;
        } else if (type === 'multi_select' && Array.isArray(value.multi_select)) {
          extractedValue = value.multi_select.map((item: any) => item.name);
        } else if (type === 'url') {
          extractedValue = value.url;
        } else if (type === 'files' && Array.isArray(value.files)) {
          extractedValue = value.files.map((file: any) => file.name || file.external?.url || '');
        }
        
        // Usar el ID de la propiedad como clave
        notionData[key] = extractedValue;
      });
      
      console.log('Datos extraídos de Notion:', notionData);
      
      // Transformar usando el mapper
      caseStudyData = transformNotionToCaseStudyV4(notionData, mapperConfig.config.mappings);
      
      console.log('Case Study generado con Field Mapper V4:', caseStudyData);
    } else {
      // Fallback a datos básicos si no hay configuración de mapeo
      caseStudyData = {
        hero_image: project.properties.featured_image?.files?.[0]?.external?.url || '/placeholder-hero.jpg',
        project_name: project.title,
        tagline: project.properties.tagline?.rich_text?.[0]?.plain_text || 'Proyecto de transformación digital',
        description: project.properties.description?.rich_text?.[0]?.plain_text || 
                   'Descripción del proyecto no disponible.',
        services: project.properties.services?.multi_select?.map((s: any) => s.name) || ['Diseño', 'Desarrollo'],
        gallery: project.properties.gallery?.files?.map((f: any) => f.external?.url) || []
      };
      
      console.log('Case Study generado con datos básicos (sin Field Mapper):', caseStudyData);
    }
    
    console.log(`Case Study generado con éxito para: ${project.title} (slug: ${slug})`);
    
    return {
      success: true,
      caseStudy: caseStudyData,
      slug
    };
    
  } catch (error) {
    console.error('Error al convertir proyecto a Case Study:', error);
    return { 
      success: false, 
      error: `Error al convertir proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    };
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando conversión de proyectos a Case Studies');
    
    const { projectIds, useFieldMapperV4 } = await request.json();
    
    console.log(`Proyectos a convertir: ${projectIds.length}`);
    console.log(`Usar Field Mapper V4: ${useFieldMapperV4 ? 'Sí' : 'No'}`);
    
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      console.error('Se requiere un array de IDs de proyectos');
      return NextResponse.json(
        { success: false, message: 'Se requiere un array de IDs de proyectos' },
        { status: 400 }
      );
    }
    
    // Convertir cada proyecto a un Case Study
    const results = await Promise.all(
      projectIds.map(async (projectId) => {
        console.log(`Procesando proyecto: ${projectId}`);
        const result = await convertProjectToCaseStudy(projectId);
        return {
          id: projectId,
          title: result.success ? result.caseStudy?.project_name : `Proyecto ${projectId.slice(0, 8)}`,
          success: result.success,
          caseStudyUrl: result.success ? `/case-studies/${result.slug}` : undefined,
          error: result.error
        };
      })
    );
    
    const successCount = results.filter(r => r.success).length;
    console.log(`Conversión completada. ${successCount} de ${projectIds.length} proyectos convertidos con éxito.`);
    
    return NextResponse.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error('Error al convertir proyectos a Case Studies:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al convertir proyectos: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
