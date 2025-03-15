import { getAllCaseStudies } from '@/lib/case-studies/service'
import { Suspense } from 'react'
import ProjectsList from './projects-list'

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
        {/* Cabecera con solo WORK en Druk Wide a ancho completo */}
        <div className="px-4 mb-16 md:mb-24 overflow-hidden">
          <h1 className="font-druk text-white uppercase leading-none tracking-tight w-full" style={{ fontSize: '15vw' }}>
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
