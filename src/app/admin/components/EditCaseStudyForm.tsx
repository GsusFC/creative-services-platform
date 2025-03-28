'use client'

import { useState, useEffect } from 'react'
import { CaseStudy, MediaItem } from '@/types/case-study'
// Comentamos la importación de la función que ya no se exporta
// import { updateCaseStudy } from '@/app/admin/case-studies/actions'
import { Switch } from '@/app/admin/components/ui/switch'
import { Label } from '@/app/admin/components/ui/label'
import { EyeIcon, EyeOffIcon, StarIcon, RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { MediaUploader } from './MediaUploader'

interface EditCaseStudyFormProps {
  caseStudy: CaseStudy
  onSaveAction: (updatedStudy: CaseStudy) => Promise<void>
  onCancelAction: () => Promise<void>
  isSaving?: boolean
}

export default function EditCaseStudyForm({ caseStudy, onSaveAction, onCancelAction, isSaving = false }: EditCaseStudyFormProps) {
  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    title: caseStudy.title,
    description: caseStudy.description,
    tagline: caseStudy.tagline,
    closingClaim: caseStudy.closingClaim,
    website: caseStudy.website,
    tags: caseStudy.tags,
    status: caseStudy.status,
    featured: caseStudy.featured,
    featuredOrder: caseStudy.featuredOrder
  })
  // Usamos la propiedad isSaving proporcionada por el componente padre
  const [isSynced, setIsSynced] = useState(caseStudy.synced !== false)
  const [error, setError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Resetear mensajes de éxito/error cuando el usuario cambia algo
    setSaveSuccess(false)
    setError('')
  }
  
  const handleSwitchChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Resetear mensajes de éxito/error cuando el usuario cambia algo
    setSaveSuccess(false)
    setError('')
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim())
    setFormData(prev => ({ ...prev, tags }))
    setSaveSuccess(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent): Promise<CaseStudy | null> => {
    e.preventDefault()
    setError('')
    setSaveSuccess(false)

    let result: CaseStudy | null = null;
    
    // Comentamos la lógica que usaba updateCaseStudy para evitar errores
    /*
    try {
      // const updatedStudy = await updateCaseStudy({
      //   id: caseStudy.id,
      //   ...formData
      // } as CaseStudy)
      
      // // Actualizar el estado de sincronización
      // setIsSynced(updatedStudy.synced !== false)
      
      // // Mostrar mensaje de éxito
      // setSaveSuccess(true)
      
      // // Llamar al callback de guardado
      // await onSaveAction(updatedStudy)
      // result = updatedStudy;

      // Placeholder temporal: Simula un guardado exitoso sin llamar a la acción
      console.warn("La funcionalidad de guardar está deshabilitada temporalmente.");
      setSaveSuccess(true);
      // Simula los datos actualizados para el callback (sin la actualización real)
      const simulatedUpdatedStudy = { ...caseStudy, ...formData } as CaseStudy;
      await onSaveAction(simulatedUpdatedStudy);
      result = simulatedUpdatedStudy;


    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estudio')
      setIsSynced(false)
      result = null;
    }
    */
    
    // Devolvemos null temporalmente ya que la actualización está deshabilitada
    console.warn("La funcionalidad de guardar está deshabilitada temporalmente. Devolviendo null.");
    setError("La funcionalidad de guardar está deshabilitada temporalmente."); // Informar al usuario
    return null;
  }
  
  // Efecto para limpiar el mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
    return undefined; // Asegurar que todas las rutas retornen un valor
  }, [saveSuccess])

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/50 p-6 rounded-lg border border-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Información General</h2>
        <div className="flex items-center gap-2">
          {isSynced ? (
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Sincronizado
            </div>
          ) : (
            <div className="flex items-center text-amber-400 text-sm">
              <AlertCircleIcon className="h-4 w-4 mr-1" />
              No sincronizado
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-800 text-red-300 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-900/50 border border-green-800 text-green-300 p-4 rounded-md">
          Case study guardado correctamente
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-300">
              Tagline
            </label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="closingClaim" className="block text-sm font-medium text-gray-300">
              Closing Claim
            </label>
            <input
              type="text"
              id="closingClaim"
              name="closingClaim"
              value={formData.closingClaim}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags?.join(', ')}
              onChange={handleTagsChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Opciones de publicación y destacado */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
          <h3 className="text-md font-medium text-gray-200">Estado</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {formData.status === 'published' ? (
                <EyeIcon className="h-4 w-4 text-green-400" />
              ) : (
                <EyeOffIcon className="h-4 w-4 text-gray-400" />
              )}
              <Label htmlFor="published" className="text-sm font-medium text-gray-300">
                Publicado
              </Label>
            </div>
            <Switch
              id="published"
              checked={formData.status === 'published'}
              onCheckedChange={(checked: boolean) => handleSwitchChange('status', checked ? 'published' : 'draft')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StarIcon className={`h-4 w-4 ${formData.featured ? 'text-yellow-400' : 'text-gray-400'}`} />
              <Label htmlFor="featured" className="text-sm font-medium text-gray-300">
                Destacado
              </Label>
            </div>
            <Switch
              id="featured"
              checked={formData.featured === true}
              onCheckedChange={(checked: boolean) => handleSwitchChange('featured', checked)}
              disabled={formData.status !== 'published'}
            />
          </div>
          
          {formData.featured && (
            <div>
              <Label htmlFor="featuredOrder" className="block text-sm font-medium text-gray-300">
                Orden de destacado
              </Label>
              <input
                type="number"
                id="featuredOrder"
                name="featuredOrder"
                value={formData.featuredOrder || 0}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        


        {/* Información del Case Study */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mt-6">
          <h3 className="text-md font-medium text-gray-200 mb-4">Información</h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">ID:</span>
              <span className="ml-2 text-gray-300">{caseStudy.id.substring(0, 8)}...</span>
            </div>
            <div>
              <span className="text-gray-400">Slug:</span>
              <span className="ml-2 text-gray-300">{caseStudy.slug}</span>
            </div>
            <div>
              <span className="text-gray-400">Creado:</span>
              <span className="ml-2 text-gray-300">{new Date(caseStudy.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Actualizado:</span>
              <span className="ml-2 text-gray-300">{new Date(caseStudy.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gestión de archivos multimedia - Sección de ancho completo */}
      <div className="md:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Archivos Multimedia</h3>
        <MediaUploader 
          mediaItems={formData.mediaItems || []}
          onMediaChangeAction={(mediaItems: MediaItem[]) => {
            setFormData(prev => ({ ...prev, mediaItems }))
            setSaveSuccess(false)
            setError('')
          }}
          disabled={isSaving}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => onCancelAction()}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={isSaving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving && <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />}
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
