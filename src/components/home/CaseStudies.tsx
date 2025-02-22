'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { featuredProjects } from '@/data/projects'

export function CaseStudies() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const projects = featuredProjects.slice(0, 3)

  return (
    <div className="relative bg-black">
      <motion.div 
        ref={containerRef}
        style={{ y, opacity }}
        className="py-24 overflow-visible relative"
      >
        <div className="px-6">
          <div className="flex items-center justify-between mb-24">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-6xl font-druk text-white"
            >
              Selected Work
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="hidden md:block"
            >
              <Link 
                href="/cases"
                className="text-[#00ff00] hover:text-white transition-colors font-mono text-lg"
              >
                View All Projects →
              </Link>
            </motion.div>
          </div>

          <div className="relative">
            <div className="relative z-20">
              {projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-24 last:mb-0"
                >
                  <Link 
                    href={`/cases/${project.slug}`}
                    className="group block"
                  >
                    <div className="space-y-4">
                      <p className="text-sm text-[#00ff00] font-mono tracking-wider">{project.category}</p>
                      <h3 className="text-4xl md:text-6xl xl:text-7xl font-druk text-white group-hover:text-[#00ff00] transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-24 text-center md:hidden"
          >
            <Link 
              href="/cases"
              className="inline-block text-[#00ff00] hover:text-white transition-colors font-mono"
            >
              View All Projects →
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
