import { getCaseStudy } from '../actions'
import { ArrowLeftIcon } from 'lucide-react'
import { CaseStudy } from '@/types/case-study'
import Link from 'next/link'
import EditCaseStudyFormWrapper from '../../components/EditCaseStudyFormWrapper'

interface CaseStudyDetailProps {
  params: {
    id: string
  }
}

export default async function CaseStudyDetail({ params }: CaseStudyDetailProps) {
  let caseStudy: CaseStudy | null = null;
  let error: string | null = null;
  
  try {
    // Asegurarnos de que params sea asíncrono
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    if (!id) {
      throw new Error('ID no proporcionado');
    }
    
    caseStudy = await getCaseStudy(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error al cargar el estudio';
    console.error('Error al cargar el caso de estudio:', err);
  }
  
  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center space-x-4">
            <Link href="/admin/case-studies" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Volver a casos de estudio</span>
            </Link>
          </div>
          
          <div className="bg-red-900/50 border border-red-800 text-red-300 p-4 rounded-md">
            {error || 'No se encontró el estudio'}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center space-x-4">
          <Link href="/admin/case-studies" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Volver a casos de estudio</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Editar Case Study
        </h1>

        <EditCaseStudyFormWrapper caseStudy={caseStudy} />
      </div>
    </div>
  );
}
