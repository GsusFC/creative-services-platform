import { NextResponse } from 'next/server';

// Respuestas predefinidas para el modo demo
const DEMO_RESPONSES = [
  'Me encantaría ayudarte con eso. ¿Podrías darme más detalles?',
  'Basado en tu pregunta, sugiero que consideremos las siguientes opciones...',
  'Interesante perspectiva. Permíteme analizar esto más a fondo.',
  'He identificado varios puntos clave en tu solicitud.',
  'Aquí hay algunas sugerencias que podrían ser útiles...',
];

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content;

    // Simular un pequeño retraso para hacer la experiencia más realista
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Seleccionar una respuesta aleatoria
    const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];

    return NextResponse.json({
      message: `[MODO DEMO] ${randomResponse}\n\nNota: Este es un modo de demostración. Para obtener respuestas reales, necesitarás configurar OPENAI_API_KEY en el archivo .env.local`,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
