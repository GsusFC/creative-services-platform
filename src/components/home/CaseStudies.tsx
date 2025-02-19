'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

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

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link 
              href={project.link}
              key={project.title}
            >
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group relative bg-black border border-white/20 hover:border-white/40 transition-all duration-300 h-[420px] flex flex-col"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300 z-10" />
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span 
                    className="text-sm text-white/75"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {project.category}
                  </span>
                  <h3 
                    className="text-xl mt-1 mb-2 text-white"
                    style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                  >
                    {project.title}
                  </h3>
                  <p 
                    className="text-sm text-white/75"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {project.description}
                  </p>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

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
            className="text-sm font-mono text-white hover:text-white/75 dark:hover:text-gray-400 transition-colors inline-flex items-center gap-2"
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
