/**
 * Crea una promesa que se resuelve después de un tiempo especificado
 * @param ms Tiempo de espera en milisegundos
 * @returns Promesa que se resuelve después del tiempo especificado
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
