/**
 * Field Mapper V3 - Sistema de Depuración y Triaje
 * 
 * Este script proporciona herramientas para capturar, categorizar y
 * priorizar errores durante el desarrollo del Field Mapper V3.
 */

type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

interface DebugError {
  id: string;
  timestamp: number;
  component: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  count: number;
  lastOccurrence: number;
  metadata?: Record<string, unknown>;
}

interface StateHistoryEntry {
  component: string;
  timestamp: number;
  state: Record<string, unknown>;
}

class FieldMapperDebugger {
  private static instance: FieldMapperDebugger;
  private errors: Map<string, DebugError> = new Map();
  private stateHistory: Map<string, StateHistoryEntry> = new Map();
  private maxStoredStates: number = 10;
  private isEnabled: boolean = true;
  private consoleOverridden: boolean = false;
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;

  private constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
  }

  public static getInstance(): FieldMapperDebugger {
    if (!FieldMapperDebugger.instance) {
      FieldMapperDebugger.instance = new FieldMapperDebugger();
    }
    return FieldMapperDebugger.instance;
  }

  /**
   * Activa la captura de errores de la consola
   */
  public enableConsoleCapture(): void {
    if (this.consoleOverridden) return;
    
    console.error = (...args: unknown[]) => {
      // Capturar el error para el depurador
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      this.captureError('unknown', errorMessage, 'high');
      
      // Llamar al método original
      this.originalConsoleError.apply(console, args);
    };
    
    console.warn = (...args: unknown[]) => {
      // Capturar la advertencia para el depurador
      const warnMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      this.captureError('unknown', warnMessage, 'medium');
      
      // Llamar al método original
      this.originalConsoleWarn.apply(console, args);
    };
    
    this.consoleOverridden = true;
  }

  /**
   * Desactiva la captura de errores de la consola
   */
  public disableConsoleCapture(): void {
    if (!this.consoleOverridden) return;
    
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
    
    this.consoleOverridden = false;
  }

  /**
   * Registra un error en el sistema de depuración
   */
  public captureError(
    component: string, 
    message: string, 
    severity: ErrorSeverity = 'medium',
    metadata?: Record<string, unknown>
  ): string {
    if (!this.isEnabled) return '';
    
    const now = Date.now();
    // Crear un ID basado en el componente y mensaje para agrupar errores similares
    const errorId = `${component}:${message.substring(0, 100)}`;
    
    if (this.errors.has(errorId)) {
      // Actualizar error existente
      const existingError = this.errors.get(errorId)!;
      existingError.count += 1;
      existingError.lastOccurrence = now;
      if (metadata) {
        existingError.metadata = { ...existingError.metadata, ...metadata };
      }
    } else {
      // Crear nuevo error
      this.errors.set(errorId, {
        id: errorId,
        timestamp: now,
        component,
        message,
        severity,
        count: 1,
        lastOccurrence: now,
        metadata
      });
    }
    
    return errorId;
  }

  /**
   * Método para capturar el estado actual de la aplicación
   */
  public captureState(component: string, state: Record<string, unknown>): void {
    if (!this.isEnabled) return;
    
    try {
      const stateId = `state_${Date.now()}`;
      const timestamp = Date.now();
      
      // Almacenar el estado para depuración posteriormente
      this.stateHistory.set(stateId, {
        component,
        timestamp,
        state: JSON.parse(JSON.stringify(state)) // Clonar para evitar referencias
      });
      
      // Mantener solo los últimos N estados
      if (this.stateHistory.size > this.maxStoredStates) {
        const oldestKey = Array.from(this.stateHistory.keys())[0];
        this.stateHistory.delete(oldestKey);
      }
      
      console.debug(`[DEBUG] Estado capturado para ${component}`);
    } catch (error) {
      console.error('Error al capturar estado:', error);
    }
  }

  /**
   * Genera un informe detallado de todos los errores registrados
   */
  public generateReport(): { report: string, criticalCount: number, highCount: number } {
    if (this.errors.size === 0) {
      return { 
        report: "No se han registrado errores.", 
        criticalCount: 0, 
        highCount: 0 
      };
    }

    // Convertir el mapa a array para ordenar
    const errorList = Array.from(this.errors.values());
    
    // Ordenar por severidad y luego por conteo
    errorList.sort((a, b) => {
      const severityWeight: Record<ErrorSeverity, number> = {
        'critical': 4,
        'high': 3,
        'medium': 2,
        'low': 1
      };
      
      if (severityWeight[a.severity] !== severityWeight[b.severity]) {
        return severityWeight[b.severity] - severityWeight[a.severity];
      }
      
      return b.count - a.count;
    });
    
    // Contar errores por severidad
    const criticalCount = errorList.filter(e => e.severity === 'critical').length;
    const highCount = errorList.filter(e => e.severity === 'high').length;
    
    // Generar informe
    let report = `# INFORME DE ERRORES (${new Date().toLocaleString()})\n\n`;
    report += `Total de errores únicos: ${this.errors.size}\n`;
    report += `Errores críticos: ${criticalCount}\n`;
    report += `Errores altos: ${highCount}\n\n`;
    
    // Agrupar por componente
    const componentGroups: Record<string, DebugError[]> = {};
    
    for (const error of errorList) {
      if (!componentGroups[error.component]) {
        componentGroups[error.component] = [];
      }
      componentGroups[error.component].push(error);
    }
    
    // Generar informe por componente
    for (const [component, errors] of Object.entries(componentGroups)) {
      report += `## Componente: ${component}\n\n`;
      
      for (const error of errors) {
        const date = new Date(error.timestamp).toLocaleString();
        report += `[${error.severity.toUpperCase()}] (${date}) - ${error.message}\n`;
        report += `Ocurrencias: ${error.count}\n`;
        
        if (error.stack) {
          report += `Stack: ${error.stack.split('\n')[0]}\n`;
        }
        
        report += `\n`;
      }
    }
    
    return { report, criticalCount, highCount };
  }

  /**
   * Guarda el informe en localStorage para revisión posterior
   */
  public saveReport(): void {
    if (typeof window === 'undefined') return;
    
    const { report } = this.generateReport();
    localStorage.setItem('field-mapper-debug-report', report);
    localStorage.setItem('field-mapper-debug-timestamp', Date.now().toString());
  }

  /**
   * Limpia todos los errores registrados
   */
  public clearErrors(): void {
    this.errors.clear();
  }

  /**
   * Activa o desactiva el depurador
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Crear una instancia global
let debuggerInstance: FieldMapperDebugger | null = null;

// Función para obtener la instancia del debugger (reemplaza al hook)
export const getFieldMapperDebugger = (): FieldMapperDebugger => {
  if (!debuggerInstance) {
    debuggerInstance = FieldMapperDebugger.getInstance();
  }
  return debuggerInstance;
};

// Solo para componentes React - mantenemos el nombre para compatibilidad
export const useFieldMapperDebugger = getFieldMapperDebugger;

// Función para registrar errores desde componentes
export const captureFieldMapperError = (
  component: string, 
  message: string, 
  severity: ErrorSeverity = 'medium',
  metadata?: Record<string, unknown>
): void => {
  getFieldMapperDebugger().captureError(component, message, severity, metadata);
};

// Función para registrar el estado de la aplicación
export const captureFieldMapperState = (
  component: string,
  state: Record<string, unknown>
): void => {
  getFieldMapperDebugger().captureError(
    component,
    'Estado registrado para depuración',
    'low',
    { state }
  );
};
