import { NextResponse } from 'next/server';
import { ApiResponse, handleValidationError } from './validation';

/**
 * Opciones para la respuesta de la API
 */
interface ApiOptions {
  status?: number | undefined;
  headers?: Record<string, string> | undefined;
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

  // Creamos un objeto de opciones de respuesta que cumpla con HeadersInit
  const responseOptions: ResponseInit = {};
  
  if (typeof options.status === 'number') {
    responseOptions.status = options.status;
  } else {
    responseOptions.status = 200;
  }
  
  if (options.headers !== undefined && options.headers !== null) {
    responseOptions.headers = options.headers;
  }
  
  return NextResponse.json(response, responseOptions);
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
  
  // Creamos un objeto de opciones de respuesta que cumpla con HeadersInit
  const responseOptions: ResponseInit = {};
  
  if (typeof options.status === 'number') {
    responseOptions.status = options.status;
  } else {
    responseOptions.status = 400;
  }
  
  if (options.headers !== undefined && options.headers !== null) {
    responseOptions.headers = options.headers;
  }
  
  return NextResponse.json({ ...response, message }, responseOptions);
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
