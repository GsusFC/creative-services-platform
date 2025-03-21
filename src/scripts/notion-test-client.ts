import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { CaseStudy, CreateCaseStudyInput, UpdateCaseStudyInput } from '@/lib/notion/types'
import { transformNotionToCaseStudy, transformCaseStudyToNotion } from '@/lib/notion/transformer'

// Usar las credenciales de prueba
const NOTION_API_KEY = process.env['NOTION_API_KEY'] || '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'
const NOTION_DATABASE_ID = process.env['NOTION_DATABASE_ID'] || 'a3a61fb1fb954b1a9534aeb723597368'

console.log('Usando API Key:', NOTION_API_KEY.substring(0, 10) + '...')
console.log('Usando Database ID:', NOTION_DATABASE_ID)

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: '2022-06-28',
})

/**
 * Obtiene todos los case studies de Notion
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      sorts: [{ property: 'Brand Name', direction: 'ascending' }],
    })

    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(transformNotionToCaseStudy)
  } catch (error) {
    console.error('Error al obtener los case studies:', error)
    throw error
  }
}

/**
 * Obtiene un case study por su ID
 */
export async function getCaseStudy(pageId: string): Promise<CaseStudy> {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId })
    if (!('properties' in response)) {
      throw new Error('Página no encontrada')
    }
    return transformNotionToCaseStudy(response)
  } catch (error) {
    console.error('Error al obtener el case study:', error)
    throw error
  }
}

/**
 * Crea un nuevo case study en Notion
 */
export async function createCaseStudy(input: CreateCaseStudyInput): Promise<CaseStudy> {
  try {
    const notionData = transformCaseStudyToNotion(input)
    console.log('Datos transformados para Notion:', JSON.stringify(notionData, null, 2))
    
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: notionData
    })
    if (!('properties' in response)) {
      throw new Error('Error al crear el case study')
    }
    return transformNotionToCaseStudy(response)
  } catch (error) {
    console.error('Error al crear el case study:', error)
    throw error
  }
}

/**
 * Actualiza un case study existente
 */
export async function updateCaseStudy({ id, ...data }: UpdateCaseStudyInput): Promise<CaseStudy> {
  try {
    const notionData = transformCaseStudyToNotion(data)
    console.log('Datos transformados para Notion:', JSON.stringify(notionData, null, 2))
    
    const response = await notion.pages.update({
      page_id: id,
      properties: notionData
    })
    if (!('properties' in response)) {
      throw new Error('Error al actualizar el case study')
    }
    return transformNotionToCaseStudy(response)
  } catch (error) {
    console.error('Error al actualizar el case study:', error)
    throw error
  }
}

/**
 * Elimina un case study (lo marca como archivado en Notion)
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: id,
      archived: true,
    })
  } catch (error) {
    console.error('Error al eliminar el case study:', error)
    throw error
  }
}
