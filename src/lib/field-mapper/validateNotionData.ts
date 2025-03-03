/**
 * Validación de datos de Notion
 * 
 * Este módulo proporciona funciones para validar la autenticidad de los datos
 * obtenidos de Notion, detectando si son datos reales o simulados.
 */

import { isUsingMockData } from '../notion';

/**
 * Interfaz para los resultados de validación de datos de Notion
 */
export interface NotionDataValidationResult {
  isRealData: boolean;
  mockDetected: boolean;
  apiKeyPresent: boolean;
  databaseIdPresent: boolean;
  sampleData?: {
    count: number;
    fields: string[];
    lastUpdated?: string;
  };
  warnings?: string[];
}

/**
 * Valida si los datos de Notion son reales o simulados
 * 
 * Esta función verifica:
 * 1. Si se está usando una API key real o simulada
 * 2. Si los IDs de base de datos son reales o simulados
 * 3. Opcionalmente, puede analizar una muestra de datos para detectar patrones de datos simulados
 * 
 * @param data Datos opcionales para analizar en busca de patrones simulados
 * @returns Resultado de la validación con información detallada
 */
export function validateNotionData(data?: any): NotionDataValidationResult {
  // Verificar si estamos usando datos simulados según la API key
  const mockDetected = isUsingMockData();
  
  // Verificar si tenemos las variables de entorno necesarias
  const apiKeyPresent = !!process.env.NOTION_API_KEY;
  const databaseIdPresent = !!process.env.NOTION_DATABASE_ID && !!process.env.NOTION_CASES_DATABASE_ID;
  
  // Determinar si estamos usando datos reales
  const isRealData = !mockDetected && apiKeyPresent && databaseIdPresent;
  
  // Preparar el resultado
  const result: NotionDataValidationResult = {
    isRealData,
    mockDetected,
    apiKeyPresent,
    databaseIdPresent,
    warnings: []
  };
  
  // Si se proporcionaron datos para analizar, extraer información de muestra
  if (data) {
    try {
      // Extraer información básica de los datos
      const sampleData = {
        count: Array.isArray(data) ? data.length : 1,
        fields: Array.isArray(data) && data.length > 0 && data[0].properties 
          ? Object.keys(data[0].properties) 
          : Object.keys(data)
      };
      
      // Añadir la fecha de última actualización si está disponible
      if (Array.isArray(data) && data.length > 0 && data[0].last_edited_time) {
        sampleData.lastUpdated = data[0].last_edited_time;
      }
      
      result.sampleData = sampleData;
      
      // Detectar posibles patrones de datos simulados
      if (isRealData) {
        // Verificar si los datos tienen estructura sospechosa de ser simulados
        if (sampleData.fields.includes('mock_field') || 
            sampleData.fields.includes('test_field') ||
            sampleData.fields.includes('example_field')) {
          result.warnings?.push('Los datos contienen campos con nombres típicos de datos simulados');
          result.mockDetected = true;
        }
        
        // Verificar si hay muy pocos registros (típico en datos simulados)
        if (sampleData.count === 1) {
          result.warnings?.push('Solo se encontró un registro, lo cual es típico en datos simulados');
        }
      }
    } catch (error) {
      result.warnings?.push(`Error al analizar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  // Añadir advertencias específicas según el estado
  if (!apiKeyPresent) {
    result.warnings?.push('No se encontró NOTION_API_KEY en las variables de entorno');
  }
  
  if (!databaseIdPresent) {
    result.warnings?.push('No se encontraron los IDs de base de datos necesarios en las variables de entorno');
  }
  
  return result;
}

/**
 * Verifica si una respuesta de la API de Notion parece contener datos reales
 * 
 * @param response Respuesta de la API de Notion
 * @returns true si los datos parecen reales, false si parecen simulados
 */
export function looksLikeRealNotionData(response: any): boolean {
  // Si no hay respuesta o está vacía, no podemos determinar
  if (!response) return false;
  
  // Verificar si estamos usando una API key simulada
  if (isUsingMockData()) return false;
  
  // Verificar patrones comunes en respuestas reales de Notion
  const hasResults = response.results && Array.isArray(response.results);
  const hasObject = response.object && typeof response.object === 'string';
  const hasNextCursor = 'next_cursor' in response;
  const hasHasMore = 'has_more' in response;
  
  // Una respuesta real de Notion API típicamente tiene estas propiedades
  const looksReal = hasObject && hasResults && hasNextCursor && hasHasMore;
  
  return looksReal;
}
