'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type Ship = {
  x: number
  y: number
  angle: number
  speed: number
  maxSpeed: number
  color: string
}

type Bullet = {
  x: number
  y: number
  speedX: number
  speedY: number
  color: string
}

type Asteroid = {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  color: string
}



export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [currentBulletColor, setCurrentBulletColor] = useState('rgb(255, 0, 0)')

  useEffect(() => {
    if (!gameStarted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Ship
    const ship: Ship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: 0,
      speed: 0,
      maxSpeed: 5,
      color: 'rgb(255, 255, 255)'
    }

    // Game state
    const gameState = {
      bullets: [] as Bullet[],
      asteroids: [] as Asteroid[],
      keys: {} as { [key: string]: boolean }
    }

    // Initialize asteroids
    for (let i = 0; i < 5; i++) {
      gameState.asteroids.push(createAsteroid())
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys[e.key] = true
      if (e.key === '1') setCurrentBulletColor('rgb(255, 0, 0)') // Red
      if (e.key === '2') setCurrentBulletColor('rgb(0, 255, 0)') // Green
      if (e.key === '3') setCurrentBulletColor('rgb(0, 0, 255)') // Blue
      if (e.key === ' ') shoot()
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys[e.key] = false
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    function createAsteroid(): Asteroid {
      if (!canvas) return {
        x: 0,
        y: 0,
        radius: 30,
        speedX: 0,
        speedY: 0,
        color: 'rgb(200, 50, 50)'
      }

      const colors = [
        'rgb(200, 50, 50)', // Red dominant
        'rgb(50, 200, 50)', // Green dominant
        'rgb(50, 50, 200)'  // Blue dominant
      ]
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 30,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    }

    function shoot() {
      const bullet: Bullet = {
        x: ship.x,
        y: ship.y,
        speedX: Math.cos(ship.angle) * 7,
        speedY: Math.sin(ship.angle) * 7,
        color: currentBulletColor
      }
      gameState.bullets.push(bullet)
    }

    function update() {
      // Move ship
      if (!gameOver) {
        if (gameState.keys['ArrowUp'] || gameState.keys['w']) ship.speed = Math.min(ship.speed + 0.2, ship.maxSpeed)
        if (gameState.keys['ArrowDown'] || gameState.keys['s']) ship.speed = Math.max(ship.speed - 0.3, -ship.maxSpeed / 2)
        if (gameState.keys['ArrowLeft'] || gameState.keys['a']) ship.angle -= 0.1
        if (gameState.keys['ArrowRight'] || gameState.keys['d']) ship.angle += 0.1
        ship.x += Math.cos(ship.angle) * ship.speed
        ship.y += Math.sin(ship.angle) * ship.speed
        ship.speed *= 0.98 // Reduced friction for smoother movement
      }
      if (!canvas) return
      if (ship.x < 0) ship.x = canvas.width
      if (ship.x > canvas.width) ship.x = 0
      if (ship.y < 0) ship.y = canvas.height
      if (ship.y > canvas.height) ship.y = 0

      // Move bullets
      if (canvas) {
        gameState.bullets = gameState.bullets.filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height)
        gameState.bullets.forEach(b => {
          b.x += b.speedX
          b.y += b.speedY
        })
      }

      // Move asteroids
      if (canvas) {
        gameState.asteroids.forEach(a => {
          a.x += a.speedX
          a.y += a.speedY
          if (a.x < 0) a.x = canvas.width
          if (a.x > canvas.width) a.x = 0
          if (a.y < 0) a.y = canvas.height
          if (a.y > canvas.height) a.y = 0
        })
      }

      // Collisions
      for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
        // Ship collision
        const shipDx = gameState.asteroids[i].x - ship.x
        const shipDy = gameState.asteroids[i].y - ship.y
        const shipDistance = Math.sqrt(shipDx * shipDx + shipDy * shipDy)
        if (shipDistance < gameState.asteroids[i].radius + 15) { // 15 is approximate ship radius
          setGameOver(true)
          break
        }

        // Bullet collisions
        for (let j = gameState.bullets.length - 1; j >= 0; j--) {
          const dx = gameState.asteroids[i].x - gameState.bullets[j].x
          const dy = gameState.asteroids[i].y - gameState.bullets[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < gameState.asteroids[i].radius) {
            // Check color match
            const asteroidRGB = gameState.asteroids[i].color.match(/\d+/g)?.map(Number) || []
            const bulletRGB = gameState.bullets[j].color.match(/\d+/g)?.map(Number) || []
            const dominantAsteroid = asteroidRGB.indexOf(Math.max(...asteroidRGB))
            const dominantBullet = bulletRGB.indexOf(Math.max(...bulletRGB))
            
            gameState.bullets.splice(j, 1)
            if (dominantAsteroid === dominantBullet) {
              gameState.asteroids.splice(i, 1)
              gameState.asteroids.push(createAsteroid())
              setScore(prev => prev + 100)
            } else {
              // Visual feedback for mismatched colors
              ctx?.save()
              ctx?.beginPath()
              ctx?.arc(gameState.asteroids[i].x, gameState.asteroids[i].y, gameState.asteroids[i].radius + 10, 0, Math.PI * 2)
              ctx!.strokeStyle = 'white'
              ctx?.stroke()
              ctx?.restore()
            }
            break
          }
        }
      }
    }

    function draw() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ship
      ctx.save()
      ctx.translate(ship.x, ship.y)
      ctx.rotate(ship.angle)
      ctx.fillStyle = ship.color
      ctx.beginPath()
      ctx.moveTo(20, 0)
      ctx.lineTo(-10, 10)
      ctx.lineTo(-10, -10)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Draw bullets
      gameState.bullets.forEach(b => {
        ctx.fillStyle = b.color
        ctx.beginPath()
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw asteroids
      gameState.asteroids.forEach(a => {
        ctx.fillStyle = a.color
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    let animationFrame: number
    function gameLoop() {
      update()
      draw()
      animationFrame = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameStarted, currentBulletColor, gameOver])

  return (
    <div className="px-6">
      <div className="max-w-screen-xl mx-auto">
        {!gameStarted ? (
          <motion.div 
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4 text-center">
              <h2 className="text-2xl text-white font-mono">Controls:</h2>
              <ul className="text-white/60 space-y-2 font-mono">
                <li>Arrow keys or WASD to move</li>
                <li>Space to shoot</li>
                <li>1, 2, 3 to change bullet color (RGB)</li>
                <li>Match bullet color with asteroid color to destroy them</li>
              </ul>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="px-8 py-4 bg-[#00ff00] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              Start Game
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={600}
              className="border border-white/10 bg-black mx-auto"
            />
            <div className="absolute top-4 right-4 space-y-2">
              <div className="text-2xl text-white font-mono">Score: {score}</div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 font-mono text-sm">Current Color:</span>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: currentBulletColor }}
                />
              </div>
            </div>
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl text-white font-mono">Game Over!</h2>
                  <p className="text-white/60 font-mono">Final Score: {score}</p>
                  <button
                    onClick={() => {
                      setGameOver(false)
                      setScore(0)
                      setGameStarted(false)
                    }}
                    className="px-8 py-4 bg-[#00ff00] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
