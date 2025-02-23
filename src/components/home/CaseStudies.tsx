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

  const projects = featuredProjects.slice(0, 4)

  return (
    <div className="relative bg-black">
      <motion.div 
        ref={containerRef}
        style={{ y, opacity }}
        className="py-12 overflow-hidden relative"
      >
        {/* Arrow Column */}
        <div className="absolute left-0 top-0 h-full w-[120px] hidden md:block bg-[#00ff00] overflow-hidden">
          <motion.div 
            className="absolute inset-0 flex flex-col items-center"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              repeatType: "loop"
            }}
          >
            {Array(60).fill(null).map((_, i) => (
              <div 
                key={i} 
                className="w-[120px] h-[120px] -mt-[1px] -mb-[1px] flex-shrink-0"
              >
                <img src="/assets/icons/arrow.svg" alt="Arrow down" className="w-full h-full" />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="px-6 md:pl-[140px]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex gap-1">
              {Array(5).fill(null).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#00ff00]" />
              ))}
            </div>
            <p 
              className="text-[#00ff00] text-lg tracking-wider uppercase" 
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Selected Work
            </p>
          </motion.div>

          <div className="relative">
            <div className="relative z-20">
              {projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="last:mb-0"
                >
                  <Link 
                    href={`/cases/${project.slug}`}
                    className="group block"
                  >
                    <div className="border-t border-white/10 py-6 group-hover:bg-white/5 transition-colors">
                      <div className="flex gap-2">
                        <div className="w-[40px] flex-shrink-0">
                          <p 
                            className="text-sm text-[#00ff00] tracking-wider uppercase" 
                            style={{ fontFamily: 'var(--font-geist-mono)' }}
                          >
                            C{String(index + 1).padStart(2, '0')}
                          </p>
                        </div>
                        <div className="flex-1 space-y-6">
                          <h3 className="text-6xl md:text-8xl xl:text-9xl font-druk text-white group-hover:text-[#00ff00] transition-colors leading-[0.85] uppercase">
                            {project.title}
                          </h3>
                          <p 
                            className="text-white/60 text-lg max-w-3xl" 
                            style={{ fontFamily: 'var(--font-geist-mono)' }}
                          >
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-6 text-right px-4"
          >
            <Link 
              href="/cases"
              className="inline-block text-white/60 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              VIEW ALL PROJECTS
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
