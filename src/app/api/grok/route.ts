import { NextResponse } from 'next/server'

// Respuestas predefinidas para el modo demo de Grok
const DEMO_RESPONSES = [
  {
    response: 'Interesante pregunta. Analizando los datos de X.com en tiempo real...',
    suggestions: ['Considera las tendencias actuales', 'Analiza el impacto en el mercado', 'Evalúa las métricas clave']
  },
  {
    response: '¡Excelente punto! Basándome en las conversaciones recientes en X...',
    suggestions: ['Revisa los datos históricos', 'Compara con casos similares', 'Identifica patrones']
  },
  {
    response: 'Déjame ser directo y un poco sarcástico aquí...',
    suggestions: ['Piensa fuera de la caja', 'Cuestiona las suposiciones', 'Innova en el enfoque']
  },
  {
    response: 'Según los últimos tweets y tendencias...',
    suggestions: ['Monitorea la conversación', 'Adapta la estrategia', 'Optimiza resultados']
  }
]

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simular un pequeño retraso para hacer la experiencia más realista
    await new Promise(resolve => setTimeout(resolve, 800))

    // Seleccionar una respuesta aleatoria
    const response = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)]

    return NextResponse.json({
      response: `[MODO DEMO] ${response.response}\n\n🤖 Sugerencias:\n${response.suggestions.map(s => `• ${s}`).join('\n')}\n\nNota: Este es un modo de demostración. Para obtener respuestas reales de Grok, necesitarás configurar GROK_API_KEY en el archivo .env.local`,
      timestamp: Date.now()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
