'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { featuredProjects } from '@/data/projects';
import { ProjectMetrics } from '@/components/cases/ProjectMetrics';
import { ProjectGallery } from '@/components/cases/ProjectGallery';
import { ProjectLinks } from '@/components/cases/ProjectLinks';
import { ProjectNavigation } from '@/components/cases/ProjectNavigation';
import { useRef } from 'react';

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = featuredProjects.find((p) => p.slug === params.slug);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <motion.div 
        ref={containerRef}
        style={{ opacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p 
              className="text-sm uppercase tracking-wider"
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                color: project.color 
              }}
            >
              {project.category}
            </p>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl text-white font-bold"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              {project.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {project.description}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Project Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
        >
          <div className="space-y-4">
            <h3 className="text-white/60 font-mono uppercase text-sm tracking-wider">Client</h3>
            <p className="text-white">{project.client}</p>
            {project.clientIndustry && (
              <p className="text-white/60">{project.clientIndustry}</p>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-white/60 font-mono uppercase text-sm tracking-wider">Services</h3>
            <div className="space-y-2">
              {project.services?.map(service => (
                <p key={service} className="text-white">{service}</p>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-white/60 font-mono uppercase text-sm tracking-wider">Team</h3>
            <div className="space-y-2">
              {project.team?.map(member => (
                <p key={member} className="text-white">{member}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Challenge & Solution */}
        {(project.challenge || project.solution) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
          >
            {project.challenge && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
                  Challenge
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">{project.challenge}</p>
              </div>
            )}
            {project.solution && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
                  Solution
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">{project.solution}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Approach */}
        {project.approach && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              Approach
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">{project.approach}</p>
          </motion.div>
        )}

        {/* Metrics */}
        {project.metrics && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-2xl font-bold text-white mb-12" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              Results
            </h2>
            <ProjectMetrics metrics={project.metrics} color={project.color} />
          </motion.div>
        )}

        {/* Gallery */}
        {project.gallery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-2xl font-bold text-white mb-12" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              Gallery
            </h2>
            <ProjectGallery images={project.gallery} />
          </motion.div>
        )}

        {/* Links */}
        {project.links && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-2xl font-bold text-white mb-12" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              Links
            </h2>
            <ProjectLinks links={project.links} color={project.color} />
          </motion.div>
        )}

        {/* Testimonial */}
        {project.testimonial && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 max-w-3xl mx-auto text-center"
          >
            <blockquote className="text-3xl text-white italic mb-8">"{project.testimonial.quote}"</blockquote>
            <div className="flex items-center justify-center space-x-4">
              {project.testimonial.image && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={project.testimonial.image}
                    alt={project.testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <cite className="not-italic text-left">
                <div className="text-white font-bold">{project.testimonial.author}</div>
                <div className="text-white/60">{project.testimonial.role}</div>
                {project.testimonial.company && (
                  <div className="text-white/60">{project.testimonial.company}</div>
                )}
              </cite>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <ProjectNavigation
          previousProject={project.previousProject}
          nextProject={project.nextProject}
        />
      </div>
    </div>
  );
}

