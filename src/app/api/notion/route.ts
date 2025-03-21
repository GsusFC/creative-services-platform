'use server'

import { NextResponse } from 'next/server'
import { 
  getAllCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy 
} from '@/lib/notion/client'
import { saveCaseStudy } from '@/lib/storage/case-studies'
import { downloadAndSaveMedia } from '@/lib/storage/download'

export async function GET(request: Request) {
  try {
    // Obtener los estudios actuales del storage si se proporcionan en la query
    const { searchParams } = new URL(request.url);
    const currentStudiesParam = searchParams.get('currentStudies');
    const currentStudies = currentStudiesParam ? JSON.parse(currentStudiesParam) : [];

    // Obtener todos los estudios de Notion
    const notionStudies = await getAllCaseStudies();
    
    // Comparar fechas de actualización y marcar los que necesitan sincronización
    const studies = notionStudies.map(notionStudy => {
      const currentStudy = currentStudies.find(s => s.id === notionStudy.id);
      
      // Si el estudio no existe localmente o la fecha de Notion es más reciente, necesita sincronización
      const needsSync = !currentStudy || 
        new Date(notionStudy.updatedAt) > new Date(currentStudy.updatedAt);

      return {
        ...notionStudy,
        synced: !needsSync
      };
    });

    return NextResponse.json({ studies })
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
    const { id, action, data } = await request.json()
    
    if (action === 'sync') {
      if (!id) {
        return NextResponse.json(
          { error: 'Se requiere un ID para sincronizar' },
          { status: 400 }
        )
      }

      const study = await getCaseStudy(id)
      
      // Descargar y guardar imágenes
      const updatedStudy = {
        ...study,
        synced: study.status === 'published',
        mediaItems: await Promise.all(
          study.mediaItems.map(async (media) => {
            if (media.type === 'image' && media.url) {
              try {
                const localPath = await downloadAndSaveMedia(media.url, study.slug)
                return { ...media, url: localPath }
              } catch (error) {
                console.error('Error downloading media:', error)
                return media
              }
            }
            return media
          })
        )
      }
      
      await saveCaseStudy(updatedStudy)
      return NextResponse.json({ study: updatedStudy })
    }
    
    if (action === 'syncAll') {
      const studies = await getAllCaseStudies()
      const updatedStudies = await Promise.all(
        studies.map(async (study) => {
          // Descargar y guardar imágenes para cada estudio
          const updatedStudy = {
            ...study,
            synced: study.status === 'published',
            mediaItems: await Promise.all(
              study.mediaItems.map(async (media) => {
                if (media.type === 'image' && media.url) {
                  try {
                    const localPath = await downloadAndSaveMedia(media.url, study.slug)
                    return { ...media, url: localPath }
                  } catch (error) {
                    console.error('Error downloading media:', error)
                    return media
                  }
                }
                return media
              })
            )
          }
          
          await saveCaseStudy(updatedStudy)
          return updatedStudy
        })
      )
      
      return NextResponse.json({ studies: updatedStudies })
    }

    if (action === 'create') {
      if (!data) {
        return NextResponse.json(
          { error: 'Se requieren datos para crear un case study' },
          { status: 400 }
        )
      }

      const study = await createCaseStudy(data)
      return NextResponse.json({ study })
    }

    if (action === 'update') {
      if (!id || !data) {
        return NextResponse.json(
          { error: 'Se requiere un ID y datos para actualizar' },
          { status: 400 }
        )
      }

      const study = await updateCaseStudy({ id, ...data })
      return NextResponse.json({ study })
    }

    if (action === 'delete') {
      if (!id) {
        return NextResponse.json(
          { error: 'Se requiere un ID para eliminar' },
          { status: 400 }
        )
      }

      await deleteCaseStudy(id)
      return NextResponse.json({ success: true })
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
