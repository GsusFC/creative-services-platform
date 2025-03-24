'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CaseStudy } from '@/types/case-study'
import { MediaPreview } from './MediaPreview'
import { useCaseStudyManager } from '@/hooks/useCaseStudyManager'

interface CaseStudyDetailContentProps {
  id: string
}

export function CaseStudyDetailContent({ id }: CaseStudyDetailContentProps) {
  const router = useRouter()
  const { studies, updateStudy } = useCaseStudyManager()
  const [study, setStudy] = useState<CaseStudy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    console.log('Buscando estudio:', id)
    console.log('Studies disponibles:', studies)
    const currentStudy = studies.find(s => s.id === id)
    console.log('Estudio encontrado:', currentStudy)
    if (currentStudy) {
      setStudy(currentStudy)
    }
  }, [id, studies])

  const handleSave = async () => {
    if (!study) return
    try {
      setIsSaving(true)
      await updateStudy(study)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving case study:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-gray-950 px-6 py-24 flex items-center justify-center">
        <div className="text-white/40">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="relative border-b border-white/10 pb-6">
          <Button
            variant="ghost"
            className="admin-page absolute left-0 flex items-center px-3 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white transition-all"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Case Studies
          </Button>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-white text-center">
              {study.title}
            </h1>
            {study.synced ? (
              <div className="text-[#00ff00] text-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00ff00]"></div>
                <span>Sincronizado</span>
              </div>
            ) : (
              <div className="text-yellow-500 text-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span>Pendiente de sincronizar</span>
              </div>
            )}
          </div>
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20 relative"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="opacity-0">Guardar cambios</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-[#00ff00] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </>
            ) : (
              <Button
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </header>

        {/* Información Principal */}
        <div className="grid grid-cols-2 gap-12">
          {/* Columna Izquierda */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white/80">Información Básica</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-white/60">Cliente</Label>
                  <Input
                    value={study.client}
                    onChange={(e) => setStudy({ ...study, client: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Tagline</Label>
                  <Input
                    value={study.tagline}
                    onChange={(e) => setStudy({ ...study, tagline: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Website</Label>
                  <Input
                    value={study.website || ''}
                    onChange={(e) => setStudy({ ...study, website: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2 bg-white/5 border-white/10 text-white"
                    type="url"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white/80">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {study.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-md text-sm bg-white/10 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white border border-white/10"
                  >
                    + Añadir Tag
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white/80">Contenido</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-white/60">Descripción</Label>
                  <Textarea
                    value={study.description}
                    onChange={(e) => setStudy({ ...study, description: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2 bg-white/5 border-white/10 text-white h-32"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Closing Claim</Label>
                  <Textarea
                    value={study.closingClaim}
                    onChange={(e) => setStudy({ ...study, closingClaim: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2 bg-white/5 border-white/10 text-white h-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar del Proyecto */}
        <div className="space-y-6 border-t border-white/10 pt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white/80">Avatar del Proyecto</h2>
            {isEditing && (
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white border border-white/10"
                onClick={() => {
                  // Implementar lógica para añadir/cambiar avatar
                }}
              >
                {study.mediaItems?.find(item => item.type === 'avatar') ? 'Cambiar Avatar' : '+ Añadir Avatar'}
              </Button>
            )}
          </div>
          <div className="p-4 border border-white/10 rounded-lg">
            {study.mediaItems?.find(item => item.type === 'avatar') ? (
              <div className="aspect-square w-32 relative">
                <MediaPreview
                  item={study.mediaItems.find(item => item.type === 'avatar')!}
                  isEditing={isEditing}
                  onDelete={(item) => {
                    if (!study) return
                    setStudy({
                      ...study,
                      mediaItems: study.mediaItems?.filter(i => i !== item) || []
                    })
                  }}
                />
              </div>
            ) : (
              <p className="text-white/60">No se ha establecido un avatar para este proyecto</p>
            )}
          </div>
        </div>

        {/* Galería de Medios */}
        <div className="space-y-6 border-t border-white/10 pt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white/80">Galería de Medios</h2>
            {isEditing && (
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white border border-white/10"
              >
                + Añadir Imagen
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {study.mediaItems?.filter(item => item.type !== 'avatar').map((item, index) => (
              <MediaPreview
                key={index}
                item={item}
                isEditing={isEditing}
                onDelete={(item) => {
                  if (!study) return
                  setStudy({
                    ...study,
                    mediaItems: study.mediaItems?.filter(i => i !== item) || []
                  })
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
