import { NextRequest, NextResponse } from 'next/server';

// API para manejar las acciones de los Frames
export async function POST(request: NextRequest) {
  try {
    // Obtener los datos del cuerpo
    const formData = await request.formData();
    const untrustedData = formData.get('untrustedData');
    
    let action = { buttonIndex: 1 };
    let inputText = '';
    
    if (untrustedData) {
      try {
        const parsed = JSON.parse(untrustedData as string);
        action = parsed;
        inputText = formData.get('inputText') as string || '';
      } catch (e) {
        console.error('Error parsing untrustedData:', e);
      }
    }
    
    // Generar palabra o establecer la palabra desde el input
    const { buttonIndex } = action;
    
    let word = 'HELLO';
    let bgColor = '#000000';
    
    // Lógica según el botón presionado
    if (buttonIndex === 1) {
      // Generar palabra aleatoria
      const randomWords = ['HELLO', 'WORLD', 'FRAME', 'FLAGS', 'NAVAL', 'OCEAN'];
      word = randomWords[Math.floor(Math.random() * randomWords.length)];
    } else if (buttonIndex === 2) {
      // Cambiar color de fondo
      const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
      bgColor = colors[Math.floor(Math.random() * colors.length)];
      word = formData.get('word') as string || 'HELLO';
    } else if (buttonIndex === 3) {
      // Ver completo
      return NextResponse.redirect(new URL('/flag-system-v3', request.url));
    } else if (buttonIndex === 4 && inputText) {
      // Usar palabra del input
      word = inputText.toUpperCase().substring(0, 6);
    }
    
    // Construir la respuesta HTML con los meta tags de Frame
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${new URL(`/api/flag-image?word=${word}&bg=${encodeURIComponent(bgColor)}`, request.url)}" />
          <meta property="fc:frame:post_url" content="${new URL('/api/frame-action', request.url)}" />
          <meta property="fc:frame:button:1" content="Generar Palabra" />
          <meta property="fc:frame:button:2" content="Cambiar Fondo" />
          <meta property="fc:frame:button:3" content="Ver Completo" />
          <meta property="fc:frame:button:4" content="Escribir Palabra" />
          <meta property="fc:frame:input:text" content="Escribe una palabra (máx. 6 caracteres)" />
          <meta property="og:title" content="Sistema de Banderas Náuticas" />
          <meta property="og:description" content="Visualiza palabras usando banderas náuticas del código internacional de señales." />
        </head>
        <body>
          <input type="hidden" name="word" value="${word}" />
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error en frame-action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
