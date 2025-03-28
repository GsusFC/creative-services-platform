import { NextResponse } from 'next/server';
import { getLocalStudyBySlug } from '@/lib/storage/case-studies';

// Eliminamos el forzado dinámico para permitir caché por defecto de Next.js
// export const dynamic = 'force-dynamic';
// Opcional: Añadir revalidación basada en tiempo (ej: cada hora)
export const revalidate = 3600; 

interface Params {
  slug: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
  }

  try {
    // Usamos la función que lee el archivo JSON individual local por slug
    const studyData = await getLocalStudyBySlug(slug);
    
    if (!studyData) {
      return NextResponse.json({ message: 'Case study not found' }, { status: 404 });
    }
    
    // Solo devolver si está publicado (coherente con la lista)
    if (studyData.status !== 'published') {
       return NextResponse.json({ message: 'Case study not published' }, { status: 404 });
    }

    return NextResponse.json(studyData);
  } catch (error) {
    console.error(`Error fetching public case study details for slug ${slug}:`, error);
    return NextResponse.json({ message: 'Failed to fetch public case study details' }, { status: 500 });
  }
}
