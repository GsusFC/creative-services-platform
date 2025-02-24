import { z } from 'zod';

/**
 * Esquema base para IDs
 */
export const idSchema = z.string().min(1);

/**
 * Esquema base para timestamps
 */
export const timestampSchema = z.number().int().positive();

/**
 * Esquema base para URLs
 */
export const urlSchema = z.string().url();

/**
 * Esquema base para emails
 */
export const emailSchema = z.string().email();

/**
 * Esquema para respuestas de API
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

/**
 * Tipo para respuestas de API
 */
export type ApiResponse<T = unknown> = z.infer<typeof apiResponseSchema> & {
  data?: T;
};

/**
 * Helper para manejar errores de validación
 */
export const handleValidationError = (error: unknown): ApiResponse => {
  if (error instanceof z.ZodError) {
    return {
      success: false,
      message: 'Validation error',
      error: error.errors.map(e => e.message).join(', '),
    };
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      message: 'Error processing request',
      error: error.message,
    };
  }

  return {
    success: false,
    message: 'Unknown error',
    error: 'An unexpected error occurred',
  };
};
