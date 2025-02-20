'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const projects = [
  {
    title: 'NEBULA AI PLATFORM',
    category: 'DIGITAL PRODUCT',
    description: 'AI platform for predictive analytics',
    image: '/projects/nebula.svg',
    link: '/projects/nebula'
  },
  {
    title: 'QUANTUM FINANCE',
    category: 'BRANDING',
    description: 'Visual identity for next-gen fintech',
    image: '/projects/quantum.svg',
    link: '/projects/quantum'
  },
  {
    title: 'ECO LIVING',
    category: 'STRATEGY',
    description: 'Brand strategy for sustainability startup',
    image: '/projects/eco.svg',
    link: '/projects/eco'
  }
]

export function CaseStudies() {
  const [activeProject, setActiveProject] = useState(0);

  const handleNext = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden transition-all duration-300">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            FEATURED PROJECTS
          </h2>
          <p 
            className="text-base md:text-lg text-white/75 max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            LATEST STRATEGY, BRANDING AND PRODUCT DESIGN PROJECTS
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/cases/${project.link}`}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 
                      className="text-xl font-bold"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >{project.title}</h3>
                    <p 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >{project.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-center mt-12"
        >
          <Link 
            href="/proyectos"
            className="text-sm text-white hover:text-white/75 dark:hover:text-gray-400 transition-colors inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Ver todos los proyectos
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
