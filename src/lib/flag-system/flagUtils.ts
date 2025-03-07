import { letterToFlag, getAllFlags, FlagData } from './flagMap';

// Letras soportadas (A-Z)
export const supportedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Obtiene la información de la bandera para una letra determinada
 * Compatible con la interfaz que usa el nuevo componente FlagSystem v4
 */
export function getFlagInfo(letter: string): FlagData | null {
  return letterToFlag(letter);
}

/**
 * Obtiene todas las banderas disponibles
 */
export function getAllFlagInfo(): FlagData[] {
  return getAllFlags();
}

/**
 * Verifica si una letra está soportada en el sistema de banderas
 */
export function isLetterSupported(letter: string): boolean {
  return supportedLetters.includes(letter.toUpperCase());
}
