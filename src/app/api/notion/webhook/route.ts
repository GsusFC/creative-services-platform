import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Verificar el header de Notion
    const headersList = await headers()
    const notionSignature = headersList.get('notion-signature')
    
    if (!notionSignature) {
      return NextResponse.json(
        { error: 'Missing Notion signature' },
        { status: 401 }
      )
    }

    // Leer el body del request
    const body = await request.text()
    
    // TODO: Implementar validación de firma cuando tengamos el secret
    // const isValid = verifySignature(body, notionSignature)
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    // Parsear el payload
    const payload = JSON.parse(body)
    console.log('Received Notion webhook:', payload)

    // TODO: Procesar el evento según su tipo
    // await handleNotionEvent(payload)

    return NextResponse.json(
      { message: 'Webhook received successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing Notion webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper para verificar la firma (se implementará luego)
// function verifySignature(body: string, signature: string): boolean {
//   // Implementar usando crypto.subtle
//   return true
// }
