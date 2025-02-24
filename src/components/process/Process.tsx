'use client'

import React, { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'

const phases = [
  {
    title: 'DISCOVER',
    description: 'Initial phase where we understand your project, analyze the market, and define the path forward.',
    milestones: [
      { name: 'Kickoff meeting', icon: '🏁' },
      { name: 'Brand & Digital audit', icon: '🏆' },
      { name: 'Co-Design Workshop', icon: '▶️' },
      { name: 'Análisis de tendencias y competencia', icon: '🔎' }
    ],
    image: '/images/process/discover.jpg'
  },
  {
    title: 'FOCUS',
    description: 'We define the strategic direction and visual approach that will guide the entire project.',
    milestones: [
      { name: 'Moodboards', icon: '📋' },
      { name: 'Brand Strategy', icon: '👤' },
      { name: 'Conceptualización', icon: '💥' }
    ],
    image: '/images/process/focus.jpg'
  },
  {
    title: 'BUILD',
    description: 'The execution phase where we create and refine all the project deliverables.',
    milestones: [
      { name: 'Brand Identity', icon: '🖤' },
      { name: 'Wireframing', icon: '✏️' },
      { name: 'UI Design', icon: '🎨' },
      { name: 'Prototipado', icon: '👥' }
    ],
    image: '/images/process/build.jpg'
  },
  {
    title: 'SYNC',
    description: 'Final phase focused on documentation and knowledge transfer to ensure successful implementation.',
    milestones: [
      { name: 'Brand Center', icon: '🎯' }
    ],
    image: '/images/process/sync.jpg'
  }
]

export function Process() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="text-center py-32 md:py-40">
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl text-white mb-8"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Process
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto px-4"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We follow a structured yet flexible creative process that ensures high-quality results while maintaining clear communication and collaboration throughout the project.
        </motion.p>
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="relative container mx-auto px-4 py-24">
        {/* Central Line */}
        <motion.div 
          className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-red-500 via-green-500 to-blue-500 origin-top"
          style={{ 
            height: '100%',
            scaleY: scrollYProgress
          }}
        />

        {/* Process Phases */}
        <div className="relative space-y-48">
          {phases.map((phase, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={phase.title}
                className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Content */}
                <div className={`w-1/2 ${isEven ? 'text-right' : 'text-left'}`}>
                  <motion.div
                    className="bg-white/5 rounded-lg p-8 hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 
                      className="text-4xl text-white mb-4"
                      style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                    >
                      {phase.title}
                    </h3>
                    <p 
                      className="text-white/60 mb-6"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {phase.description}
                    </p>
                    
                    {/* Milestones */}
                    <div className={`space-y-3 ${isEven ? 'items-end' : 'items-start'}`}>
                      {phase.milestones.map((milestone) => (
                        <motion.div 
                          key={milestone.name}
                          className={`flex items-center gap-3 text-white/80 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}
                          whileHover={{ x: isEven ? -5 : 5 }}
                        >
                          <span className="text-xl">{milestone.icon}</span>
                          <span 
                            style={{ fontFamily: 'var(--font-geist-mono)' }}
                            className="text-sm"
                          >
                            {milestone.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Timeline Node */}
                <motion.div 
                  className="w-6 h-6 rounded-full bg-white absolute left-1/2 -translate-x-1/2"
                  style={{
                    background: index === 0 ? '#ef4444' : 
                             index === 1 ? '#22c55e' :
                             index === 2 ? '#3b82f6' :
                             '#ffffff'
                  }}
                  whileHover={{ scale: 1.5 }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center py-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl text-white mb-8"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            Ready to Start Your Project?
          </h2>
          <motion.a 
            href="/pricing" 
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all duration-300"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GET STARTED
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}
