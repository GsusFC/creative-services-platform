import { notFound } from 'next/navigation';
import { featuredProjects } from '@/data/projects';
import { CaseHero } from '@/components/cases/CaseHero';
import { CaseContent } from '@/components/cases/CaseContent';
import { ProjectNavigation } from '@/components/cases/ProjectNavigation';

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = featuredProjects.find((p) => p.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <CaseHero
        title={project.title}
        category={project.category}
        description={project.description}
        image={project.image}
        color={project.color}
        heroVideo={project.heroVideo}
      />
      
      <CaseContent project={project} />

      <ProjectNavigation
        previousProject={project.previousProject}
        nextProject={project.nextProject}
      />
    </div>
  );
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
            <blockquote className="text-3xl text-white italic mb-8">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
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

