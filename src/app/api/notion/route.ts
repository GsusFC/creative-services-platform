'use server'

import { NextResponse } from 'next/server'
import { 
  getAllCaseStudies,
  queryDatabase,
  getPage,
  getDatabase
} from '@/lib/notion/client'
import { CaseStudy } from '@/types/case-study'

export async function GET() {
  try {
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
    const { action, filter, sorts, pageId, databaseId } = await request.json()
    
    switch (action) {
      case 'syncAll':
        const studies = await getAllCaseStudies()
        return NextResponse.json({ studies })
      
      case 'queryDatabase':
        const results = await queryDatabase({
          filter,
          sorts
        })
        return NextResponse.json({ results })
      
      case 'getPage':
        const page = await getPage(pageId)
        return NextResponse.json(page)
      
      case 'getDatabase':
        const database = await getDatabase(databaseId)
        return NextResponse.json(database)
      
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar la petición' },
      { status: 500 }
    )
  }
}
