'use server';

/**
 * Field Mapper V4 - Server Actions
 * 
 * Funciones del servidor para manejar operaciones del Field Mapper
 */

import { revalidatePath } from 'next/cache';
import { 
  NotionField, 
  CaseStudyField, 
  FieldMapping, 
  FieldMapperConfig,
  CASE_STUDY_STRUCTURE,
  FieldType
} from './types';

// Función para obtener los campos disponibles en Notion
// En una implementación real, esto se conectaría a la API de Notion
export async function fetchNotionFields(databaseId: string): Promise<NotionField[]> {
  console.log(`Fetching fields for database ${databaseId}`);
  
  // Datos de ejemplo - en producción, se obtendrían de la API de Notion
  // Estos datos simulan la respuesta de la API
  const mockNotionFields: NotionField[] = [
    {
      id: 'notion_title',
      name: 'Título',
      type: FieldType.TEXT,
      source: 'notion',
      notionId: 'title',
      propertyType: 'title',
      required: true,
    },
    {
      id: 'notion_description',
      name: 'Descripción',
      type: FieldType.RICH_TEXT,
      source: 'notion',
      notionId: 'description',
      propertyType: 'rich_text',
    },
    {
      id: 'notion_client',
      name: 'Cliente',
      type: FieldType.TEXT,
      source: 'notion',
      notionId: 'client',
      propertyType: 'text',
    },
    {
      id: 'notion_tags',
      name: 'Tags',
      type: FieldType.MULTI_SELECT,
      source: 'notion',
      notionId: 'tags',
      propertyType: 'multi_select',
    },
    {
      id: 'notion_date',
      name: 'Fecha',
      type: FieldType.DATE,
      source: 'notion',
      notionId: 'date',
      propertyType: 'date',
    },
    {
      id: 'notion_main_image',
      name: 'Imagen Principal',
      type: FieldType.IMAGE,
      source: 'notion',
      notionId: 'main_image',
      propertyType: 'files',
    },
    {
      id: 'notion_gallery',
      name: 'Galería',
      type: FieldType.FILES,
      source: 'notion',
      notionId: 'gallery',
      propertyType: 'files',
    },
  ];

  return mockNotionFields;
}

// Función para obtener la estructura del Case Study
export async function fetchCaseStudyStructure(): Promise<CaseStudyField[]> {
  // Utilizamos la estructura predefinida
  return CASE_STUDY_STRUCTURE;
}

// Función para guardar una configuración de mapeo
export async function saveFieldMapperConfig(config: Omit<FieldMapperConfig, 'createdAt' | 'updatedAt'>): Promise<FieldMapperConfig> {
  try {
    // En una implementación real, esto guardaría en una base de datos
    const timestamp = new Date().toISOString();
    
    // Aseguramos que el estado de onboarding esté definido
    const hasCompletedOnboarding = config.hasCompletedOnboarding ?? false;
    
    const savedConfig: FieldMapperConfig = {
      ...config,
      hasCompletedOnboarding,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    console.log('Saving Field Mapper configuration:', savedConfig);
    
    // Refrescar la caché de la ruta
    revalidatePath('/admin/field-mapper-v4');
    
    return savedConfig;
  } catch (error) {
    console.error('Error al guardar la configuración del Field Mapper:', error);
    throw new Error(`No se pudo guardar la configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Función para cargar una configuración de mapeo guardada
export async function loadFieldMapperConfig(configId: string): Promise<FieldMapperConfig | null> {
  try {
    console.log(`Loading Field Mapper configuration with ID: ${configId}`);
    
    // En una implementación real, esto cargaría de una base de datos
    // Por ahora retornamos null para indicar que no se encontró la configuración
    
    // Simulación de carga (esto se reemplazaría con la carga real de la base de datos)
    // const loadedConfig = await db.fieldMapperConfigs.findUnique({ where: { id: configId } });
    // if (!loadedConfig) return null;
    
    // Aseguramos que el estado de onboarding esté definido en los datos cargados
    // return {
    //   ...loadedConfig,
    //   hasCompletedOnboarding: loadedConfig.hasCompletedOnboarding ?? false
    // };
    
    return null;
  } catch (error) {
    console.error(`Error al cargar la configuración del Field Mapper con ID ${configId}:`, error);
    throw new Error(`No se pudo cargar la configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Función para aplicar la configuración de mapeo a un Case Study específico
export async function applyMapping(
  configId: string, 
  notionPageId: string
): Promise<{ success: boolean; message: string }> {
  console.log(`Applying mapping configuration ${configId} to Notion page ${notionPageId}`);
  
  // En una implementación real, esto aplicaría el mapeo y generaría el Case Study
  return {
    success: true,
    message: 'Mapeo aplicado correctamente',
  };
}
