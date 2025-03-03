/**
 * Archivo de exportación principal para el sistema de depuración
 * 
 * Este archivo sirve como punto de entrada único para el sistema de depuración,
 * permitiendo un acceso centralizado a las funcionalidades de diagnóstico y análisis.
 */

// Re-exportar los hooks y utilidades del debug
export { 
  useFieldMapperV3Store,
  captureFieldMapperState 
} from './hooks';

// Re-exportar los tipos principales
export * from './types';

// Re-exportar las funciones principales de depuración
export { 
  getFieldMapperDebugger,
  useFieldMapperDebugger,
  captureFieldMapperError 
} from './field-mapper-debugger';

export { 
  getValidationDebugger,
  useValidationDebugger,
  analyzeFieldMapperState 
} from './field-mapper-validation-debugger';

// Nota: El componente FieldMapperDebugPanel debe importarse directamente desde:
// import { FieldMapperDebugPanel } from '../../components/field-mapper/FieldMapperDebugPanel';

// Configuración de depuración
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  captureConsole: true,
  logLevel: 'verbose',
  showDebugPanel: true
};

/**
 * Función de ayuda para iniciar el sistema de depuración
 */
export const initializeDebugSystem = (): void => {
  if (!DEBUG_CONFIG.enabled) return;
  
  // Inicializar ambos sistemas de depuración
  try {
    // Importación dinámica de los módulos
    import('./field-mapper-debugger').then(({ getFieldMapperDebugger }) => {
      import('./field-mapper-validation-debugger').then(({ getValidationDebugger }) => {
        const debugInstance = getFieldMapperDebugger();
        const validationDebugger = getValidationDebugger();
        
        // Configurar captura de consola
        if (DEBUG_CONFIG.captureConsole && typeof debugInstance.enableConsoleCapture === 'function') {
          debugInstance.enableConsoleCapture();
        }
        
        // Verificar que el validador esté disponible
        if (validationDebugger && typeof validationDebugger.runAllTests === 'function') {
          validationDebugger.runAllTests();
        }
        
        console.info('Sistema de depuración Field Mapper V3 inicializado');
      });
    }).catch(error => {
      console.error('Error al importar módulos de depuración:', error);
    });
  } catch (error) {
    console.error('Error al inicializar el sistema de depuración:', error);
  }
};
