import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedCaseStudies, updateFeaturedCaseStudies } from '@/lib/case-studies/service';
import { FeaturedCaseUpdate } from '@/types/case-study';

/**
 * GET /api/cms/case-studies/featured
 * Obtiene todos los case studies destacados
 */
export async function GET() {
  try {
    const featuredCaseStudies = await getFeaturedCaseStudies();
    
    return NextResponse.json(featuredCaseStudies);
  } catch (error) {
    console.error('Error al obtener los case studies destacados:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener los case studies destacados' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/case-studies/featured
 * Actualiza el estado de destacado de varios case studies
 */
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar el formato de los datos
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'El formato de los datos es incorrecto. Se espera un array de actualizaciones.' },
        { status: 400 }
      );
    }
    
    // Validar cada elemento del array
    for (const update of data) {
      if (!update.id || typeof update.featured !== 'boolean' || (update.featured && typeof update.featuredOrder !== 'number')) {
        return NextResponse.json(
          { error: 'Formato de actualización inválido. Cada elemento debe tener id, featured y featuredOrder (si featured es true).' },
          { status: 400 }
        );
      }
    }
    
    // Actualizar los case studies destacados
    await updateFeaturedCaseStudies(data as FeaturedCaseUpdate[]);
    
    // Devolver los case studies destacados actualizados
    const updatedFeaturedCases = await getFeaturedCaseStudies();
    
    return NextResponse.json(updatedFeaturedCases);
  } catch (error) {
    console.error('Error al actualizar los case studies destacados:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar los case studies destacados' },
      { status: 500 }
    );
  }
}
