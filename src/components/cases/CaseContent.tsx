'use client';

import { motion } from 'framer-motion';
import { ProjectMetrics } from './ProjectMetrics';
import { ProjectGallery } from './ProjectGallery';
import { ProjectLinks } from './ProjectLinks';
import { Project } from '@/types/projects';

interface CaseContentProps {
  project: Project;
}

export function CaseContent({ project }: CaseContentProps) {
  return (
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
          <ProjectLinks links={project.links} />
        </motion.div>
      )}
    </div>
  );
}
