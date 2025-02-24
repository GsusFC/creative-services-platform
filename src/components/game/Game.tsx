'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type PowerUpType = 'rapidFire' | 'tripleShot' | 'shield' | 'chaosMode'

type PowerUp = {
  x: number
  y: number
  type: PowerUpType
  radius: number
  rotation: number
}

type Trail = {
  x: number
  y: number
  color: string
  life: number
}

type Particle = {
  x: number
  y: number
  speedX: number
  speedY: number
  color: string
  life: number
  maxLife: number
  size: number
  rotation: number
}

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
  // Estado para el tutorial
  const [showTutorial, setShowTutorial] = useState(true)

  useEffect(() => {
    const tutorialShown = localStorage.getItem('tutorialShown')
    if (tutorialShown) {
      setShowTutorial(false)
    }
  }, [])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [currentBulletColor, setCurrentBulletColor] = useState('rgb(255, 0, 0)')
  const [activePowerUps, setActivePowerUps] = useState<PowerUpType[]>([])
  const [shieldHealth, setShieldHealth] = useState(0)

  useEffect(() => {
    if (!gameStarted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to fill most of the screen while maintaining aspect ratio
    const aspectRatio = 16/9 // Cambiado a 16:9 para un aspecto más panorámico
    const maxHeight = window.innerHeight * 0.7 // Reducido a 70% de la altura
    const maxWidth = window.innerWidth * 0.85 // 85% del ancho
    
    let width = maxWidth
    let height = width / aspectRatio
    
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
    
    canvas.width = width
    canvas.height = height

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
      particles: [] as Particle[],
      trails: [] as Trail[],
      powerUps: [] as PowerUp[],
      lastPowerUpSpawn: 0,
      powerUpSpawnInterval: 10000, // 10 seconds
      lastShot: 0,
      shotCooldown: 250, // 250ms between shots
      chaosMode: false,
      chaosTimer: 0,
      keys: {} as { [key: string]: boolean }
    }

    // Initialize asteroids
    const maxAsteroids = 5
    for (let i = 0; i < maxAsteroids; i++) {
      gameState.asteroids.push(createAsteroid())
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevenir scroll con teclas de dirección y WASD
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' '].includes(e.key)) {
        e.preventDefault()
      }
      
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
      const defaultAsteroid = {
        x: 0,
        y: 0,
        radius: 30,
        speedX: 0,
        speedY: 0,
        color: 'rgb(200, 50, 50)'
      }

      if (!canvas) return defaultAsteroid

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

    function createPowerUp(): PowerUp {
      const types: PowerUpType[] = ['rapidFire', 'tripleShot', 'shield', 'chaosMode']
      if (!canvas) return {
        x: 0,
        y: 0,
        type: 'shield',
        radius: 15,
        rotation: 0
      }
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        type: types[Math.floor(Math.random() * types.length)],
        radius: 15,
        rotation: 0
      }
    }

    function shoot() {
      const now = Date.now()
      if (now - gameState.lastShot < gameState.shotCooldown && !activePowerUps.includes('rapidFire')) return
      
      gameState.lastShot = now
      
      const createBullet = (angle: number): Bullet => ({
        x: ship.x,
        y: ship.y,
        speedX: Math.cos(angle) * 7,
        speedY: Math.sin(angle) * 7,
        color: gameState.chaosMode ? `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})` : currentBulletColor
      })

      if (activePowerUps.includes('tripleShot')) {
        const spread = 0.2 // Ángulo de dispersión
        gameState.bullets.push(
          createBullet(ship.angle),
          createBullet(ship.angle - spread),
          createBullet(ship.angle + spread)
        )
      } else {
        gameState.bullets.push(createBullet(ship.angle))
      }

      // Añadir trail de disparo
      gameState.trails.push({
        x: ship.x,
        y: ship.y,
        color: currentBulletColor,
        life: 1
      })
    }

    function activatePowerUp(type: PowerUpType) {
      setActivePowerUps(prev => [...prev, type])
      
      if (type === 'rapidFire') {
        gameState.shotCooldown = 100
        setTimeout(() => {
          gameState.shotCooldown = 250
          setActivePowerUps(prev => prev.filter(p => p !== 'rapidFire'))
        }, 5000)
      }
      
      if (type === 'shield') {
        setShieldHealth(3)
      }
      
      if (type === 'chaosMode') {
        gameState.chaosMode = true
        gameState.chaosTimer = Date.now()
        setTimeout(() => {
          gameState.chaosMode = false
          setActivePowerUps(prev => prev.filter(p => p !== 'chaosMode'))
        }, 8000)
      }
    }

    function update() {
      const now = Date.now()
      
      // Spawn power-ups
      if (now - gameState.lastPowerUpSpawn > gameState.powerUpSpawnInterval) {
        gameState.powerUps.push(createPowerUp())
        gameState.lastPowerUpSpawn = now
      }

      // Move ship
      if (!gameOver) {
        if (gameState.keys['ArrowUp'] || gameState.keys['w']) ship.speed = Math.min(ship.speed + 0.2, ship.maxSpeed)
        if (gameState.keys['ArrowDown'] || gameState.keys['s']) ship.speed = Math.max(ship.speed - 0.3, -ship.maxSpeed / 2)
        if (gameState.keys['ArrowLeft'] || gameState.keys['a']) ship.angle -= 0.1
        if (gameState.keys['ArrowRight'] || gameState.keys['d']) ship.angle += 0.1
        ship.x += Math.cos(ship.angle) * ship.speed
        ship.y += Math.sin(ship.angle) * ship.speed
        ship.speed *= 0.98 // Reduced friction for smoother movement

        // Add ship trail
        if (ship.speed > 0.5) {
          const shipTrail: Trail = {
            x: ship.x - Math.cos(ship.angle) * 20,
            y: ship.y - Math.sin(ship.angle) * 20,
            color: 'rgba(255, 255, 255, 0.5)',
            life: 0.8
          }
          gameState.trails.push(shipTrail)
        }
      }
      
      if (!canvas) return
      if (ship.x < 0) ship.x = canvas.width
      if (ship.x > canvas.width) ship.x = 0
      if (ship.y < 0) ship.y = canvas.height
      if (ship.y > canvas.height) ship.y = 0

      // Update power-ups
      for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameState.powerUps[i]
        powerUp.rotation += 0.02

        // Check collision with ship
        const dx = powerUp.x - ship.x
        const dy = powerUp.y - ship.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < powerUp.radius + 15) {
          activatePowerUp(powerUp.type)
          gameState.powerUps.splice(i, 1)
        }
      }

      // Move bullets
      if (canvas) {
        gameState.bullets = gameState.bullets.filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height)
        gameState.bullets.forEach(b => {
          b.x += b.speedX
          b.y += b.speedY
        })

        // Update and remove dead particles
        gameState.particles.forEach(p => {
          p.x += p.speedX
          p.y += p.speedY
          p.life -= 0.02 // Ajusta este valor para cambiar la duración de las partículas
          p.speedX *= 0.98
          p.speedY *= 0.98
        })
        gameState.particles = gameState.particles.filter(p => p.life > 0)
      }

      // Update trails
      for (let i = gameState.trails.length - 1; i >= 0; i--) {
        const trail = gameState.trails[i]
        trail.life -= 0.05
        if (trail.life <= 0) {
          gameState.trails.splice(i, 1)
        }
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

          // Add asteroid trail in chaos mode
          if (gameState.chaosMode && Math.random() > 0.8) {
            const asteroidTrail: Trail = {
              x: a.x,
              y: a.y,
              color: a.color.replace('rgb', 'rgba').replace(')', ', 0.3)'),
              life: 0.5
            }
            gameState.trails.push(asteroidTrail)
          }
        })
      }

      // Collisions
      for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
        // Ship collision
        const shipDx = gameState.asteroids[i].x - ship.x
        const shipDy = gameState.asteroids[i].y - ship.y
        const shipDistance = Math.sqrt(shipDx * shipDx + shipDy * shipDy)
        if (shipDistance < gameState.asteroids[i].radius + 15) { // 15 is approximate ship radius
          if (shieldHealth > 0) {
            // Destroy asteroid and reduce shield
            setShieldHealth(prev => prev - 1)
            gameState.asteroids.splice(i, 1)
            gameState.asteroids.push(createAsteroid())

            // Add shield hit particles
            for (let k = 0; k < 10; k++) {
              const angle = Math.random() * Math.PI * 2
              const speed = 1 + Math.random() * 2
              gameState.particles.push({
                x: ship.x + Math.cos(angle) * 25,
                y: ship.y + Math.sin(angle) * 25,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                color: '#0f0',
                life: 1,
                maxLife: 1,
                size: 3,
                rotation: Math.random() * Math.PI * 2
              })
            }
          } else {
            setGameOver(true)
          }
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
            
            // Guardar posición de la bala antes de eliminarla
            const bulletX = gameState.bullets[j].x
            const bulletY = gameState.bullets[j].y
            
            gameState.bullets.splice(j, 1)
            if (dominantAsteroid === dominantBullet) {
              // Crear explosión de partículas
              const numParticles = 15
              for (let k = 0; k < numParticles; k++) {
                const angle = (Math.PI * 2 * k) / numParticles
                const speed = 2 + Math.random() * 2
                const explosionParticle: Particle = {
                  x: gameState.asteroids[i].x,
                  y: gameState.asteroids[i].y,
                  speedX: Math.cos(angle) * speed,
                  speedY: Math.sin(angle) * speed,
                  color: gameState.asteroids[i].color,
                  life: 1,
                  maxLife: 1,
                  size: 3,
                  rotation: Math.random() * Math.PI * 2
                }
                gameState.particles.push(explosionParticle)
              }

              // Incrementar combo y multiplicador
              setCombo(prev => prev + 1)
              if (combo > 0 && combo % 5 === 0) {
                setMultiplier(prev => Math.min(prev + 1, 10))
              }

              // Calcular puntuación con multiplicador
              const points = 100 * multiplier
              setScore(prev => prev + points)

              // Mostrar puntos ganados como partícula flotante
              const scoreParticle: Particle = {
                x: gameState.asteroids[i].x,
                y: gameState.asteroids[i].y - 20,
                speedX: 0,
                speedY: -1,
                color: '#fff',
                life: 1,
                maxLife: 1,
                size: 12,
                rotation: 0
              }
              gameState.particles.push(scoreParticle)

              // Solo crear nuevo asteroide si hay menos del máximo
              gameState.asteroids.splice(i, 1)
              if (gameState.asteroids.length < maxAsteroids) {
                // Crear asteroide en el borde de la pantalla
                const newAsteroid = createAsteroid()
                // Asegurar que aparece en el borde
                const side = Math.floor(Math.random() * 4)
                switch(side) {
                  case 0: // Arriba
                    newAsteroid.x = Math.random() * canvas.width
                    newAsteroid.y = -newAsteroid.radius
                    newAsteroid.speedY = Math.abs(newAsteroid.speedY)
                    break
                  case 1: // Derecha
                    newAsteroid.x = canvas.width + newAsteroid.radius
                    newAsteroid.y = Math.random() * canvas.height
                    newAsteroid.speedX = -Math.abs(newAsteroid.speedX)
                    break
                  case 2: // Abajo
                    newAsteroid.x = Math.random() * canvas.width
                    newAsteroid.y = canvas.height + newAsteroid.radius
                    newAsteroid.speedY = -Math.abs(newAsteroid.speedY)
                    break
                  case 3: // Izquierda
                    newAsteroid.x = -newAsteroid.radius
                    newAsteroid.y = Math.random() * canvas.height
                    newAsteroid.speedX = Math.abs(newAsteroid.speedX)
                    break
                }
                gameState.asteroids.push(newAsteroid)
              }
            } else {
              // Reset combo on color mismatch
              setCombo(0)
              setMultiplier(1)

              // Visual feedback for mismatched colors
              ctx?.save()
              ctx?.beginPath()
              ctx?.arc(gameState.asteroids[i].x, gameState.asteroids[i].y, gameState.asteroids[i].radius + 10, 0, Math.PI * 2)
              ctx!.strokeStyle = 'red'
              ctx?.stroke()
              ctx?.restore()

              // Add error particles
              for (let k = 0; k < 5; k++) {
                const angle = Math.random() * Math.PI * 2
                const speed = 1 + Math.random() * 2
                gameState.particles.push({
                  x: bulletX,
                  y: bulletY,
                  speedX: Math.cos(angle) * speed,
                  speedY: Math.sin(angle) * speed,
                  color: 'red',
                  life: 1,
                  maxLife: 1,
                  size: 2,
                  rotation: Math.random() * Math.PI * 2
                })
              }
            }
            break
          }
        }
      }
    }

    // Función para dibujar la cuadrícula de fondo
    function drawGrid() {
      if (!ctx || !canvas) return
      
      // Fondo negro puro
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Cuadrícula
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.2)'
      ctx.lineWidth = 0.5
      
      // Líneas verticales
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Líneas horizontales
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Estrellas parpadeantes
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'
      for (let i = 0; i < 50; i++) {
        const opacity = 0.1 + Math.random() * 0.4
        ctx.fillStyle = `rgba(200, 200, 200, ${opacity})`
        ctx.beginPath()
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 1.5,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }

    function draw() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dibujar fondo
      drawGrid()

      // Dibujar trails
      gameState.trails.forEach(trail => {
        ctx.beginPath()
        ctx.arc(trail.x, trail.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = trail.color.replace(')', `, ${trail.life})`)
        ctx.fill()
      })

      // Dibujar nave con efecto neón
      ctx.save()
      ctx.translate(ship.x, ship.y)
      ctx.rotate(ship.angle)
      
      // Efecto de brillo
      ctx.shadowBlur = 15
      ctx.shadowColor = '#ffffff'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      
      ctx.beginPath()
      ctx.moveTo(20, 0)
      ctx.lineTo(-10, 10)
      ctx.lineTo(-10, -10)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // Dibujar balas con efecto neón
      gameState.bullets.forEach(b => {
        ctx.shadowBlur = 10
        ctx.shadowColor = b.color
        ctx.strokeStyle = b.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2)
        ctx.stroke()
      })

      // Dibujar asteroides con efecto neón y forma poligonal
      gameState.asteroids.forEach(a => {
        ctx.shadowBlur = 15
        ctx.shadowColor = a.color
        ctx.strokeStyle = a.color
        ctx.lineWidth = 2

        // Crear forma poligonal para el asteroide
        ctx.beginPath()
        const sides = 6 // Número de lados del polígono
        const angle = (Math.PI * 2) / sides
        
        for (let i = 0; i < sides; i++) {
          const randomRadius = a.radius * (0.8 + Math.random() * 0.4)
          const x = a.x + randomRadius * Math.cos(angle * i)
          const y = a.y + randomRadius * Math.sin(angle * i)
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        ctx.closePath()
        ctx.stroke()

        // Añadir un brillo interior sutil
        ctx.fillStyle = a.color.replace('rgb', 'rgba').replace(')', ', 0.1)')
        ctx.fill()
      })

      // Draw particles with rotation
      gameState.particles.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life
        
        ctx.beginPath()
        ctx.rect(-p.size/2, -p.size/2, p.size, p.size)
        ctx.fill()
        
        ctx.restore()
      })
      
      // Draw power-ups
      gameState.powerUps.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        
        ctx.shadowBlur = 15
        ctx.shadowColor = p.type === 'rapidFire' ? '#ff0' :
                         p.type === 'tripleShot' ? '#0ff' :
                         p.type === 'shield' ? '#0f0' : '#f0f'
        
        ctx.strokeStyle = ctx.shadowColor
        ctx.lineWidth = 2
        
        // Dibujar un hexágono giratorio
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6
          const x = Math.cos(angle) * p.radius
          const y = Math.sin(angle) * p.radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
        
        ctx.restore()
      })
      
      // Draw shield if active
      if (shieldHealth > 0) {
        ctx.shadowBlur = 20
        ctx.shadowColor = `rgba(0, 255, 0, ${shieldHealth/3})`
        ctx.strokeStyle = `rgba(0, 255, 0, ${shieldHealth/3})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(ship.x, ship.y, 25, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      ctx.globalAlpha = 1
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
  }, [gameStarted, currentBulletColor, gameOver, activePowerUps, shieldHealth, combo, multiplier])

  return (
    <div className="h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
          <div className="bg-black/90 p-8 rounded-lg border border-white/10 max-w-md text-white space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent text-center">RGB Asteroids</h2>
            <div className="space-y-4 text-sm opacity-80">
              <p className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>Match bullet colors with asteroids to destroy them</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span>Collect power-ups to enhance your abilities</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <span>Build combos to increase your score multiplier</span>
              </p>
              <div className="border-t border-white/10 my-4" />
              <div className="space-y-2">
                <p className="flex items-center gap-3">
                  <span className="text-2xl">💫</span>
                  <span>WASD or Arrow Keys to move</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">💥</span>
                  <span>SPACE to shoot</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <span>1, 2, 3 to change bullet color (RGB)</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.setItem('tutorialShown', 'true')
                setShowTutorial(false)
              }}
              className="bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white px-4 py-2 rounded-lg w-full font-bold text-base hover:opacity-90 transition-opacity"
            >
              Let&apos;s Play!
            </button>
          </div>
        </div>
      )}
      <div className="w-full h-full max-w-screen-xl mx-auto flex flex-col items-center justify-start pt-4">
        {!gameStarted ? (
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent mb-2">RGB Asteroids</h1>
            <button
              onClick={() => setGameStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-white/10"
            >
              START GAME
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="text-white/60 hover:text-white transition-colors mt-4"
            >
              Show Tutorial
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
              className="border border-white/10 bg-black mx-auto rounded-lg shadow-lg shadow-white/5"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '80vh'
              }}
            />
            <div className="absolute top-2 right-2 space-y-2">
              {/* Score and Multiplier Panel */}
              <div className="bg-black/40 backdrop-blur-sm p-3 rounded-lg border border-white/10 space-y-1">
                <div className="text-2xl text-white font-mono font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
                  {score.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-white/60 font-mono">MULTIPLIER</div>
                  <div className="text-lg text-white font-mono font-bold">{multiplier}x</div>
                </div>
                {combo > 1 && (
                  <div className="text-lg font-mono animate-pulse bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-bold">
                    {combo} COMBO!
                  </div>
                )}
                {/* Combo Progress Bar */}
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300" 
                    style={{ width: `${(combo % 5) * 20}%` }}
                  />
                </div>
              </div>

              {/* Current Color Panel */}
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-white/60 font-mono text-sm">ACTIVE COLOR</span>
                  <div 
                    className="w-6 h-6 rounded-full shadow-lg animate-pulse" 
                    style={{ 
                      backgroundColor: currentBulletColor,
                      boxShadow: `0 0 15px ${currentBulletColor}`
                    }}
                  />
                </div>
              </div>

              {/* Power-ups Panel */}
              {activePowerUps.length > 0 && (
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10 space-y-3">
                  <div className="text-white/60 font-mono text-sm">ACTIVE POWER-UPS</div>
                  <div className="flex flex-wrap gap-2">
                    {activePowerUps.map((powerUp, index) => {
                      const powerUpConfig = {
                        rapidFire: { color: '#ff0', icon: '⚡' },
                        tripleShot: { color: '#0ff', icon: '🌀' },
                        shield: { color: '#0f0', icon: '🛡' },
                        chaosMode: { color: '#f0f', icon: '🌈' }
                      }[powerUp]
                      
                      return (
                        <div 
                          key={`${powerUp}-${index}`}
                          className="px-3 py-2 rounded-lg text-sm font-mono flex items-center gap-2 animate-pulse"
                          style={{
                            backgroundColor: `${powerUpConfig.color}20`,
                            border: `1px solid ${powerUpConfig.color}40`,
                            color: powerUpConfig.color,
                            textShadow: `0 0 5px ${powerUpConfig.color}`
                          }}
                        >
                          <span>{powerUpConfig.icon}</span>
                          <span>{powerUp}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
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
