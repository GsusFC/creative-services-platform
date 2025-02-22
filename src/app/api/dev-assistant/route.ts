import { NextResponse } from 'next/server';

const DEMO_RESPONSES = [
  {
    message: 'Analizando el código...',
    suggestions: [
      {
        title: 'Optimización',
        code: 'console.log("Optimización")',
        explanation: 'Ejemplo de optimización'
      }
    ]
  }
];

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const response = DEMO_RESPONSES[0];
    return NextResponse.json({
      message: `[DEMO] ${response.message}`,
      suggestions: response.suggestions
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error' },
      { status: 500 }
    );
  }
}
