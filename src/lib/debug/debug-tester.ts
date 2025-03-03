/**
 * Herramienta para probar el sistema de depuración
 * 
 * Este script permite generar datos de prueba para validar el sistema
 * de depuración del Field Mapper V3 sin necesidad de provocar errores reales.
 */

import { getFieldMapperDebugger } from './field-mapper-debugger';
import { getValidationDebugger } from './field-mapper-validation-debugger';
import { ComponentCompatibilityLevel } from '../field-mapper/v3-validation';

/**
 * Genera errores de prueba para el depurador general
 */
export const generateTestErrors = () => {
  const debugInstance = getFieldMapperDebugger();
  
  // Ejemplo de error de bajo nivel
  debugInstance.captureError(
    'FieldMapperTester',
    'Este es un error de prueba de bajo nivel',
    'low',
    { context: 'prueba', timestamp: new Date().toISOString() }
  );
  
  // Ejemplo de error de nivel medio
  debugInstance.captureError(
    'ValidationTester',
    'Prueba de validación con advertencia',
    'medium',
    { field: 'test_field', expected: 'string', received: 'number' }
  );
  
  // Ejemplo de error de alto nivel
  debugInstance.captureError(
    'ComponentTester',
    'Error de compatibilidad entre componentes',
    'high',
    { componentA: 'HeroSection', componentB: 'NotionDatabase' }
  );
  
  // Ejemplo de error crítico
  debugInstance.captureError(
    'APITester',
    'Error crítico en la carga de datos',
    'critical',
    { error: 'No se pudieron cargar los componentes de Notion', code: 'NOTION_LOAD_FAILED' }
  );
  
  console.info('✅ Errores de prueba generados con éxito');
};

/**
 * Genera un estado ficticio del Field Mapper para pruebas
 */
export const generateMockFieldMapperState = () => {
  return {
    notionAssets: [
      {
        id: 'component-1',
        name: 'Hero Banner',
        type: 'hero',
        fields: [
          { id: 'field-1', name: 'Title', type: 'text', required: true },
          { id: 'field-2', name: 'Subtitle', type: 'text', required: false },
          { id: 'field-3', name: 'Image', type: 'image', required: true }
        ]
      },
      {
        id: 'component-2',
        name: 'Info Section',
        type: 'info',
        fields: [
          { id: 'field-4', name: 'Heading', type: 'text', required: true },
          { id: 'field-5', name: 'Content', type: 'rich_text', required: true },
          { id: 'field-6', name: 'CTA', type: 'text', required: false }
        ]
      }
    ],
    pageStructure: [
      {
        id: 'page-component-1',
        name: 'Hero Section',
        type: 'hero',
        description: 'Principal banner for the landing page',
        fields: [
          { id: 'p-field-1', name: 'Main Title', type: 'text', required: true },
          { id: 'p-field-2', name: 'Subtitle', type: 'text', required: false },
          { id: 'p-field-3', name: 'Background', type: 'image', required: true }
        ]
      },
      {
        id: 'page-component-2',
        name: 'Information Block',
        type: 'info',
        description: 'Information section with rich text',
        fields: [
          { id: 'p-field-4', name: 'Title', type: 'text', required: true },
          { id: 'p-field-5', name: 'Body', type: 'rich_text', required: true },
          { id: 'p-field-6', name: 'Button Text', type: 'text', required: false }
        ]
      }
    ],
    mappings: [
      {
        id: 'mapping_1',
        pageComponentId: 'page-component-1',
        notionComponentId: 'component-1',
        fieldMappings: [
          { id: 'field_map_1', pageFieldId: 'p-field-1', notionFieldId: 'field-1' },
          { id: 'field_map_2', pageFieldId: 'p-field-2', notionFieldId: 'field-2' },
          { id: 'field_map_3', pageFieldId: 'p-field-3', notionFieldId: 'field-3' }
        ]
      },
      {
        id: 'mapping_2',
        pageComponentId: 'page-component-2',
        notionComponentId: 'component-2',
        fieldMappings: [
          { id: 'field_map_4', pageFieldId: 'p-field-4', notionFieldId: 'field-4' },
          { id: 'field_map_5', pageFieldId: 'p-field-5', notionFieldId: 'field-5' },
          { id: 'field_map_6', pageFieldId: 'p-field-6', notionFieldId: 'field-6' }
        ]
      }
    ],
    selectedNotionAssetId: 'component-1',
    selectedPageSectionId: 'page-component-1',
    validationResults: {
      isValid: false,
      errors: [
        {
          sectionId: 'page-component-1',
          fieldId: 'p-field-3',
          message: 'Campo de Notion no encontrado',
          level: ComponentCompatibilityLevel.ERROR
        },
        {
          sectionId: 'page-component-1',
          fieldId: 'p-field-2',
          message: 'Posible pérdida de formato rich text',
          level: ComponentCompatibilityLevel.WARNING
        }
      ]
    }
  };
};

/**
 * Ejecuta pruebas completas del sistema de depuración
 */
export const runDebugSystemTests = () => {
  console.info('🔍 Ejecutando pruebas del sistema de depuración...');
  
  // Generar errores de prueba
  generateTestErrors();
  
  // Analizar estado simulado
  const mockState = generateMockFieldMapperState();
  const validationDebugger = getValidationDebugger();
  const analysisReport = validationDebugger.analyzeFieldMapperState(mockState);
  
  console.info('📊 Análisis de estado simulado generado con éxito');
  console.info('🧪 Ejecutando pruebas de validación...');
  
  // Ejecutar pruebas de validación
  validationDebugger.runAllTests({
    validationResults: mockState.validationResults,
    mappings: mockState.mappings,
    pageComponents: mockState.pageStructure,
    notionComponents: mockState.notionAssets
  }).then((results) => {
    console.info('✅ Pruebas de validación completadas:', results);
  }).catch((error) => {
    console.error('❌ Error en pruebas de validación:', error);
  });
  
  return {
    mockState,
    analysisReport
  };
};
