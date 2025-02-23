'use client'

import { Game } from '@/components/game/Game'

export default function GamePage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="pt-32 md:pt-40">
        <div className="px-6 mb-16">
          <h1 
            className="text-6xl md:text-8xl font-druk text-white uppercase mb-4" 
          >
            RGB Game
          </h1>
          <p 
            className="text-[#00ff00] text-lg tracking-wider uppercase" 
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Destroy asteroids with matching colors
          </p>
        </div>
        <Game />
      </div>
    </main>
  )
}
