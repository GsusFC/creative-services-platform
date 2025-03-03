'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Loader2, 
  ArrowLeft, 
  History,
  Clock,
  User,
  RotateCcw,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CaseStudyVersion } from '@/lib/case-studies/version-schema';
import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyVersionsPage({ params }: PageProps) {
  const { slug } = params;
  const router = useRouter();
  
  const [versions, setVersions] = useState<CaseStudyVersion[]>([]);
  const [caseStudy, setCaseStudy] = useState<CaseStudyDataV4 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<CaseStudyVersion | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar el caso de estudio
        const caseStudyResponse = await fetch(`/api/cms/case-studies/${slug}`);
        
        if (!caseStudyResponse.ok) {
          throw new Error(`Error al cargar el caso de estudio: ${caseStudyResponse.statusText}`);
        }
        
        const caseStudyData = await caseStudyResponse.json();
        
        if (caseStudyData.success) {
          setCaseStudy(caseStudyData.caseStudy);
        } else {
          throw new Error(caseStudyData.message || 'Error desconocido');
        }
        
        // Cargar las versiones
        const versionsResponse = await fetch(`/api/cms/case-studies/${slug}/versions`);
        
        if (!versionsResponse.ok) {
          throw new Error(`Error al cargar las versiones: ${versionsResponse.statusText}`);
        }
        
        const versionsData = await versionsResponse.json();
        
        if (versionsData.success) {
          setVersions(versionsData.versions);
        } else {
          throw new Error(versionsData.message || 'Error desconocido');
        }
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('No se pudieron cargar los datos del caso de estudio.');
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [slug]);
  
  const handleRestoreVersion = async (versionNumber: number) => {
    try {
      setRestoring(true);
      
      const response = await fetch(`/api/cms/case-studies/${slug}/versions/${versionNumber}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createVersion: true,
          restoredBy: 'Admin' // Aquí se podría usar el usuario actual
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al restaurar la versión: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Versión ${versionNumber} restaurada con éxito`);
        
        // Recargar los datos
        router.refresh();
        
        // Recargar las versiones
        const versionsResponse = await fetch(`/api/cms/case-studies/${slug}/versions`);
        const versionsData = await versionsResponse.json();
        
        if (versionsData.success) {
          setVersions(versionsData.versions);
        }
        
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
      
    } catch (error) {
      console.error('Error al restaurar la versión:', error);
      toast.error(`Error al restaurar la versión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setRestoring(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="ml-2">Cargando datos...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-950/30 border border-red-800/30 rounded-md p-4 text-center text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-indigo-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/admin/case-studies/${slug}/edit`} className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold">Historial de Versiones</h1>
            </div>
            <p className="text-gray-400">
              {caseStudy?.project_name} - {versions.length} {versions.length === 1 ? 'versión' : 'versiones'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href={`/case-studies/${slug}`} target="_blank">
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <Eye className="h-4 w-4 mr-2" />
                Ver Publicado
              </Button>
            </Link>
          </div>
        </div>
        
        {versions.length === 0 ? (
          <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-md p-4 text-center text-yellow-400">
            No hay versiones disponibles para este caso de estudio.
          </div>
        ) : (
          <Card className="bg-black/30 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Historial de Cambios
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">Versión</TableHead>
                    <TableHead className="text-white">Fecha</TableHead>
                    <TableHead className="text-white">Autor</TableHead>
                    <TableHead className="text-white">Comentario</TableHead>
                    <TableHead className="text-white text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.versionId} className="border-white/10">
                      <TableCell className="font-medium">V{version.versionNumber}</TableCell>
                      <TableCell className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(version.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1 text-gray-400" />
                          {version.createdBy || 'Sistema'}
                        </div>
                      </TableCell>
                      <TableCell>{version.comment || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30"
                                onClick={() => setSelectedVersion(version)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/95 border border-white/10 text-white">
                              <DialogHeader>
                                <DialogTitle>Versión {selectedVersion?.versionNumber}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Creada el {selectedVersion && formatDate(selectedVersion.createdAt)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="max-h-[60vh] overflow-y-auto mt-4">
                                {selectedVersion && (
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-400">Nombre del Proyecto</h3>
                                      <p>{selectedVersion.data.project_name}</p>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-400">Descripción</h3>
                                      <p className="text-sm">{selectedVersion.data.description}</p>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-400">Servicios</h3>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedVersion.data.services?.map((service, index) => (
                                          <span 
                                            key={index} 
                                            className="bg-indigo-950/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full"
                                          >
                                            {service}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-400">Estado</h3>
                                      {selectedVersion.data.published ? (
                                        <span className="bg-green-950/30 text-green-300 text-xs px-2 py-0.5 rounded-full">
                                          Publicado
                                        </span>
                                      ) : (
                                        <span className="bg-yellow-950/30 text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                                          Borrador
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-400">Imagen Hero</h3>
                                      {selectedVersion.data.hero_image ? (
                                        <img 
                                          src={selectedVersion.data.hero_image} 
                                          alt="Hero Image" 
                                          className="mt-1 rounded-md w-full h-40 object-cover"
                                        />
                                      ) : (
                                        <p className="text-gray-500 text-sm">Sin imagen</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <DialogFooter className="mt-4">
                                <Button 
                                  variant="outline" 
                                  className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30"
                                  onClick={() => selectedVersion && handleRestoreVersion(selectedVersion.versionNumber)}
                                  disabled={restoring}
                                >
                                  {restoring ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Restaurando...
                                    </>
                                  ) : (
                                    <>
                                      <RotateCcw className="h-4 w-4 mr-2" />
                                      Restaurar Versión
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-white/10 hover:border-indigo-500/70 hover:bg-indigo-950/30"
                            onClick={() => handleRestoreVersion(version.versionNumber)}
                            disabled={restoring}
                          >
                            {restoring ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
