'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { featuredProjects } from '@/data/projects';

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = featuredProjects.find((p) => p.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white pt-[120px] pb-20"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
        >
          <div>
            <div className="space-y-8">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                {project.title}
              </h1>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 uppercase text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    Client
                  </span>
                  <span className="text-white uppercase text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {project.client || project.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white/60 uppercase text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    Year
                  </span>
                  <span className="text-white uppercase text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {project.year}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white/60 uppercase text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    Category
                  </span>
                  <span className="text-white uppercase text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {project.category}
                  </span>
                </div>
              </div>

              <p className="text-lg text-white/80">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1.5 text-xs uppercase tracking-wider"
                    style={{ 
                      fontFamily: 'var(--font-geist-mono)',
                      backgroundColor: project.color + '20',
                      color: project.color
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Challenge & Solution */}
        {(project.challenge || project.solution) && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
          >
            {project.challenge && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
                  CHALLENGE
                </h2>
                <p className="text-white/80">{project.challenge}</p>
              </div>
            )}
            {project.solution && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
                  SOLUTION
                </h2>
                <p className="text-white/80">{project.solution}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        {project.results && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-24"
          >
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              RESULTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.results.map((result, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: project.color + '10' }}
                >
                  <p className="text-white/80">{result}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery */}
        {project.gallery && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
          >
            {project.gallery.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src={item.url}
                    alt={item.caption || project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.caption && (
                  <p className="text-sm text-white/60 text-center">{item.caption}</p>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Testimonial */}
        {project.testimonial && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="max-w-3xl mx-auto text-center mb-24"
          >
            <blockquote className="text-2xl italic mb-6">“{project.testimonial.quote}”</blockquote>
            <cite className="not-italic">
              <div className="font-bold">{project.testimonial.author}</div>
              <div className="text-white/60">{project.testimonial.role}</div>
            </cite>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-between items-center"
        >
          <Link 
            href="/cases" 
            className="text-sm uppercase tracking-wider hover:text-[#00ff00] transition-colors"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ← All Cases
          </Link>

          {project.nextProject && (
            <Link 
              href={`/cases/${project.nextProject.slug}`}
              className="text-sm uppercase tracking-wider hover:text-[#00ff00] transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Next Case →
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

