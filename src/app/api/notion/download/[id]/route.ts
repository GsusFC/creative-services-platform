import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion/client'
import { transformNotionToCaseStudy } from '@/lib/notion/transformer'
import { isFullPage } from '@notionhq/client'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Download request for page:', params.id)
    const { id } = params

    // Obtener la página de Notion
    const response = await notion.pages.retrieve({ page_id: id })
    console.log('Notion response:', response)
    
    if (!isFullPage(response)) {
      console.error('Invalid page response:', response)
      throw new Error('Invalid page response from Notion: not a full page object')
    }
    
    // Transformar a nuestro formato de case study
    const caseStudy = transformNotionToCaseStudy(response)

    // Convertir a JSON y retornar como archivo descargable
    const jsonContent = JSON.stringify(caseStudy, null, 2)
    
    return new NextResponse(jsonContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${caseStudy.title.toLowerCase().replace(/\\s+/g, '-')}-case-study.json"`
      }
    })
  } catch (error) {
    console.error('Error downloading case study:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error downloading case study'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
