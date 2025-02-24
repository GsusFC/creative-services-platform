'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

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
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <div className="text-center mb-24">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl text-white mb-8"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          Our Process
        </h1>
        <p 
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          We follow a structured yet flexible creative process that ensures high-quality results while maintaining clear communication and collaboration throughout the project.
        </p>
      </div>

      {/* Process Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={phase.image}
                alt={phase.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 
                className="text-3xl text-white mb-4"
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
              <div className="space-y-3">
                {phase.milestones.map((milestone, idx) => (
                  <div 
                    key={milestone.name}
                    className="flex items-center space-x-3 text-white/80"
                  >
                    <span className="text-xl">{milestone.icon}</span>
                    <span 
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                      className="text-sm"
                    >
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-24">
        <h2 
          className="text-3xl text-white mb-8"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          Ready to Start Your Project?
        </h2>
        <a 
          href="/pricing" 
          className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all duration-300"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          GET STARTED
        </a>
      </div>
    </div>
  )
}
