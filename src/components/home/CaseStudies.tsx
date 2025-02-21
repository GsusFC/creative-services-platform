'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

const projects = [
  {
    title: 'ADIDAS ORIGINALS',
    category: 'BRAND CAMPAIGN',
    description: 'Digital campaign for new collection launch',
    image: '/projects/adidas.svg',
    slug: 'adidas-originals',
    color: 'rgb(255, 0, 0)' // Red
  },
  {
    title: 'NIKE ACG',
    category: 'DIGITAL PRODUCT',
    description: 'E-commerce experience for outdoor gear',
    image: '/projects/nike.svg',
    slug: 'nike-acg',
    color: 'rgb(0, 255, 0)' // Green
  },
  {
    title: 'SPOTIFY WRAPPED',
    category: 'CREATIVE DIRECTION',
    description: 'Visual system for annual music campaign',
    image: '/projects/spotify.svg',
    slug: 'spotify-wrapped',
    color: 'rgb(0, 0, 255)' // Blue
  },
  {
    title: 'SUPREME SS24',
    category: 'ART DIRECTION',
    description: 'Visual identity for seasonal collection',
    image: '/projects/supreme.svg',
    slug: 'supreme-ss24',
    color: 'rgb(255, 0, 0)' // Red
  },
  {
    title: 'APPLE VISION PRO',
    category: 'MOTION DESIGN',
    description: 'Product launch animations and visuals',
    image: '/projects/apple.svg',
    slug: 'apple-vision',
    color: 'rgb(0, 255, 0)' // Green
  },
  {
    title: 'OFF-WHITE',
    category: 'BRAND DESIGN',
    description: 'Digital brand system and guidelines',
    image: '/projects/offwhite.svg',
    slug: 'off-white',
    color: 'rgb(0, 0, 255)' // Blue
  }
]

export function CaseStudies() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <motion.section 
      ref={containerRef}
      style={{ opacity }}
      className="py-24 bg-black relative overflow-hidden"
    >
      {/* Background Grid with RGB Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent" />
        {hoveredIndex !== null && (
          <motion.div 
            className="absolute inset-0 opacity-30 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at center, ${projects[hoveredIndex].color}40 0%, transparent 70%)`
            }}
          />
        )}
      </div>
      
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            FEATURED PROJECTS
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg text-white/75 max-w-xl mx-auto uppercase"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            LATEST STRATEGY, BRANDING AND PRODUCT DESIGN PROJECTS
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ scale }}
        >
          {projects.map((project, index) => (
            <Link href={`/cases/${project.slug}`} key={index}>
              <motion.div
                className="relative group overflow-hidden cursor-pointer"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className="relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                    priority={index === 0}
                  />
                  
                  {/* RGB Overlay */}
                  <motion.div 
                    className="absolute inset-0 mix-blend-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      background: `linear-gradient(45deg, ${project.color}40, transparent)`
                    }}
                  />

                  {/* Content Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3 
                      className="text-xl text-white mb-2 uppercase"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {project.title}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-white/75"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {project.description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-center mt-12"
        >
          <Link 
            href="/cases"
            className="text-sm text-white hover:text-white/75 transition-colors inline-flex items-center gap-2 group"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            VIEW ALL PROJECTS
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
