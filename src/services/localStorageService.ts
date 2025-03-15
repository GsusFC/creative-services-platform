/**
 * Servicio para gestionar el almacenamiento local de datos del módulo Do-It-Yourself
 */

// Claves para el almacenamiento
const STORAGE_KEYS = {
  BUDGET: 'diy-budget',
  CLIENT_INFO: 'diy-client-info',
  PROJECT_INFO: 'diy-project-info'
};

/**
 * Tipos para la información que se almacenará
 */
export interface StoredClientInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface StoredProjectInfo {
  description: string;
  timeline: string;
  contactPreference: string;
}

export interface StoredBudget<T> {
  services: T[];
  clientInfo: StoredClientInfo;
  projectInfo: StoredProjectInfo;
  lastUpdated: string; // ISO string date
}

/**
 * Guarda el presupuesto completo en localStorage
 */
export const saveBudget = <T>(budget: StoredBudget<T>): void => {
  try {
    const budgetWithTimestamp = {
      ...budget,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgetWithTimestamp));
  } catch (error) {
    console.error('Error al guardar el presupuesto:', error);
  }
};

/**
 * Carga el presupuesto desde localStorage
 */
export const loadBudget = <T>(): StoredBudget<T> | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!data) return null;
    
    return JSON.parse(data) as StoredBudget<T>;
  } catch (error) {
    console.error('Error al cargar el presupuesto:', error);
    return null;
  }
};

/**
 * Actualiza solo la información del cliente
 */
export const saveClientInfo = (clientInfo: StoredClientInfo): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENT_INFO, JSON.stringify(clientInfo));
    
    // También actualizamos en el presupuesto completo si existe
    const storedBudget = loadBudget();
    if (storedBudget) {
      saveBudget({
        ...storedBudget,
        clientInfo
      });
    }
  } catch (error) {
    console.error('Error al guardar información del cliente:', error);
  }
};

/**
 * Actualiza solo la información del proyecto
 */
export const saveProjectInfo = (projectInfo: StoredProjectInfo): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECT_INFO, JSON.stringify(projectInfo));
    
    // También actualizamos en el presupuesto completo si existe
    const storedBudget = loadBudget();
    if (storedBudget) {
      saveBudget({
        ...storedBudget,
        projectInfo
      });
    }
  } catch (error) {
    console.error('Error al guardar información del proyecto:', error);
  }
};

/**
 * Borra todos los datos del almacenamiento local
 */
export const clearStoredBudget = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.BUDGET);
    localStorage.removeItem(STORAGE_KEYS.CLIENT_INFO);
    localStorage.removeItem(STORAGE_KEYS.PROJECT_INFO);
  } catch (error) {
    console.error('Error al limpiar datos guardados:', error);
  }
};

/**
 * Verifica si hay un presupuesto guardado
 */
export const hasSavedBudget = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.BUDGET) !== null;
};
