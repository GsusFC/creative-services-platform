import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const MAPPINGS_FILE = path.join(process.cwd(), 'notion-mappings.json')

export async function GET() {
  try {
    let mappings;
    try {
      const fileContents = await fs.readFile(MAPPINGS_FILE, 'utf-8')
      mappings = JSON.parse(fileContents)
    } catch (error) {
      // If file doesn't exist, return empty mappings
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json([])
      }
      // If file exists but is corrupted, return empty mappings
      console.error('Error reading mappings file:', error)
      return NextResponse.json([])
    }
    return NextResponse.json(mappings)
  } catch (error) {
    console.error('Unexpected error in mappings GET:', error)
    return NextResponse.json(
      [],
      { status: 200 } // Return empty array with 200 status to prevent frontend errors
    )
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json()
    } catch (error) {
      console.error('Invalid JSON in request body:', error)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    try {
      // Create directory if it doesn't exist
      const dir = path.dirname(MAPPINGS_FILE)
      await fs.mkdir(dir, { recursive: true })
      
      await fs.writeFile(MAPPINGS_FILE, JSON.stringify(body, null, 2))
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error writing mappings file:', error)
      return NextResponse.json(
        { error: 'Failed to save mappings', details: (error as Error).message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error in mappings POST:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
