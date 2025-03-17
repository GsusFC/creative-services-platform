'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CaseStudy } from '@/types/case-study'

// Componente de tarjeta de proyecto (client component)
function ProjectCard({ project }: { project: CaseStudy }) {
  // Obtenemos la primera imagen de mediaItems, o una imagen por defecto si no hay
  const mainImage = project.mediaItems && project.mediaItems.length > 0 
    ? project.mediaItems.find(item => item.type === 'image')?.url || '/projects/quantum.svg'
    : '/projects/quantum.svg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group max-w-[420px] w-full mx-auto project-card"
    >
      <Link href={`/cases/${project.slug}`} className="block">
        {/* Project Image - Exactamente 420x420px */}
        <div className="aspect-square relative overflow-hidden mb-5 bg-gray-900/50">
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity duration-500"></div>
          <Image
            src={mainImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Project Info - Solo nombre de empresa en Druk y descripción corta */}
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-druk text-white uppercase leading-tight tracking-tight force-druk">
            {project.client}
          </h3>
          <p className="text-white/70 md:text-lg font-light">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

// Componente de cuadrícula de proyectos - 4 por fila en XL
export default function ProjectsList({ projects }: { projects: CaseStudy[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 px-6">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
