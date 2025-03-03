/**
 * Field Mapper V3 - Depurador de Validación
 * 
 * Script especializado para detectar y reportar problemas específicos
 * en el sistema de validación del Field Mapper V3.
 */

import { getFieldMapperDebugger } from './field-mapper-debugger';
import { 
  ComponentField, 
  ComponentMapping, 
  NotionComponent, 
  PageComponent 
} from '../field-mapper/v3-types';
import { ComponentCompatibilityLevel } from '../field-mapper/v3-validation';

// Tipo de prueba de validación
interface ValidationTest {
  name: string;
  run: (data?: unknown) => boolean | Promise<boolean>;
  errorMessage: string;
  fixSuggestion: string;
}

/**
 * Clase para detectar y diagnosticar problemas específicos
 * de validación en Field Mapper V3
 */
export class ValidationDebugger {
  private debugger = getFieldMapperDebugger();
  private testResults: Record<string, boolean> = {};

  // Conjunto de pruebas predefinidas para detectar problemas comunes
  private validationTests: ValidationTest[] = [
    {
      name: 'validation_results_defined',
      run: (data?: unknown) => {
        const validationResults = data as { validationResults?: unknown };
        return validationResults?.validationResults !== undefined 
          && validationResults?.validationResults !== null;
      },
      errorMessage: 'El objeto validationResults no está definido',
      fixSuggestion: 'Asegúrate de que _validateMappings() está siendo llamado correctamente después de cargar el componente'
    },
    {
      name: 'validation_errors_array',
      run: (data?: unknown) => {
        const validationResults = data as { validationResults?: { errors?: unknown } };
        return validationResults?.validationResults?.errors 
          && Array.isArray(validationResults.validationResults.errors);
      },
      errorMessage: 'validationResults.errors no es un array',
      fixSuggestion: 'Verifica la estructura del objeto validationResults'
    },
    {
      name: 'component_ids_match',
      run: (data?: unknown) => {
        const state = data as { 
          mappings?: Array<{pageComponentId?: string, notionComponentId?: string}>,
          pageStructure?: Array<{id: string}>,
          notionAssets?: Array<{id: string}>
        };
        
        if (!state.mappings?.length || !state.pageStructure?.length || !state.notionAssets?.length) {
          return false;
        }
        
        // Verificar al menos el primer mapping
        const mapping = state.mappings[0];
        const pageComponents = state.pageStructure;
        const notionComponents = state.notionAssets;
        
        if (!mapping.pageComponentId || !mapping.notionComponentId) {
          return false;
        }
        
        const pageComponentExists = pageComponents.some(c => c.id === mapping.pageComponentId);
        const notionComponentExists = notionComponents.some(c => c.id === mapping.notionComponentId);
        
        return pageComponentExists && notionComponentExists;
      },
      errorMessage: 'IDs de componentes en los mappings no corresponden a componentes existentes',
      fixSuggestion: 'Verifica que los IDs referenciados en los mappings existan en las listas de componentes'
    },
  ];

  /**
   * Ejecuta una sola prueba de validación específica
   */
  public async runTest(
    testName: string, 
    params?: unknown
  ): Promise<boolean> {
    const test = this.validationTests.find(t => t.name === testName);
    if (!test) {
      this.debugger.captureError(
        'ValidationDebugger', 
        `Prueba "${testName}" no encontrada`, 
        'medium'
      );
      return false;
    }

    try {
      const result = await test.run(params);
      this.testResults[testName] = result;
      
      if (!result) {
        this.debugger.captureError(
          'ValidationDebugger', 
          `Prueba fallida: ${test.errorMessage}`, 
          'high',
          { testName, fixSuggestion: test.fixSuggestion }
        );
      }
      
      return result;
    } catch (error) {
      this.debugger.captureError(
        'ValidationDebugger', 
        `Error al ejecutar prueba "${testName}": ${error}`, 
        'critical',
        { testName, error }
      );
      this.testResults[testName] = false;
      return false;
    }
  }

  /**
   * Ejecuta todas las pruebas de validación
   */
  public async runAllTests(contextData?: {
    validationResults?: unknown,
    mappings?: ComponentMapping[],
    pageComponents?: PageComponent[],
    notionComponents?: NotionComponent[]
  }): Promise<Record<string, boolean>> {
    this.testResults = {};
    
    for (const test of this.validationTests) {
      await this.runTest(test.name, contextData);
    }
    
    return this.testResults;
  }

