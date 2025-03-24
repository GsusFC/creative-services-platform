'use server'

import { NextResponse } from 'next/server'
import { getAllCaseStudies, updateCaseStudy } from '@/lib/notion/client'
import { CaseStudy } from '@/types/case-study'

// Endpoint para sincronización manual con Notion
export async function GET() {
  try {
    // Obtener todos los estudios de Notion
    const studies = await getAllCaseStudies();
    return NextResponse.json({ studies });
  } catch (error) {
    console.error('Error fetching case studies:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener los case studies' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, study } = await request.json()
    
    if (action === 'syncAll') {
      const studies = await getAllCaseStudies()
      return NextResponse.json({ studies })
    }

    if (action === 'update' && study) {
      try {
        const updatedStudy = await updateCaseStudy(study);
        return NextResponse.json({ study: updatedStudy });
      } catch (error) {
        console.error('Error updating case study:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Error al actualizar el case study' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar la petición' },
      { status: 500 }
    )
  }
}
