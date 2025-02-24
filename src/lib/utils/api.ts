import { NextResponse } from 'next/server';
import { ApiResponse, handleValidationError } from './validation';

/**
 * Opciones para la respuesta de la API
 */
interface ApiOptions {
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Crea una respuesta de API exitosa
 */
export const apiSuccess = <T>(
  data: T,
  message = 'Success',
  options: ApiOptions = {}
): NextResponse => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(response, {
    status: options.status || 200,
    headers: options.headers,
  });
};

/**
 * Crea una respuesta de API con error
 */
export const apiError = (
  error: unknown,
  message = 'Error',
  options: ApiOptions = {}
): NextResponse => {
  const response = handleValidationError(error);
  
  return NextResponse.json(
    { ...response, message },
    { status: options.status || 400, headers: options.headers }
  );
};

/**
 * Wrapper para manejar rutas de API de forma segura
 */
export const createApiHandler = <T>(
  handler: (req: Request) => Promise<T>
) => {
  return async (req: Request): Promise<NextResponse> => {
    try {
      const data = await handler(req);
      return apiSuccess(data);
    } catch (error) {
      return apiError(error);
    }
  };
};
