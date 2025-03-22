import { getAllCaseStudies } from '@/lib/notion/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const studies = await getAllCaseStudies();
    return NextResponse.json({ studies });
  } catch (error) {
    console.error('Error al obtener case studies:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 });
  }
}
