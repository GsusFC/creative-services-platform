import { NotionService } from '@/lib/notion/service'
import { Suspense } from 'react'
import Link from 'next/link'
import ProjectsList from './projects-list'

import './styles/typography.css'
import './styles/components.css'
import './styles/reset.css'

// Componente para mostrar durante la carga
function ProjectsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="max-w-[420px] w-full mx-auto">
          {/* Esqueleto de la imagen cuadrada */}
          <div className="aspect-square bg-white/5 animate-pulse mb-6"></div>
          
          {/* Esqueleto para nombre de empresa y descripción */}
          <div className="space-y-3">
            <div className="h-7 bg-white/10 w-1/2 animate-pulse rounded"></div>
            <div className="h-14 bg-white/5 animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente servidor para obtener los datos
async function ProjectsDataFetcher() {
  const notionService = new NotionService();
  const projects = await notionService.getAllCaseStudies();
  
  console.log('All projects:', projects.map(p => ({ title: p.title, status: p.status })));
  
  // Filtrar solo los proyectos con estado "Listo" en Notion
  const publishedProjects = projects.filter(project => project.status === 'published' && project.synced);
  
  console.log('Published projects:', publishedProjects.map(p => ({ title: p.title, status: p.status, synced: p.synced })));
  
  if (publishedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/60">
        <p className="text-xl mb-4">No hay proyectos publicados todavía</p>
        <Link 
          href="/admin/case-studies/new" 
          className="px-4 py-2 bg-[#00ff00] text-black font-medium rounded hover:bg-[#00cc00] transition-colors"
        >
          Crear Proyecto
        </Link>
      </div>
    );
  }

  return <ProjectsList projects={publishedProjects} />;
}

// Componente principal de la página
export default function CasesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pt-32 pb-12 md:pt-40">
        {/* Cabecera con solo WORK en Druk Wide a ancho completo */}
        <div className="px-4 mb-16 md:mb-24 overflow-hidden">
          <h1 className="font-druk force-druk text-white uppercase leading-none tracking-tight w-full" style={{ fontSize: '15vw' }}>
            WORK
          </h1>
        </div>
        
        {/* Projects Grid with Suspense */}
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsDataFetcher />
        </Suspense>
      </div>
    </main>
  )
}
