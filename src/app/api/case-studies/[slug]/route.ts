import { NextResponse } from 'next/server';
import { featuredProjects } from '@/data/projects';

// API handler que obtiene un caso de estudio específico desde datos locales
// Sirve como alias para /api/cases/[slug] para mantener compatibilidad
// Esta implementación previene peticiones a http://localhost:3001/cases/[slug]
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Buscamos el proyecto en los datos locales
    const project = featuredProjects.find(p => p.slug === slug);
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Caso de estudio no encontrado' },
        { status: 404 }
      );
    }
    
    // Enviamos los datos del proyecto encontrado
    return NextResponse.json({
      success: true,
      caseStudy: project // Enviamos el proyecto directamente sin modificarlo
    });
  } catch (error) {
    console.error(`Error al obtener el caso de estudio ${params.slug}:`, error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el caso de estudio' },
      { status: 500 }
    );
  }
}
