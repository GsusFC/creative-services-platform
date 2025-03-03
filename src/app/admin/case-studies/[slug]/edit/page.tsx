'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Globe,
  History,
  FileText,
  User,
  ListTodo,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MediaInput } from '@/components/media/MediaInput';
import { FileUploadInput } from '@/components/media/FileUploadInput';
import { GalleryUploader } from '@/components/media/GalleryUploader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Definición de la interfaz CaseStudyDetail basada en el nuevo diseño
interface CaseStudyDetail {
  slug: string;
  title: string;        // Nombre del proyecto
  tagline: string;      // Frase en Druk
  description: string;
  services: string[];
  heroImage?: string;   // URL de imagen hero
  heroVideo?: string;   // URL de video hero
  gallery: string[];    // URLs de imágenes de galería
  category?: string;
  tags?: string[];
  challenge?: string;
  solution?: string;
  results?: string[];
  client_name?: string;
  client_logo?: string;
  published?: boolean;
}

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Partial<CaseStudyDetail>>({});
  
  // Estados para campos de tipo array (para la UI)
  const [newService, setNewService] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newResult, setNewResult] = useState('');
  
  // Estado para manejar la carga
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del caso de estudio
  useEffect(() => {
    if (!slug) {
      setError('No se proporcionó un identificador de caso de estudio');
      setIsLoading(false);
      return;
    }
    
    const loadCaseStudy = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/cms/case-studies/${slug}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar el caso de estudio');
        }
        
        const data = await response.json();
        if (data.success) {
          setFormData(data.caseStudy);
        } else {
          throw new Error(data.message || 'Error desconocido');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudo cargar el caso de estudio');
        toast.error('Error al cargar el caso de estudio');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCaseStudy();
  }, [slug]);

  // Manejadores para campos simples
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para el switch de publicación
  const handlePublishedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, published: checked }));
  };

  // Manejador genérico para campos de tipo array
  const handleAddArrayItem = (field: keyof CaseStudyDetail, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
      setter('');
    }
  };

  const handleRemoveArrayItem = (field: keyof CaseStudyDetail, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[])?.filter((_, i) => i !== index)
    }));
  };
  
  // Manejadores específicos que usan el manejador genérico
  const handleAddService = () => handleAddArrayItem('services', newService, setNewService);
  const handleRemoveService = (index: number) => handleRemoveArrayItem('services', index);
  
  const handleAddTag = () => handleAddArrayItem('tags', newTag, setNewTag);
  const handleRemoveTag = (index: number) => handleRemoveArrayItem('tags', index);
  
  const handleAddResult = () => handleAddArrayItem('results', newResult, setNewResult);
  const handleRemoveResult = (index: number) => handleRemoveArrayItem('results', index);

  // Manejador simplificado para publicar/despublicar
  const handleTogglePublish = async () => {
    try {
      const response = await fetch(`/api/cms/case-studies/${slug}/publish`, {
        method: 'PATCH', // Cambiado de POST a PATCH para coincidir con la API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !formData.published }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, published: !prev.published }));
        toast.success(`Caso de estudio ${formData.published ? 'despublicado' : 'publicado'} con éxito`);
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error al cambiar estado de publicación`);
    }
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.title?.trim()) {
      toast.error('El nombre del proyecto es obligatorio');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/cms/case-studies/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Caso de estudio actualizado con éxito');
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el caso de estudio');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizado condicional simple
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 pt-24 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-950/30 border border-red-800/30 rounded-md p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <Link href="/admin/case-studies">
              <Button>Volver a la lista</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Link href="/admin/case-studies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold">Editar: {formData.title || 'Caso de estudio'}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch 
                id="published" 
                checked={formData.published || false}
                onCheckedChange={handlePublishedChange}
              />
              <Label htmlFor="published">
                {formData.published ? 'Publicado' : 'Borrador'}
              </Label>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
            
            <Link href={`/case-studies/${slug}`} target="_blank">
              <Button variant="outline">
                Ver público
              </Button>
            </Link>
            
            <Link href={`/admin/case-studies/${slug}/versions`}>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Versiones
              </Button>
            </Link>
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
                    <Label htmlFor="title">Nombre del proyecto *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
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
                      value={formData.tagline || ''}
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
                      value={formData.category || ''}
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
                  <ImageIcon className="h-5 w-5 text-indigo-400" />
                  <span>Multimedia</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <Tabs defaultValue="image" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Imagen Hero
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Hero
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="image" className="space-y-4">
                    <FileUploadInput
                      label="Imagen Hero (16:9, 1920x1080)"
                      value={formData.heroImage || ''}
                      onChange={(value) => setFormData(prev => ({ ...prev, heroImage: value }))}
                      required
                      helpText="Arrastra una imagen o haz clic para seleccionar. Recomendado: 1920x1080"
                      slug={slug || ''}
                    />
                  </TabsContent>
                  <TabsContent value="video" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="heroVideo">URL del Video Hero</Label>
                      <Input
                        id="heroVideo"
                        name="heroVideo"
                        value={formData.heroVideo || ''}
                        onChange={handleInputChange}
                        className="bg-black/50 border-white/10"
                        placeholder="URL del video (YouTube, Vimeo, etc.)"
                      />
                      <p className="text-xs text-white/50">Introduce la URL del video para el hero section</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-2 mt-6">
                  <GalleryUploader
                    label="Galería multimedia"
                    value={formData.gallery || []}
                    onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
                    slug={slug || ''}
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
                      value={formData.client_name || ''}
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
                      value={formData.client_logo || ''}
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
                    value={formData.challenge || ''}
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
                    value={formData.solution || ''}
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
          
          <div className="flex justify-between">
            <Link href="/admin/case-studies">
              <Button variant="outline" className="border-white/10">
                Cancelar
              </Button>
            </Link>
            
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleTogglePublish}
                variant="outline"
                className={formData.published ? "border-red-500/70 hover:bg-red-950/30 text-red-400" : "border-green-500/70 hover:bg-green-950/30 text-green-400"}
              >
                {formData.published ? 'Despublicar' : 'Publicar'}
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