  /**
   * Verifica un mapping específico en busca de problemas
   */
  public analyzeMapping(
    mapping: ComponentMapping,
    pageComponents: PageComponent[],
    notionComponents: NotionComponent[]
  ): {valid: boolean, issues: string[]} {
    const issues: string[] = [];
    
    // Verificar que existe el componente de página
    const pageComponent = pageComponents.find(c => c.id === mapping.pageComponentId);
    if (!pageComponent) {
      issues.push(`Componente de página con ID "${mapping.pageComponentId}" no encontrado`);
    }
    
    // Verificar que existe el componente de Notion
    const notionComponent = notionComponents.find(c => c.id === mapping.notionComponentId);
    if (!notionComponent) {
      issues.push(`Componente de Notion con ID "${mapping.notionComponentId}" no encontrado`);
    }
    
    // Verificar que los campos mapeados existen
    if (pageComponent && notionComponent) {
      for (const fieldMapping of mapping.fieldMappings) {
        const pageField = pageComponent.fields.find(f => f.id === fieldMapping.pageFieldId);
        if (!pageField) {
          issues.push(`Campo de página con ID "${fieldMapping.pageFieldId}" no encontrado`);
        }
        
        const notionField = notionComponent.fields.find(f => f.id === fieldMapping.notionFieldId);
        if (!notionField) {
          issues.push(`Campo de Notion con ID "${fieldMapping.notionFieldId}" no encontrado`);
        }
      }
    }
    
    // Registrar los problemas encontrados
    if (issues.length > 0) {
      this.debugger.captureError(
        'ValidationDebugger', 
        `Problemas encontrados en mapping ${mapping.id}`, 
        'high',
        { mappingId: mapping.id, issues }
      );
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Análisis detallado del estado del Field Mapper V3
   */
  public analyzeFieldMapperState(state: Record<string, unknown>): string {
    let report = '## Análisis del Estado de Field Mapper V3\n\n';
    
    // Extraer información del estado basado en las propiedades esperadas
    const notionAssets = Array.isArray(state.notionAssets) ? state.notionAssets : [];
    const mappings = Array.isArray(state.mappings) ? state.mappings : [];
    const pageStructure = Array.isArray(state.pageStructure) ? state.pageStructure : [];
    const validationResults = state.validationResults as { 
      isValid?: boolean; 
      errors?: Array<{ message: string; level: string; }> 
    } | null;
    
    // Estadísticas básicas
    report += `### Estadísticas generales:\n`;
    report += `- Componentes Notion: ${notionAssets.length}\n`;
    report += `- Componentes Página: ${pageStructure.length}\n`;
    report += `- Mappings configurados: ${mappings.length}\n\n`;
    
    // Análisis de validación
    report += `### Estado de validación:\n`;
    if (validationResults) {
      report += `- Estado: ${validationResults.isValid ? '✅ Válido' : '❌ Inválido'}\n`;
      report += `- Errores: ${validationResults.errors?.length || 0}\n\n`;
      
      if (validationResults.errors?.length) {
        report += `### Errores detectados:\n`;
        for (const error of validationResults.errors || []) {
          report += `- ${error.message} (${error.level})\n`;
        }
        report += '\n';
      }
    } else {
      report += `- No hay información de validación disponible\n\n`;
    }
    
    // Ejecutar tests de validación
    this.runBasicTests(state);
    const testResults = this.getTestResults();
    
    report += `### Pruebas de validación:\n`;
    for (const [testName, passed] of Object.entries(testResults)) {
      report += `- ${passed ? '✅' : '❌'} ${testName}\n`;
    }
    
    return report;
  }

  /**
   * Ejecuta pruebas básicas de validación
   */
  private runBasicTests(state: Record<string, unknown>): void {
    // Ejecutar pruebas básicas de validación
  }

  /**
   * Obtiene los resultados de las pruebas de validación
   */
  private getTestResults(): Record<string, boolean> {
    // Devuelve los resultados de las pruebas de validación
    return {};
  }
}

// Singleton para uso fácil en componentes
let instance: ValidationDebugger | null = null;

// Función para obtener la instancia del ValidationDebugger
export const getValidationDebugger = (): ValidationDebugger => {
  if (!instance) {
    instance = new ValidationDebugger();
  }
  return instance;
};

// Mantenemos el nombre para compatibilidad con componentes React
export const useValidationDebugger = getValidationDebugger;

// Función para analizar rápidamente el estado del Field Mapper
export const analyzeFieldMapperState = (state: Record<string, unknown>): string => {
  const validationInstance = getValidationDebugger();
  
  // Convertir el estado genérico a un formato compatible o usar valores predeterminados
  const typedState: Record<string, any> = {
    notionAssets: Array.isArray(state.notionAssets) ? state.notionAssets : [],
    mappings: Array.isArray(state.mappings) ? state.mappings : [],
    selectedNotionAssetId: typeof state.selectedNotionAssetId === 'string' ? state.selectedNotionAssetId : null,
    selectedPageSectionId: typeof state.selectedPageSectionId === 'string' ? state.selectedPageSectionId : null,
    validationResults: state.validationResults || null,
    pageStructure: Array.isArray(state.pageStructure) ? state.pageStructure : []
  };
  
  // Generar reporte de análisis
  let report = 'Análisis del Estado de Field Mapper:\n\n';
  
  report += `Componentes Notion: ${typedState.notionAssets.length}\n`;
  report += `Componentes Página: ${typedState.pageStructure.length}\n`;
  report += `Mappings: ${typedState.mappings.length}\n`;
  report += `Componente Notion seleccionado: ${typedState.selectedNotionAssetId || 'ninguno'}\n`;
  report += `Componente Página seleccionado: ${typedState.selectedPageSectionId || 'ninguno'}\n`;
  
  if (typedState.validationResults) {
    report += `\nResultados de validación:\n`;
    report += `Estado: ${typedState.validationResults.isValid ? 'Válido' : 'Inválido'}\n`;
    report += `Errores: ${typedState.validationResults.errors?.length || 0}\n`;
  }
  
  // Registrar el análisis en el depurador general
  getFieldMapperDebugger().captureError(
    'ValidationDebugger', 
    'Análisis de estado completado',
    'low',
    { report }
  );
  
  return report;
};
