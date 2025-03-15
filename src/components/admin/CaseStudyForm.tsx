'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaseStudy, MediaItem } from '@/types/case-study';
import MediaItemsManagerContainer from '@/components/admin/MediaItemsManagerContainer';

interface CaseStudyFormProps {
  initialData?: Partial<CaseStudy>;
  onSubmit: (data: Omit<CaseStudy, 'id'>) => Promise<void>;
  isSubmitting?: boolean;
}

const CaseStudyForm: React.FC<CaseStudyFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    title: initialData.title || '',
    client: initialData.client || '',
    description: initialData.description || '',
    description2: initialData.description2 || '',
    mediaItems: initialData.mediaItems || [],
    tags: initialData.tags || [],
    order: initialData.order || 0,
    slug: initialData.slug || '',
    status: initialData.status || 'draft',
    featured: initialData.featured || false,
    featuredOrder: initialData.featuredOrder || 999
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.client?.trim()) {
      newErrors.client = 'El cliente es obligatorio';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'La descripción corta es obligatoria';
    }
    
    if (!formData.description2?.trim()) {
      newErrors.description2 = 'La descripción larga es obligatoria';
    }
    
    // Las imágenes o videos son opcionales, especialmente para borradores
    // No se valida mediaItems para permitir guardar sin medios
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario corrige un campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleMediaItemsChange = (items: MediaItem[]) => {
    setFormData(prev => ({ ...prev, mediaItems: items }));
    
    // Limpiar error cuando el usuario añade medios
    if (errors.mediaItems && items.length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.mediaItems;
        return newErrors;
      });
    }
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-'); // Eliminar guiones duplicados
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validateForm()) {
      // Scroll al primer error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    try {
      // Aseguramos que todos los campos requeridos estén presentes
      await onSubmit(formData as Omit<CaseStudy, 'id'>);
    } catch (error) {
      console.error('Error en formulario:', error);
      // El error ya se maneja en el componente padre
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-page space-y-8">
      {/* Tabs para edición/previsualización */}
      <div className="bg-black/30 p-4 rounded-t-lg border-b border-white/10 flex">
        <button
          type="button"
          onClick={() => setPreviewMode(false)}
          className={`px-4 py-2 font-medium mr-2 rounded-t-lg ${
            !previewMode ? 'bg-white/10 border-b-2 border-blue-500' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          Edición
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode(true)}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            previewMode ? 'bg-white/10 border-b-2 border-blue-500' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          Vista Previa
        </button>
      </div>
      
      {/* Modo de edición */}
      {!previewMode ? (
        <>
          {/* Campos Básicos */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-white">
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${
                    errors.title ? 'border-red-500' : 'border-gray-700'
                  } rounded-md bg-black/50 text-white`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cliente *
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${
                    errors.client ? 'border-red-500' : 'border-gray-700'
                  } rounded-md bg-black/50 text-white`}
                />
                {errors.client && (
                  <p className="mt-1 text-sm text-red-500">{errors.client}</p>
                )}
              </div>
            </div>
            
            {/* Descripciones */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción Corta (para listados) *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-2 border ${
                    errors.description ? 'border-red-500' : 'border-gray-700'
                  } rounded-md bg-black/50 text-white`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Esta descripción aparecerá en el listado de proyectos. Máximo 150 caracteres recomendado.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción Larga (página detalle) *
                </label>
                <textarea
                  name="description2"
                  value={formData.description2}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full p-2 border ${
                    errors.description2 ? 'border-red-500' : 'border-gray-700'
                  } rounded-md bg-black/50 text-white`}
                />
                {errors.description2 && (
                  <p className="mt-1 text-sm text-red-500">{errors.description2}</p>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {formData.tags?.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900/30 text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-blue-300 hover:text-blue-100"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  placeholder="Añadir tag y presionar Enter"
                  className="flex-1 p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                />
              </div>
            </div>
            
            {/* Config adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Posición
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleNumberChange}
                  min={0}
                  className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Determina el orden en el listado
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-700 rounded-md rounded-r-none bg-black/50 text-white"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-3 py-2 bg-gray-800 border border-l-0 border-gray-700 rounded-r-md hover:bg-gray-700 text-white"
                  >
                    Generar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL amigable (example.com/work/mi-proyecto)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Los borradores no se muestran en la web pública
                </p>
              </div>
            </div>
            
            {/* Opciones de Featured */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-md font-medium mb-3 text-white">
                Opciones de Destacado
              </h3>
              
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-black/50"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
                  Mostrar en sección destacada de la home
                </label>
              </div>
              
              {formData.featured && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Posición en destacados (1-4)
                  </label>
                  <input
                    type="number"
                    name="featuredOrder"
                    value={formData.featuredOrder}
                    onChange={handleNumberChange}
                    min={1}
                    max={4}
                    className="w-24 p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    La posición 1 aparece primero en la home
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Media Items */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-white">Contenido Multimedia</h2>
            <MediaItemsManagerContainer 
              initialItems={formData.mediaItems || []} 
              onChange={handleMediaItemsChange}
            />
            {errors.mediaItems && (
              <p className="mt-4 text-sm text-red-500">{errors.mediaItems}</p>
            )}
          </div>
        </>
      ) : (
        // Modo de vista previa
        <div className="bg-black/30 p-6 rounded-lg border border-white/10">
          <div className="border-b border-gray-800 pb-6 mb-6">
            <h1 className="text-4xl font-bold mb-4 uppercase text-white">{formData.title || 'Título del Proyecto'}</h1>
            <p className="text-gray-400 font-mono">{formData.client || 'Nombre del cliente'}</p>
            
            <div className="flex flex-wrap mt-4">
              {formData.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 mr-2 mb-2 bg-blue-900/30 rounded-full font-mono text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase text-white">Sobre el proyecto</h2>
            </div>
            <div className="font-mono text-gray-300">
              <p>{formData.description2 || 'Descripción larga del proyecto...'}</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {formData.mediaItems && formData.mediaItems.length > 0 ? (
              formData.mediaItems.map((item, index) => (
                <div key={index} className="aspect-video bg-black/50 rounded border border-gray-800">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <p>Video: {item.videoType}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="aspect-video bg-black/50 flex items-center justify-center rounded border border-gray-800">
                <p className="text-gray-500">No hay contenido multimedia</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-sm text-gray-500 border-t border-gray-800 pt-4">
            <p>
              <strong>Estado:</strong> {formData.status === 'published' ? 'Publicado' : 'Borrador'} | 
              <strong> Slug:</strong> /work/{formData.slug || 'sin-definir'} | 
              <strong> Destacado:</strong> {formData.featured ? 'Sí' : 'No'}
              {formData.featured && ` (Posición ${formData.featuredOrder})`}
            </p>
          </div>
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/case-studies')}
          className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-900 transition"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:text-blue-200 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : (initialData.id ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};

export default CaseStudyForm;
