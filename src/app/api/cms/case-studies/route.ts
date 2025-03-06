import { NextRequest, NextResponse } from 'next/server';
import { getMockCaseStudies, getMockCaseStudyBySlug } from '@/lib/case-studies/mock-service';
import { createCaseStudy, updateCaseStudy, deleteCaseStudy } from '@/lib/case-studies/service';
import { CaseStudy } from '@/types/case-study';

/**
 * GET /api/cms/case-studies
 * Obtiene todos los case studies
 */
export async function GET() {
  try {
    // Como el CMS no está activo, usamos el servicio mock
    const caseStudies = await getMockCaseStudies();
    
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error('Error al obtener los case studies:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener los case studies' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/case-studies
 * Crea un nuevo case study
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.title || !data.client || !data.description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Crear el case study
    const newCaseStudy = await createCaseStudy(data);
    
    return NextResponse.json(newCaseStudy, { status: 201 });
  } catch (error) {
    console.error('Error al crear el case study:', error);
    return NextResponse.json(
      { error: 'Error interno al crear el case study' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/case-studies
 * Actualiza un case study existente
 */
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.id || !data.title || !data.client || !data.description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar que el case study existe
    const existingCaseStudy = await getMockCaseStudyBySlug(data.slug);
    if (!existingCaseStudy) {
      return NextResponse.json(
        { error: 'Case study no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar el case study
    const updatedCaseStudy = await updateCaseStudy(data.id, data);
    
    return NextResponse.json(updatedCaseStudy);
  } catch (error) {
    console.error('Error al actualizar el case study:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar el case study' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/case-studies
 * Elimina un case study
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      );
    }
    
    await deleteCaseStudy(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar el case study:', error);
    return NextResponse.json(
      { error: 'Error interno al eliminar el case study' },
      { status: 500 }
    );
  }
}
