import { CaseStudy } from '@/types/case-study'
import { getAllCaseStudies } from '@/lib/case-studies/service'
import { Suspense } from 'react'
import ProjectsList from './projects-list'

// Componente para mostrar durante la carga
function ProjectsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="relative aspect-square bg-white/5 animate-pulse">
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="h-4 bg-white/10 w-16 rounded"></div>
            <div className="h-10 bg-white/10 w-full rounded"></div>
            <div className="h-4 bg-white/10 w-full rounded mt-4"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-12 bg-white/10 rounded"></div>
              <div className="h-6 w-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente servidor para obtener los datos
async function ProjectsDataFetcher() {
  const projects = await getAllCaseStudies();
  
  // Filtrar solo los proyectos publicados
  const publishedProjects = projects.filter(p => p.status === 'published');
  
  if (publishedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/60">
        <p className="text-xl mb-4">No hay proyectos publicados todavía</p>
        <a 
          href="/admin/case-studies/new" 
          className="px-4 py-2 bg-[#00ff00] text-black font-medium rounded hover:bg-[#00cc00] transition-colors"
        >
          Crear Proyecto
        </a>
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
        <div className="px-6 mb-16">
          <h1 
            className="text-6xl md:text-8xl font-druk text-white uppercase mb-4" 
          >
            Projects
          </h1>
          <p 
            className="text-[#00ff00] text-lg tracking-wider uppercase" 
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Selected Work
          </p>
        </div>
        
        {/* Projects Grid with Suspense */}
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsDataFetcher />
        </Suspense>
      </div>
    </main>
  )
}
