import { z } from 'zod';
import { delay } from '@/lib/utils/delay';
import { createApiHandler } from '@/lib/utils/api';
import { idSchema } from '@/lib/utils/validation';

// Schema de validación para la petición
const chatRequestSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío'),
  userId: idSchema.optional(),
});

// Tipo para la petición del chat
type ChatRequest = z.infer<typeof chatRequestSchema>;

// Respuestas predefinidas para el modo demo
const DEMO_RESPONSES = [
  'Me encantaría ayudarte con eso. ¿Podrías darme más detalles?',
  'Basado en tu pregunta, sugiero que consideremos las siguientes opciones...',
  'Interesante perspectiva. Permíteme analizar esto más a fondo.',
  'He identificado varios puntos clave en tu solicitud.',
  'Aquí hay algunas sugerencias que podrían ser útiles...',
];

/**
 * Maneja las peticiones del chat en modo demo
 * @param request Petición HTTP
 * @returns Respuesta del chat en modo demo
 */
const handleChatRequest = async (request: Request): Promise<ChatRequest & { timestamp: number }> => {
  // Validar la estructura de la petición
  const body = await request.json();
  const validatedData = chatRequestSchema.parse(body);

  // Simular un pequeño retraso para hacer la experiencia más realista
  await delay(1000);

  // Seleccionar una respuesta aleatoria
  const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];

  return {
    message: `[MODO DEMO] ${randomResponse}\n\nNota: Este es un modo de demostración.`,
    userId: validatedData.userId,
    timestamp: Date.now(),
  };
};

// Exportar el manejador de la ruta POST con manejo de errores integrado
export const POST = createApiHandler(handleChatRequest);

