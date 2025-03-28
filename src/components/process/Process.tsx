'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Define phases data outside the component for better performance and readability
const phases = [
  {
    title: 'DISCOVER',
    description: 'Initial phase where we understand your project, analyze the market, and define the path forward.',
    milestones: [
      { name: 'Kickoff meeting', icon: '🏁' },
      { name: 'Brand & Digital audit', icon: '🏆' },
      { name: 'Co-Design Workshop', icon: '▶️' },
      { name: 'Trend & Competitor Analysis', icon: '🔎' }
    ],
    image: '/images/process/discover.jpg'
  },
  {
    title: 'FOCUS',
    description: 'We define the strategic direction and visual approach that will guide the entire project.',
    milestones: [
      { name: 'Moodboards', icon: '📋' },
      { name: 'Brand Strategy', icon: '👤' },
      { name: 'Conceptualization', icon: '💥' }
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
      { name: 'Prototyping', icon: '👥' }
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
  },
]

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineTop, setLineTop] = useState("0px")
  const [lineHeight, setLineHeight] = useState("0px")

  // Calcular la posición y altura exactas de la línea después del montaje y en resize
  useEffect(() => {
    const calculateLineGeometry = () => {
      if (containerRef.current) {
        const timelineContainer = containerRef.current
        const firstNode = timelineContainer.querySelector('.timeline-nodes:first-child .timeline-node-element') as HTMLElement | null
        const lastNode = timelineContainer.querySelector('.timeline-nodes:last-child .timeline-node-element') as HTMLElement | null

        if (firstNode && lastNode) {
          const containerRect = timelineContainer.getBoundingClientRect()
          // Usar scrollY para compensar el scroll de la página al calcular posiciones relativas
          const scrollTop = window.scrollY || document.documentElement.scrollTop; 
          const firstNodeRect = firstNode.getBoundingClientRect()
          const lastNodeRect = lastNode.getBoundingClientRect()

          // Calcular el centro vertical de los nodos relativo al contenedor, ajustado por scroll
          const firstNodeCenterY = (firstNodeRect.top + scrollTop - (containerRect.top + scrollTop)) + (firstNodeRect.height / 2)
          const lastNodeCenterY = (lastNodeRect.top + scrollTop - (containerRect.top + scrollTop)) + (lastNodeRect.height / 2)

          setLineTop(`${firstNodeCenterY}px`)
          setLineHeight(`${lastNodeCenterY - firstNodeCenterY}px`)
        }
      }
    };

    // Calcular al montar
    calculateLineGeometry();

    // Añadir listener para recalcular en resize
    window.addEventListener('resize', calculateLineGeometry);

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', calculateLineGeometry);
    };
  }, []) // Dependencia vacía para ejecutar solo una vez al montar y configurar listeners

  // Hook useScroll para seguir el progreso del scroll dentro del contenedor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"] // Inicia cuando el top del contenedor llega al centro, termina cuando el bottom llega al final
  })

  // Hook useTransform para mapear el progreso del scroll (0 a 1) a la escala Y de la línea (0 a 1)
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-32 md:py-40 bg-black">
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
        {/* Central Line - Posicionada y dimensionada, animada con scroll */}
        <motion.div 
          className="absolute left-1/2 w-px bg-gradient-to-b from-red-500 via-green-500 to-blue-500 origin-top"
          style={{ 
            top: lineTop,      // Posición inicial calculada
            height: lineHeight, // Altura total calculada
            scaleY             // Escala animada por scroll
          }}
         />

        {/* Process Phases */}
        <div className="relative space-y-24 md:space-y-36 lg:space-y-48"> {/* Espaciado responsivo */}
          {phases.map((phase, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={phase.title}
                className={`timeline-nodes flex flex-col md:flex-row items-center gap-8 md:gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Content */}
                 <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                   <motion.div
                     className="bg-white/5 rounded-lg p-4 sm:p-6 md:p-8 hover:bg-white/10 transition-all duration-300" // Padding responsivo
                     whileHover={{ scale: 1.02 }}
                    >
                      <h3 
                       className="text-3xl md:text-4xl text-white mb-4" // Tamaño de fuente responsivo
                       style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                     >
                      {phase.title}
                     </h3>
                     <p 
                       className="text-sm md:text-base text-white/60 mb-6" // Tamaño de fuente responsivo
                       style={{ fontFamily: 'var(--font-geist-mono)' }}
                     >
                      {phase.description}
                    </p>
                     
                     {/* Milestones */}
                     <div className={`space-y-3 flex flex-col items-start ${isEven ? 'md:items-end' : 'md:items-start'}`}> {/* Alineación móvil a start */}
                       {phase.milestones.map((milestone) => (
                         <motion.div 
                           key={milestone.name}
                          className={`flex items-center gap-3 text-white/80 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
                          whileHover={{ x: isEven ? -5 : 5 }}
                        >
                          <span className="text-xl" role="img" aria-label={milestone.name}>{milestone.icon}</span>
                           <span 
                             style={{ fontFamily: 'var(--font-geist-mono)' }}
                             className="text-xs sm:text-sm" // Tamaño de fuente responsivo
                           >
                             {milestone.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
 
                 {/* Timeline Node - Use a dedicated class for easier selection in useEffect */}
                 <div
                   aria-hidden="true"
                   className={`timeline-node-element w-6 h-6 rounded-full absolute left-1/2 -translate-x-1/2 ${
                     index === 0 ? 'bg-red-500' : 
                     index === 1 ? 'bg-green-500' : 
                     index === 2 ? 'bg-blue-500' : 
                     'bg-white' // Default or last phase color
                   }`}
                 />
              </motion.div>
            )
          })}
        </div>
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
           className="text-2xl md:text-3xl text-white mb-8" // Tamaño de fuente responsivo
           style={{ fontFamily: 'var(--font-druk-text-wide)' }}
         >
          Ready to Start Your Project?
         </h2>
         <motion.a 
           href="/pricing" 
           className="inline-block bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-white/90 transition-all duration-300" // Padding responsivo
           style={{ fontFamily: 'var(--font-geist-mono)' }}
           whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          GET STARTED
        </motion.a>
      </motion.div>
    </div>
  )
}
