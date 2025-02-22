'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { featuredProjects } from '@/data/projects'

function ProjectCard({ project }: { project: typeof featuredProjects[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative aspect-[16/9] bg-neutral-900 overflow-hidden"
    >
      <Link href={`/case-studies/${project.slug}`} className="block h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
        
        {/* Project Image */}
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Project Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="space-y-2">
            <p className="text-sm text-[#00ff00] font-mono">{project.category}</p>
            <h3 className="text-2xl font-druk text-white">{project.title}</h3>
            <p className="text-white/80">{project.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-white/10 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-16">
        <h1 className="font-druk text-6xl mb-16">Case Studies</h1>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  )
}
