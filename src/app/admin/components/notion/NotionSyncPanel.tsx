'use client'

import { RefreshCw, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CaseStudyCard } from './CaseStudyCard'
import { useNotionSync } from './useNotionSync'
import { useCaseStudyManager } from '@/hooks/useCaseStudyManager'
import { CaseStudy } from '@/types/case-study'

export default function NotionSyncPanel() {
  const {
    syncStatus,
    searchQuery,
    setSearchQuery,
    handleSyncSingle,
    handleSyncAll,
    formatLastSync,
    pendingStudies
  } = useNotionSync()

  const {
    studies: syncedStudies,
    publishStudy,
    unpublishStudy,
    toggleFeatured,
    updateFeaturedOrder
  } = useCaseStudyManager()

  // Estado para manejar estudios seleccionados para sincronización en masa
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set())

  // Handlers para acciones sobre estudios
  const handleEdit = (study: CaseStudy) => {
    // Implementar edición de estudios de caso
    console.log('Editar estudio:', study.id)
  }

  const handleDelete = (study: CaseStudy) => {
    // Implementar eliminación de estudios de caso
    console.log('Eliminar estudio:', study.id)
  }

  const handlePublish = (study: CaseStudy) => {
    if (study.status === 'draft') {
      publishStudy(study.id)
    } else {
      unpublishStudy(study.id)
    }
  }

  const handleFeature = (study: CaseStudy) => {
    toggleFeatured(study.id)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950/95 text-white px-8 pb-8 pt-[88px]">

      <div className="bg-black/20 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-druk uppercase mb-2">Notion Sync</h2>
            <p className="text-white/60">
              Last sync: {formatLastSync(syncStatus.lastSync)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-white/60">
              <p>Total: {syncStatus.totalItems} casos de uso</p>
            </div>
            <Button 
              onClick={handleSyncAll} 
              disabled={syncStatus.isLoading}
              className="bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus.isLoading ? 'animate-spin' : ''}`} />
              Sincronizar todo
            </Button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {syncStatus.error && (
          <div className="mb-4 mx-8 p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <p>{syncStatus.error}</p>
          </div>
        )}

        {syncStatus.success && (
          <div className="mb-4 mx-8 p-4 bg-[#00ff00]/10 text-[#00ff00] rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <p>{syncStatus.success}</p>
          </div>
        )}

        {/* Main content */}
        <div className="flex divide-x divide-white/10">
          {/* Panel izquierdo: Pendientes */}
          <div className="w-1/2 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-[#00ff00]">Pendientes de sincronizar ({pendingStudies.length})</h3>
            </div>

            {/* Buscador */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff00]/40"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            {/* Lista de pendientes */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
              {pendingStudies.length > 0 ? (
                pendingStudies.map((study) => (
                  <CaseStudyCard
                    key={study.id}
                    study={study}
                    onSync={handleSyncSingle}
                    synced={false}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  <p>No hay estudios pendientes.</p>
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho: Publicados */}
          <div className="w-1/2 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Publicados ({syncedStudies.length})</h3>
            </div>

            {/* Lista de sincronizados */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
              {syncedStudies.length > 0 ? (
                syncedStudies.map((study) => (
                  <CaseStudyCard
                    key={study.id}
                    study={study}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onFeature={handleFeature}
                    synced={true}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  <p>No hay estudios sincronizados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
