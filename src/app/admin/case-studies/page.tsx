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

  return (
    <div className="flex min-h-[calc(100vh-80px)] gap-6 px-6 pb-6 pt-[96px] bg-gray-950">
      {/* Mensaje de error */}
      {error && (
        <Alert variant="destructive" className="absolute top-6 right-6 w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
        {/* Panel Notion - 30% */}
        <section className="w-[30%] space-y-4 border-r border-white/10 pr-6">
          <header className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Notion Case Studies ({filteredPendingStudies.length})
            </h2>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              size="sm"
              onClick={handleSyncAll}
              disabled={syncStatus.state === 'syncing'}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus.state === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus.state === 'syncing' ? 'Syncing...' : 'Sync All'}
            </Button>
          </header>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search in Notion..."
              value={notionSearch}
              onChange={(e) => setNotionSearch(e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            {filteredPendingStudies.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                {syncStatus.state === 'syncing' ? (
                  'Sincronizando estudios...'
                ) : (
                  'No hay estudios pendientes de sincronizar'
                )}
              </div>
            ) : (
              filteredPendingStudies.map(study => (
                <CaseStudyCard
                  key={study.id}
                  study={study}
                  onMoveToSynced={handleMoveToSynced}
                  synced={false}
                />
              ))
            )}
          </div>
        </section>

        {/* Panel Proyectos - 70% */}
        <section className="w-[70%] space-y-4">
          <header className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Synced Projects ({filteredSyncedStudies.length})
            </h2>
            <Button
              className="bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20 border-0"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </header>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search projects..."
              value={projectsSearch}
              onChange={(e) => setProjectsSearch(e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredSyncedStudies.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-white/40">
                No hay proyectos sincronizados
              </div>
            ) : (
              filteredSyncedStudies.map(study => (
                <CaseStudyCard
                  key={study.id}
                  study={study}
                  showActions
                  synced={true}
                  onEdit={handleEdit}
                  onDelete={(study) => removeStudy(study.id)}
                  onPublish={(study) => study.status === 'draft' ? publishStudy(study.id) : unpublishStudy(study.id)}
                  onFeature={(study) => toggleFeatured(study.id)}
                />
              ))
            )}
          </div>
        </section>

    </div>
  )
}
