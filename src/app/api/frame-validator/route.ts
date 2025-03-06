import { NextRequest, NextResponse } from 'next/server';

// API para validar Frames de Farcaster
export async function GET(request: NextRequest) {
  try {
    // Obtener la URL del frame a validar
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({
        valid: false,
        error: 'No URL parameter provided',
      }, { status: 400 });
    }
    
    try {
      // Intentar obtener el contenido de la URL
      const response = await fetch(url);
      
      if (!response.ok) {
        return NextResponse.json({
          valid: false,
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        }, { status: 400 });
      }
      
      const html = await response.text();
      
      // Validar que el HTML contenga los meta tags requeridos para Frames
      const validation = validateFrameMetaTags(html);
      
      return NextResponse.json(validation);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({
        valid: false,
        error: `Error fetching URL: ${errorMessage}`,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in frame-validator:', error);
    return NextResponse.json({ 
      valid: false,
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

// Función para validar los meta tags de Frames
function validateFrameMetaTags(html: string): { 
  valid: boolean; 
  errors?: string[]; 
  warnings?: string[];
  metaTags?: Record<string, string>;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metaTags: Record<string, string> = {};
  
  // Verificar presencia del tag fc:frame
  const frameVersionRegex = /<meta\s+property=["']fc:frame["']\s+content=["'](vNext|1)["']\s*\/?>/i;
  const frameVersionMatch = html.match(frameVersionRegex);
  
  if (!frameVersionMatch) {
    errors.push('Missing required meta tag: fc:frame');
  } else {
    metaTags['fc:frame'] = frameVersionMatch[1];
  }
  
  // Verificar presencia de la imagen
  const frameImageRegex = /<meta\s+property=["']fc:frame:image["']\s+content=["'](.+?)["']\s*\/?>/i;
  const frameImageMatch = html.match(frameImageRegex);
  
  if (!frameImageMatch) {
    errors.push('Missing required meta tag: fc:frame:image');
  } else {
    metaTags['fc:frame:image'] = frameImageMatch[1];
    
    // Validar URL de la imagen
    try {
      new URL(frameImageMatch[1]);
    } catch (e) {
      errors.push('Invalid URL in fc:frame:image');
    }
  }
  
  // Verificar post_url si hay botones
  const buttonRegex = /<meta\s+property=["']fc:frame:button:(\d+)["']\s+content=["'](.+?)["']\s*\/?>/gi;
  let buttonMatch;
  const buttons: string[] = [];
  
  while ((buttonMatch = buttonRegex.exec(html)) !== null) {
    buttons.push(buttonMatch[2]);
    metaTags[`fc:frame:button:${buttonMatch[1]}`] = buttonMatch[2];
  }
  
  if (buttons.length > 0) {
    const postUrlRegex = /<meta\s+property=["']fc:frame:post_url["']\s+content=["'](.+?)["']\s*\/?>/i;
    const postUrlMatch = html.match(postUrlRegex);
    
    if (!postUrlMatch) {
      errors.push('Missing required meta tag: fc:frame:post_url (required when buttons are present)');
    } else {
      metaTags['fc:frame:post_url'] = postUrlMatch[1];
      
      // Validar URL del post_url
      try {
        new URL(postUrlMatch[1]);
      } catch (e) {
        errors.push('Invalid URL in fc:frame:post_url');
      }
    }
  }
  
  // Verificar input (opcional)
  const inputTextRegex = /<meta\s+property=["']fc:frame:input:text["']\s+content=["'](.+?)["']\s*\/?>/i;
  const inputTextMatch = html.match(inputTextRegex);
  
  if (inputTextMatch) {
    metaTags['fc:frame:input:text'] = inputTextMatch[1];
  }
  
  // Advertencias
  if (buttons.length > 4) {
    warnings.push('More than 4 buttons defined. Only the first 4 will be used.');
  }
  
  if (inputTextMatch && !buttons.includes('Escribir Palabra')) {
    warnings.push('Input field is defined but no button seems to use it (based on button text)');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    metaTags: Object.keys(metaTags).length > 0 ? metaTags : undefined,
  };
}
