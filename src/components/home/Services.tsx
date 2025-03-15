'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { AnimationSettings } from '@/hooks/useServices'

interface ServiceItem {
  title: string;
  image: string;
  description: string;
  items: string[];
}

export interface ServicesProps {
  services: ServiceItem[];
  animationSettings: AnimationSettings;
}

export function Services({ services, animationSettings }: ServicesProps) {
  // Extraer configuraciones de animación
  const { titleAnimation, serviceCardAnimation, linkAnimation } = animationSettings;
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>

      <div className="px-6">
        <motion.div 
          initial={titleAnimation.initial}
          animate={titleAnimation.animate}
          transition={titleAnimation.transition}
          className="max-w-2xl mx-auto text-center mb-12 px-4"
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            CORE SERVICES
          </h2>
          <p 
            className="text-base md:text-lg text-white/90 max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            EVERYTHING YOU NEED TO BUILD A SUCCESSFUL BRAND
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-4 gap-2 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={serviceCardAnimation.initial}
              animate={serviceCardAnimation.animate}
              transition={{ 
                ...serviceCardAnimation.transition,
                delay: index * 0.1
              }}
              className="group relative bg-black p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-[380px] flex flex-col"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <h3 
                className="text-xl mb-4 text-white"
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                {service.title}
              </h3>
              <div className="h-[100px] flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <Image 
                  src={service.image} 
                  alt={service.title}
                  width={100}
                  height={100}
                  className="h-full w-auto object-contain"
                />
              </div>
              <p 
                className="text-white/90 mb-4 text-sm"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {service.description}
              </p>
              <ul className="space-y-3 mt-auto">
                {service.items.map((item) => (
                  <li 
                    key={item} 
                    className="flex items-center text-white/90 font-mono text-sm tracking-tight group-hover:text-white transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5 text-primary mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={linkAnimation.initial}
          whileInView={linkAnimation.whileInView}
          transition={linkAnimation.transition}
          className="text-center px-4"
        >
          <Link 
            href="/services" 
            className="inline-flex items-center text-[#00ff00] hover:text-white transition-colors font-mono text-lg"
          >
            View All Services →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
