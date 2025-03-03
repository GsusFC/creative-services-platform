import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un slug a partir de un título o texto
 * @param text Texto a convertir en slug
 * @returns Slug generado
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Normalizar acentos
    .replace(/[\u0300-\u036f]/g, '')   // Eliminar diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')              // Espacios a guiones
    .replace(/[^\w-]+/g, '')           // Eliminar caracteres no alfanuméricos
    .replace(/--+/g, '-')              // Eliminar guiones múltiples
    .replace(/^-+|-+$/g, '');          // Eliminar guiones al inicio y final
}
