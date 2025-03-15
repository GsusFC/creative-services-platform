'use client'

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/projects';
import { projectsConfig } from '@/config/projects';

interface ProjectWithId extends Project {
  id: string;
}

interface ProjectCardProps {
  project: ProjectWithId;
  animationDelay?: number;
  a11yLabel?: string;
}

const ProjectCard = memo(function ProjectCard({ 
  project, 
  animationDelay = 0,
  a11yLabel
}: ProjectCardProps) {
  const { card } = projectsConfig.animations;
  
  return (
    <motion.div
      initial={card.initial}
      animate={card.animate}
      transition={{
        ...card.transition,
        delay: animationDelay
      }}
      className="group relative aspect-[16/9] bg-neutral-900 overflow-hidden rounded-sm"
      aria-label={a11yLabel || `${projectsConfig.a11y.projectCard}: ${project.title}`}
    >
      <Link 
        href={`/cases/${project.slug}`} 
        className="block h-full focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-offset-2 focus:ring-offset-black"
        tabIndex={0}
        aria-label={`${projectsConfig.labels.viewProject}: ${project.title}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" aria-hidden="true" />
        
        {/* Project Image */}
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={`${project.title} - ${projectsConfig.a11y.projectImage}`}
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
            <div 
              className="flex flex-wrap gap-2 pt-2"
              aria-label={projectsConfig.a11y.projectTags}
            >
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
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
