import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCaseStudies, 
  createCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy 
} from '@/lib/case-studies/service';

/**
 * GET /api/cms/case-studies
 * Obtiene todos los case studies
 */
export async function GET() {
  try {
    console.log('API: Intentando obtener todos los case studies...');
    
    // Obtener los case studies usando el servicio
    const caseStudies = await getAllCaseStudies();
    console.log(`API: Se obtuvieron ${caseStudies?.length ?? 0} case studies`);
    
    // Si no hay case studies pero tampoco un error, devolvemos un array vacío
    if (!caseStudies || caseStudies.length === 0) {
      console.log('API: No se encontraron case studies');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(caseStudies);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('API: Error al obtener los case studies:', error);
    return NextResponse.json(
      { error: `Error interno al obtener los case studies: ${errorMessage}` },
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
    console.log('API PUT: Datos recibidos:', data);
    
    // Validación básica - solo requerimos el ID
    if (!data.id) {
      console.log('API PUT: Falta el ID del case study');
      return NextResponse.json(
        { error: 'Se requiere el ID del case study' },
        { status: 400 }
      );
    }
    
    // Intentar actualizar directamente por ID sin verificar por slug
    try {
      console.log('API PUT: Actualizando case study por ID:', data.id);
      const updatedCaseStudy = await updateCaseStudy(data.id, data);
      console.log('API PUT: Case study actualizado correctamente');
      return NextResponse.json(updatedCaseStudy);
    } catch (updateError) {
      console.error('API PUT: Error al actualizar el case study por ID:', updateError);
      throw updateError; // Propagar el error para el manejador principal
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('API PUT: Error general:', errorMessage);
    return NextResponse.json(
      { error: `Error al actualizar: ${errorMessage}` },
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
