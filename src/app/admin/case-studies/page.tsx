'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  Loader2, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  ArrowLeft,
  History,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';

interface CaseStudyPreview extends Partial<CaseStudyDataV4> {
  slug: string;
  project_name: string;
  description?: string;
  hero_image?: string;
  services?: string[];
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Componente para mostrar el estado de publicación
const StatusBadge = ({ published }: { published?: boolean }) => {
  if (published) {
    return (
      <span className="bg-green-500/20 text-green-500 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-green-500/20">
        <CheckCircle2 className="h-3 w-3" /> Publicado
      </span>
    );
  }
  
  return (
    <span className="bg-yellow-500/20 text-yellow-500 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-500/20">
      <Clock className="h-3 w-3" /> Borrador
    </span>
  );
};

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/cms/case-studies');
        
        if (!response.ok) {
          throw new Error(`Error al cargar los Case Studies: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCaseStudies(data.caseStudies);
        } else {
          throw new Error(data.message || 'Error desconocido');
        }
        
      } catch (error) {
        console.error('Error al cargar los Case Studies:', error);
        setError('No se pudieron cargar los Case Studies.');
        toast.error('Error al cargar los Case Studies');
      } finally {
        setLoading(false);
      }
    };
    
    loadCaseStudies();
  }, []);

  const handleDeleteCaseStudy = async (slug: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este caso de estudio? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/cms/case-studies/${slug}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar el caso de estudio: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Caso de estudio eliminado con éxito');
        // Actualizar la lista de casos de estudio
        setCaseStudies(caseStudies.filter(cs => cs.slug !== slug));
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
      
    } catch (error) {
      console.error('Error al eliminar el caso de estudio:', error);
      toast.error(`Error al eliminar el caso de estudio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold">Gestor de Case Studies</h1>
            </div>
            <p className="text-gray-400">Administra los Case Studies generados a partir de proyectos de Notion</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/admin/case-studies/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Caso
              </Button>
            </Link>
            
            <Link href="/case-studies/landing">
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <Eye className="h-4 w-4 mr-2" />
                Ver Landing
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-black/30 border border-white/10">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="recent">Recientes</TabsTrigger>
            <TabsTrigger value="published">Publicados</TabsTrigger>
            <TabsTrigger value="draft">Borradores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="ml-2">Cargando Case Studies...</span>
              </div>
            ) : error ? (
              <div className="bg-red-950/30 border border-red-800/30 rounded-md p-4 text-center text-red-400">
                {error}
              </div>
            ) : caseStudies.length === 0 ? (
              <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-md p-4 text-center text-yellow-400">
                No hay Case Studies disponibles en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((caseStudy) => (
                  <Card key={caseStudy.slug} className="bg-black/30 border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
                    <CardHeader className="pb-2 relative overflow-hidden h-40">
                      <img 
                        src={caseStudy.hero_image || '/placeholder.jpg'} 
                        alt={caseStudy.project_name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <CardTitle className="relative text-white z-10 mt-auto">
                        {caseStudy.project_name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="py-4">
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {caseStudy.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {caseStudy.services?.map((service, index) => (
                          <span 
                            key={index} 
                            className="bg-indigo-950/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        
                        <StatusBadge published={caseStudy.published} />
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex justify-between">
                      <div className="flex gap-2">
                        <Link href={`/admin/case-studies/${caseStudy.slug}/edit`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/admin/case-studies/${caseStudy.slug}/versions`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <History className="h-4 w-4 mr-1" />
                            Versiones
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/10 hover:border-red-500/70 hover:bg-red-950/30"
                          onClick={() => handleDeleteCaseStudy(caseStudy.slug)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies
                .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                .slice(0, 6)
                .map((caseStudy) => (
                  <Card key={caseStudy.slug} className="bg-black/30 border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
                    <CardHeader className="pb-2 relative overflow-hidden h-40">
                      <img 
                        src={caseStudy.hero_image || '/placeholder.jpg'} 
                        alt={caseStudy.project_name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <CardTitle className="relative text-white z-10 mt-auto">
                        {caseStudy.project_name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="py-4">
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {caseStudy.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {caseStudy.services?.map((service, index) => (
                          <span 
                            key={index} 
                            className="bg-indigo-950/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        
                        {caseStudy.published ? (
                          <span className="bg-green-950/30 text-green-300 text-xs px-2 py-0.5 rounded-full">
                            Publicado
                          </span>
                        ) : (
                          <span className="bg-yellow-950/30 text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                            Borrador
                          </span>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex justify-between">
                      <div className="flex gap-2">
                        <Link href={`/admin/case-studies/${caseStudy.slug}/edit`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/admin/case-studies/${caseStudy.slug}/versions`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <History className="h-4 w-4 mr-1" />
                            Versiones
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/10 hover:border-red-500/70 hover:bg-red-950/30"
                          onClick={() => handleDeleteCaseStudy(caseStudy.slug)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies
                .filter(cs => cs.published)
                .map((caseStudy) => (
                  <Card key={caseStudy.slug} className="bg-black/30 border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
                    <CardHeader className="pb-2 relative overflow-hidden h-40">
                      <img 
                        src={caseStudy.hero_image || '/placeholder.jpg'} 
                        alt={caseStudy.project_name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <CardTitle className="relative text-white z-10 mt-auto">
                        {caseStudy.project_name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="py-4">
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {caseStudy.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {caseStudy.services?.map((service, index) => (
                          <span 
                            key={index} 
                            className="bg-indigo-950/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        
                        <StatusBadge published={true} />
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex justify-between">
                      <div className="flex gap-2">
                        <Link href={`/admin/case-studies/${caseStudy.slug}/edit`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/admin/case-studies/${caseStudy.slug}/versions`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <History className="h-4 w-4 mr-1" />
                            Versiones
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/10 hover:border-red-500/70 hover:bg-red-950/30"
                          onClick={() => handleDeleteCaseStudy(caseStudy.slug)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies
                .filter(cs => !cs.published)
                .map((caseStudy) => (
                  <Card key={caseStudy.slug} className="bg-black/30 border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
                    <CardHeader className="pb-2 relative overflow-hidden h-40">
                      <img 
                        src={caseStudy.hero_image || '/placeholder.jpg'} 
                        alt={caseStudy.project_name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <CardTitle className="relative text-white z-10 mt-auto">
                        {caseStudy.project_name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="py-4">
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {caseStudy.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {caseStudy.services?.map((service, index) => (
                          <span 
                            key={index} 
                            className="bg-indigo-950/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        
                        <StatusBadge published={false} />
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex justify-between">
                      <div className="flex gap-2">
                        <Link href={`/admin/case-studies/${caseStudy.slug}/edit`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/admin/case-studies/${caseStudy.slug}/versions`}>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                            <History className="h-4 w-4 mr-1" />
                            Versiones
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/10 hover:border-red-500/70 hover:bg-red-950/30"
                          onClick={() => handleDeleteCaseStudy(caseStudy.slug)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
