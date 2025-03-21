import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno desde .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Verificar que las credenciales estén cargadas
const NOTION_API_KEY = process.env['NOTION_API_KEY']
const NOTION_DATABASE_ID = process.env['NOTION_DATABASE_ID']

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('Error: Variables de entorno no encontradas en .env.local')
  console.log('Usando credenciales de respaldo...')
  
  // Usar credenciales de respaldo
  process.env['NOTION_API_KEY'] = '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'
  process.env['NOTION_DATABASE_ID'] = 'a3a61fb1fb954b1a9534aeb723597368'
}

if (!process.env['NOTION_API_KEY'] || !process.env['NOTION_DATABASE_ID']) {
  console.error('Las variables de entorno NOTION_API_KEY y NOTION_DATABASE_ID son requeridas')
  process.exit(1)
}

import { 
  getAllCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
} from './notion-test-client'

async function testNotionAPI() {
  console.log('🚀 Iniciando pruebas de la API de Notion...\n')
  let createdStudyId: string | null = null

  try {
    // 1. Obtener todos los case studies
    console.log('📚 Obteniendo todos los case studies...')
    const allStudies = await getAllCaseStudies()
    console.log(`✅ Obtenidos ${allStudies.length} case studies\n`)

    // 2. Crear un nuevo case study
    console.log('📝 Creando nuevo case study...')
    const newStudy = await createCaseStudy({
      title: 'Test Case Study',
      client: 'Test Client',
      description: 'This is a test case study',
      tagline: 'Test Tagline',
      closingClaim: 'Test Closing Claim',
      slug: 'test-case-study',
      tags: ['Test'],
      mediaItems: [],
      order: 0,
      featured: false,
      featuredOrder: 0,
      status: 'draft'
    })
    createdStudyId = newStudy.id
    console.log('✅ Case study creado:', newStudy.id)
    console.log('Título:', newStudy.title, '\n')

    // 3. Obtener el case study creado
    console.log('🔍 Obteniendo case study por ID...')
    const fetchedStudy = await getCaseStudy(newStudy.id)
    console.log('✅ Case study obtenido:', fetchedStudy.title)
    console.log('Descripción:', fetchedStudy.description, '\n')

    // 4. Actualizar el case study
    console.log('📝 Actualizando case study...')
    const updatedStudy = await updateCaseStudy({
      id: newStudy.id,
      title: 'Updated Test Case Study',
      description: 'This is an updated test case study'
    })
    console.log('✅ Case study actualizado:', updatedStudy.title)
    console.log('Nueva descripción:', updatedStudy.description, '\n')

    // 5. Eliminar el case study
    console.log('🗑️ Eliminando case study...')
    await deleteCaseStudy(newStudy.id)
    console.log('✅ Case study eliminado\n')

    console.log('✨ Todas las pruebas completadas con éxito!')

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error)
    
    // Intentar limpiar si hubo un error y se creó un case study
    if (createdStudyId) {
      console.log('🧹 Limpiando case study creado durante las pruebas...')
      try {
        await deleteCaseStudy(createdStudyId)
        console.log('✅ Case study limpiado correctamente')
      } catch (cleanupError) {
        console.error('❌ Error al limpiar case study:', cleanupError)
      }
    }
    
    process.exit(1)
  }
}

testNotionAPI()
