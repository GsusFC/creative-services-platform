'use client'

import { useCaseStudyManager } from '@/hooks/useCaseStudyManager'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/components/ui/card'
import { Button } from '@/app/admin/components/ui/button'
import { DatabaseIcon, EditIcon, StarIcon, StarOffIcon, EyeIcon, EyeOffIcon, RefreshCwIcon, Settings2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CaseStudiesList() {
  const router = useRouter()
  const { studies, toggleFeatured, publishStudy, unpublishStudy } = useCaseStudyManager()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleEdit = (id: string) => {
    router.push(`/admin/case-studies/${id}`)
  }

  const handleToggleFeatured = async (id: string) => {
    await toggleFeatured(id)
  }

  const handleTogglePublished = async (id: string, currentStatus: 'draft' | 'published') => {
    if (currentStatus === 'draft') {
      await publishStudy(id)
    } else {
      await unpublishStudy(id)
    }
  }

  const handleSyncWithNotion = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'syncAll'
        })
      })
      if (!response.ok) throw new Error('Error al sincronizar con Notion')
    } catch (error) {
      console.error('Error sincronizando con Notion:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/30 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-xl text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DatabaseIcon className="h-5 w-5 text-blue-400" />
            </div>
            Case Studies ({studies.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push('/admin/case-studies/settings')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Settings2Icon className="h-4 w-4 mr-2" />
              Configuración Notion
            </Button>
            <Button 
              onClick={handleSyncWithNotion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSyncing}
            >
              <RefreshCwIcon className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studies.map(study => (
            <div key={study.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{study.title}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    study.status === 'published' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {study.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Última actualización: {new Date(study.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleTogglePublished(study.id, study.status)}
                  className={`${
                    study.status === 'published'
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30'
                  }`}
                  title={study.status === 'published' ? 'Despublicar' : 'Publicar'}
                >
                  {study.status === 'published' ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => handleToggleFeatured(study.id)}
                  className={`${
                    study.featured
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30'
                  }`}
                  title={study.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                  disabled={study.status !== 'published'}
                >
                  {study.featured ? (
                    <StarIcon className="h-4 w-4" />
                  ) : (
                    <StarOffIcon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => handleEdit(study.id)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                >
                  <EditIcon className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
