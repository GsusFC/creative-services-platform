'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, PlusCircle, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { CaseStudyCard } from '../components/notion/CaseStudyCard'
import { useNotionSync } from '../components/notion/useNotionSync'
import { useCaseStudyManager } from '@/hooks/useCaseStudyManager'
import { useRouter } from 'next/navigation'
import { CaseStudy } from '@/types/case-study'

export default function CaseStudiesAdmin() {
  const router = useRouter()
  const {
    syncStatus,
    pendingStudies,
    handleSyncSingle,
    handleSyncAll,
    error,
    setPendingStudies
  } = useNotionSync()

  const {
    studies: syncedStudies,
    addStudy,
    removeStudy,
    updateStudy,
    publishStudy,
    unpublishStudy,
    toggleFeatured
  } = useCaseStudyManager()

  const [notionSearch, setNotionSearch] = useState('')
  const [projectsSearch, setProjectsSearch] = useState('')

  // Filtrar estudios pendientes por búsqueda
  const filteredPendingStudies = pendingStudies.filter(study =>
    study.title.toLowerCase().includes(notionSearch.toLowerCase())
  )

  // Filtrar estudios sincronizados por búsqueda
  const filteredSyncedStudies = syncedStudies.filter(study =>
    study.title.toLowerCase().includes(projectsSearch.toLowerCase())
  )



  const handleMoveToSynced = async (study: CaseStudy) => {
    try {
      // Primero sincronizamos para tener la última versión
      await handleSyncSingle(study)
      
      // Añadir a estudios sincronizados
      addStudy(study)
      
      // Remover de pendientes
      setPendingStudies((prev: CaseStudy[]) => prev.filter((s: CaseStudy) => s.id !== study.id))
    } catch (error) {
      console.error('Error moving study to synced:', error)
    }
  }

  const handleEdit = (study: CaseStudy) => {
    console.log('Navegando a:', `/admin/case-studies/${study.id}`)
    router.push(`/admin/case-studies/${study.id}`)
  }

  const handleSaveEdit = async (updatedStudy: CaseStudy) => {
    try {
      updateStudy(updatedStudy)
    } catch (error) {
      console.error('Error saving case study:', error)
    }
  }

  // Efecto para sincronizar al cargar
  useEffect(() => {
    console.log('[Debug] CaseStudiesAdmin - Iniciando sincronización inicial')
    const initialSync = async () => {
      try {
        console.log('[Debug] CaseStudiesAdmin - Llamando a handleSyncAll')
        await handleSyncAll();
        console.log('[Debug] CaseStudiesAdmin - Sincronización completada')
      } catch (error) {
        console.error('[Debug] CaseStudiesAdmin - Error en sincronización inicial:', error);
      }
    };
    initialSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Omitimos handleSyncAll intencionalmente para evitar bucles

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 pt-[96px] bg-gray-950">
      {/* Mensaje de error */}
      {error && (
        <Alert variant="destructive" className="absolute top-6 right-6 w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Case Studies ({filteredSyncedStudies.length})
        </h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={handleSyncAll}
            disabled={syncStatus.state === 'syncing'}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus.state === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus.state === 'syncing' ? 'Syncing...' : 'Sync All'}
          </Button>
          <Button
            className="bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20 border-0"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
      </header>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search case studies..."
          value={projectsSearch}
          onChange={(e) => setProjectsSearch(e.target.value)}
          className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {/* Grid de Case Studies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSyncedStudies.length === 0 ? (
          <div className="col-span-full text-center py-8 text-white/40">
            {syncStatus.state === 'syncing' ? 
              'Sincronizando estudios...' : 
              'No hay case studies disponibles'
            }
          </div>
        ) : (
          filteredSyncedStudies.map(study => (
            <CaseStudyCard
              key={study.id}
              study={study}
              showActions
              onEdit={handleEdit}
              onDelete={(study) => removeStudy(study.id)}
              onPublish={(study) => study.status === 'draft' ? publishStudy(study.id) : unpublishStudy(study.id)}
              onFeature={(study) => toggleFeatured(study.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
