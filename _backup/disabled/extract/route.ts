import { NextResponse } from 'next/server'
import type { ExtractorRule } from '@/types/extractor'

const FIRECRAWL_API_KEY = process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY

if (!FIRECRAWL_API_KEY) {
  throw new Error('Missing FIRECRAWL_API_KEY environment variable')
}

export async function POST(request: Request) {
  try {
    const { url, config } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.firecrawl.com/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        schema: config.schema,
        prompt: `Please extract the following information from the case study at ${url}:\n\n` +
          config.rules.map((rule: ExtractorRule) => 
            `${rule.name}${rule.required ? ' (Required)' : ''}: ${rule.description}`
          ).join('\n')
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.error || 
        `Failed to extract content from Firecrawl: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    
    // Transform the response to match our expected format
    const transformedData = {
      title: data.title || '',
      client: data.client || '',
      industry: data.industry || '',
      challenge: data.challenge || '',
      solution: data.solution || '',
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      results: Array.isArray(data.results) ? data.results : [],
      timeline: data.timeline || null,
      teamSize: typeof data.teamSize === 'number' ? data.teamSize : null,
      images: Array.isArray(data.images) ? data.images : []
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error extracting content:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract content' },
      { status: 500 }
    )
  }
}
