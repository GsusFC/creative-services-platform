'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { caseStudiesService } from '@/lib/cms/case-studies-service'
import { CaseStudyListItem } from '@/lib/cms/case-studies-service'

function ProjectCard({ project }: { project: CaseStudyListItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col"
    >
      {/* Card con solo la imagen */}
      <Link href={`/cases/${project.slug}`} className="block w-full overflow-hidden">
        <div className="relative aspect-square bg-neutral-900 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Texto debajo de la card */}
      <div className="mt-4 space-y-1">
        <h3 className="text-xl font-druk text-white group-hover:text-[#00ff00] transition-colors">
          {project.title}
        </h3>
        <p className="text-white/70 text-sm">{project.description}</p>
      </div>
    </motion.div>
  )
}

export default function CasesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        setLoading(true);
        
        // Utilizamos nuestro servicio CMS para obtener los datos
        const response = await caseStudiesService.getAllCaseStudies();
        setCaseStudies(response.items);
        
      } catch (error) {
        console.error('Error al cargar los Case Studies:', error);
        setError('No se pudieron cargar los Case Studies.');
        toast.error('Error al cargar los Case Studies');
        
        // Intentamos cargar desde la API antigua como fallback
        try {
          const response = await fetch('/api/case-studies');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setCaseStudies(data.caseStudies);
              setError(null);
            }
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadCaseStudies();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full pt-32 pb-16">
        <div className="reduced-container mb-16">
          <div className="grid-layout">
            <div className="title-section">
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-druk uppercase mb-8">WORK</h1>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#00ff00]" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-md"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="w-full mx-auto px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {caseStudies.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
