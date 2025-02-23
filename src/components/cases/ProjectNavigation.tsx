'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  previousProject?: {
    title: string
    slug: string
    image: string
    color?: string
  }
  nextProject?: {
    title: string
    slug: string
    image: string
    color?: string
  }
}

export function ProjectNavigation({ previousProject, nextProject }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
      {previousProject && (
        <Link href={`/cases/${previousProject.slug}`}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="group relative aspect-[16/9] overflow-hidden rounded-lg"
          >
            <Image
              src={previousProject.image}
              alt={previousProject.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-0" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p className="text-white/60 font-mono text-sm uppercase tracking-wider mb-2">
                Previous Project
              </p>
              <p 
                className="text-white text-xl font-druk"
                style={{ color: previousProject.color }}
              >
                {previousProject.title}
              </p>
            </div>
          </motion.div>
        </Link>
      )}
      
      {nextProject && (
        <Link href={`/cases/${nextProject.slug}`}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="group relative aspect-[16/9] overflow-hidden rounded-lg"
          >
            <Image
              src={nextProject.image}
              alt={nextProject.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-0" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p className="text-white/60 font-mono text-sm uppercase tracking-wider mb-2">
                Next Project
              </p>
              <p 
                className="text-white text-xl font-druk"
                style={{ color: nextProject.color }}
              >
                {nextProject.title}
              </p>
            </div>
          </motion.div>
        </Link>
      )}
    </div>
  )
}
