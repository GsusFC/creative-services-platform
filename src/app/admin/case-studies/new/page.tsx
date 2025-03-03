'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Save,
  Trash2,
  FileImage,
  Tag,
  Check,
  X,
  Plus,
  FileText,
  User,
  ListTodo,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaInput } from '@/components/media/MediaInput';
import { FileUploadInput } from '@/components/media/FileUploadInput';
import { GalleryUploader } from '@/components/media/GalleryUploader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';

export default function NewCaseStudyPage() {
  const router = useRouter();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Partial<CaseStudyDataV4>>({
    project_name: '',
    description: '',
    hero_image: '',
    tagline: '',
    services: [],
    gallery: [],
    tags: [],
    category: '',
    challenge: '',
    solution: '',
    results: [],
    client_name: '',
    client_logo: '',
    published: false,
  });
  
  // Estados para campos de tipo array (para la UI)
  const [newService, setNewService] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newResult, setNewResult] = useState('');
  
  // Estado para manejar la carga
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejadores para campos simples
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para el switch de publicación
  const handlePublishedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, published: checked }));
  };

  // Manejadores para campos de tipo array
  const handleAddService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  const handleAddResult = () => {
    if (newResult.trim()) {
      setFormData(prev => ({
        ...prev,
        results: [...(prev.results || []), newResult.trim()]
      }));
      setNewResult('');
    }
  };

  const handleRemoveResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results?.filter((_, i) => i !== index)
    }));
  };


  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.project_name?.trim()) {
      toast.error('Error de validación', {
        description: 'El nombre del proyecto es obligatorio para crear el caso de estudio.',
        icon: '⚠️'
      });
      return;
    }
    
    if (!formData.description?.trim()) {
      toast.error('Error de validación', {
        description: 'La descripción del proyecto es obligatoria para crear el caso de estudio.',
        icon: '⚠️'
      });
      return;
    }
    
    if (!formData.hero_image?.trim()) {
      toast.error('Error de validación', {
        description: 'La imagen principal es obligatoria para crear el caso de estudio.',
        icon: '⚠️'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generar un slug a partir del nombre del proyecto
      const slug = formData.project_name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Eliminar guiones múltiples
        .trim();
      
      // Añadir el slug a los datos del formulario
      const dataToSend = {
        ...formData,
        slug
      };
      
      const response = await fetch('/api/cms/case-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el caso de estudio');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('¡Caso de estudio creado!', {
          description: `"${formData.project_name}" ha sido creado correctamente.`,
          icon: '✅'
        });
        router.push('/admin/case-studies');
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
      
    } catch (error) {
      console.error('Error al crear el caso de estudio:', error);
      toast.error('Error al crear el caso de estudio', {
        description: error instanceof Error ? error.message : 'Error desconocido',
        icon: '❌',
        duration: 5000 // Mostrar por más tiempo para errores
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin/case-studies" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">Nuevo Caso de Estudio</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch 
                id="published" 
                checked={formData.published}
                onCheckedChange={handlePublishedChange}
              />
              <Label htmlFor="published" className="cursor-pointer">
                {formData.published ? 'Publicado' : 'Borrador'}
              </Label>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Accordion type="single" collapsible defaultValue="item-1" className="bg-black/30 border border-white/10 rounded-lg">
            {/* Sección de información principal */}
            <AccordionItem value="item-1" className="border-b border-white/10 px-4">
              <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <span>Información principal</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Nombre del proyecto *</Label>
                    <Input
                      id="project_name"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      placeholder="Nombre del proyecto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      placeholder="Eslogan o frase corta"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 min-h-[120px]"
                    placeholder="Descripción detallada del proyecto"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      placeholder="Categoría principal"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="mb-2 block">Servicios</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        className="bg-black/50 border-white/10"
                        placeholder="Añadir servicio"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddService}
                        variant="outline" 
                        className="border-white/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.services?.map((service, index) => (
                        <div 
                          key={index}
                          className="flex items-center bg-indigo-950/30 text-indigo-300 px-2 py-1 rounded-full"
                        >
                          {service}
                          <button
                            type="button"
                            onClick={() => handleRemoveService(index)}
                            className="ml-1 text-indigo-300 hover:text-indigo-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sección de etiquetas */}
            <AccordionItem value="item-2" className="border-b border-white/10 px-4">
              <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-indigo-400" />
                  <span>Etiquetas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <div className="space-y-2">
                  <Label className="mb-2 block">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-black/50 border-white/10"
                      placeholder="Añadir tag"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTag}
                      variant="outline" 
                      className="border-white/10"
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map((tag, index) => (
                      <div 
                        key={index}
                        className="flex items-center bg-indigo-950/30 text-indigo-300 px-2 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-1 text-indigo-300 hover:text-indigo-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sección de multimedia */}
            <AccordionItem value="item-3" className="border-b border-white/10 px-4">
              <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-indigo-400" />
                  <span>Multimedia</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <FileUploadInput
                  label="Imagen principal"
                  value={formData.hero_image}
                  onChange={(value) => setFormData(prev => ({ ...prev, hero_image: value }))}
                  required
                  helpText="Arrastra una imagen o haz clic para seleccionar"
                  slug={formData.project_name ? formData.project_name.toLowerCase().replace(/\s+/g, '-') : ''}
                />
                
                <div className="space-y-2 mt-6">
                  <GalleryUploader
                    label="Galería multimedia"
                    value={formData.gallery || []}
                    onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
                    slug={formData.project_name ? formData.project_name.toLowerCase().replace(/\s+/g, '-') : ''}
                    helpText="Arrastra imágenes o haz clic para seleccionar. Puedes subir múltiples archivos a la vez."
                    maxItems={20}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sección de cliente */}
            <AccordionItem value="item-4" className="border-b border-white/10 px-4">
              <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <span>Información del cliente</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">Nombre del cliente</Label>
                    <Input
                      id="client_name"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      placeholder="Nombre del cliente o empresa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client_logo">Logo del cliente</Label>
                    <Input
                      id="client_logo"
                      name="client_logo"
                      value={formData.client_logo}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      placeholder="URL del logo"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sección de detalles */}
            <AccordionItem value="item-5" className="border-b-0 px-4">
              <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-indigo-400" />
                  <span>Detalles del proyecto</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <div className="space-y-2">
                  <Label htmlFor="challenge">Desafío</Label>
                  <Textarea
                    id="challenge"
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 min-h-[100px]"
                    placeholder="Desafío que se afrontó en el proyecto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="solution">Solución</Label>
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 min-h-[100px]"
                    placeholder="Solución implementada"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="mb-2 block">Resultados</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newResult}
                      onChange={(e) => setNewResult(e.target.value)}
                      className="bg-black/50 border-white/10"
                      placeholder="Añadir resultado"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResult())}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddResult}
                      variant="outline" 
                      className="border-white/10"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    {formData.results?.map((result, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between bg-indigo-950/20 rounded-md p-2"
                      >
                        <span>{result}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(index)}
                          className="text-indigo-300 hover:text-indigo-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-end gap-4">
            <Link href="/admin/case-studies">
              <Button variant="outline" className="border-white/10">
                Cancelar
              </Button>
            </Link>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse mr-2">⏳</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar caso de estudio
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
