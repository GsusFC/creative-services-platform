'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { CaseStudy } from '@/types/case-study'
import { getFeaturedCaseStudies } from '@/lib/case-studies/service'

export function CaseStudies() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  
  const [featuredCases, setFeaturedCases] = useState<CaseStudy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true)
        const cases = await getFeaturedCaseStudies()
        setFeaturedCases(cases.filter(cs => cs.status === 'published').slice(0, 4))
      } catch (error) {
        console.error('Error al cargar los estudios de caso destacados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [])

  return (
    <div className="relative bg-black">
      <motion.div 
        ref={containerRef}
        style={{ y, opacity }}
        className="overflow-hidden relative"
      >
        {/* Arrow Column */}
        <div className="absolute left-0 top-0 h-full w-[120px] hidden md:block bg-[#00ff00] overflow-hidden">
          <motion.div 
            className="absolute inset-0 flex flex-col items-center gap-0"
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
                className="w-[120px] h-[120px] flex-shrink-0"
              >
                <Image 
                  src="/assets/icons/arrow.svg" 
                  alt="Arrow down" 
                  width={120}
                  height={120}
                  className="w-full h-full object-cover block" 
                />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="px-6 md:pl-[140px]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <p 
              className="text-[#00ff00] text-lg tracking-wider uppercase" 
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Selected Work
            </p>
            <Link 
              href="/cases"
              className="group inline-flex items-center gap-2 text-lg text-white/60 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              View All Projects
              <span className="text-[#ff0000] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </motion.div>

          <div className="relative">
            {isLoading ? (
              <div className="space-y-6 py-6">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="border-t border-white/10 py-6">
                    <div className="flex gap-2">
                      <div className="w-[40px] flex-shrink-0">
                        <div className="h-4 bg-white/10 animate-pulse w-full rounded"></div>
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="h-16 bg-white/10 animate-pulse w-3/4 rounded"></div>
                        <div className="h-4 bg-white/10 animate-pulse w-full rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredCases.length > 0 ? (
              <div className="relative z-20">
                {featuredCases.map((project, index) => (
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
                            <h3 className="text-6xl md:text-8xl xl:text-9xl font-druk text-white group-hover:text-[#ff0000] transition-colors leading-[0.85] uppercase">
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
            ) : (
              <div className="py-10 text-center">
                <p 
                  className="text-white/40 text-lg" 
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  No hay proyectos destacados disponibles.
                </p>
                <Link 
                  href="/admin/case-studies/new" 
                  className="mt-4 inline-block py-2 px-4 bg-[#00ff00] text-black font-medium rounded hover:bg-[#00cc00] transition-colors"
                >
                  Crear Proyecto
                </Link>
              </div>
            )}
          </div>


        </div>
      </motion.div>
    </div>
  )
}
