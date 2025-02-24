/**
 * Verifica si el código se está ejecutando en el navegador
 * @returns true si se está ejecutando en el navegador, false si es server-side
 */
export const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Verifica si el código se está ejecutando en el servidor
 * @returns true si se está ejecutando en el servidor, false si es client-side
 */
export const isServer = (): boolean => !isBrowser();

/**
 * Ejecuta una función solo si estamos en el navegador
 * @param fn Función a ejecutar
 * @returns El resultado de la función o undefined si estamos en el servidor
 */
export const runInBrowser = <T>(fn: () => T): T | undefined => {
  if (isBrowser()) {
    return fn();
  }
  return undefined;
};
