'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, FileOutput, Check, AlertCircle, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface NotionToCaseStudyConverterProps {
  selectedProjects: string[];
  importedProjects: string[];
  onClearSelection?: () => void;
}

type ConversionStatus = 'idle' | 'loading' | 'success' | 'error';

interface ConversionResult {
  id: string;
  title: string;
  status: ConversionStatus;
  caseStudyUrl?: string;
  error?: string;
}

const NotionToCaseStudyConverter: React.FC<NotionToCaseStudyConverterProps> = ({
  selectedProjects,
  importedProjects,
  onClearSelection
}) => {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Función para convertir proyectos seleccionados en Case Studies
  const handleConvertToCaseStudies = async () => {
    if (selectedProjects.length === 0) {
      toast.error('No hay proyectos seleccionados para convertir');
      return;
    }

    setIsConverting(true);
    setShowResults(true);
    
    // Inicializar resultados con estado "loading"
    const initialResults = selectedProjects.map(id => ({
      id,
      title: `Proyecto ${id.slice(0, 8)}...`,
      status: 'loading' as ConversionStatus
    }));
    
    setConversionResults(initialResults);
    
    // Crear un toast de carga
    const toastId = toast.loading('Convirtiendo proyectos a Case Studies...');

    try {
      console.log('Iniciando conversión de proyectos a Case Studies...');
      console.log('Proyectos seleccionados:', selectedProjects);
      
      // En una implementación real, esto sería una llamada a la API
      const response = await fetch('/api/notion/convert-to-case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectIds: selectedProjects,
          useFieldMapperV4: true // Indicar que use Field Mapper V4
        }),
      });
      
      console.log('Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error en la conversión: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (data.success) {
        // Actualizar resultados con el estado final
        const updatedResults = data.results.map((result: any) => ({
          id: result.id,
          title: result.title,
          status: result.success ? 'success' : 'error',
          caseStudyUrl: result.caseStudyUrl,
          error: result.error
        }));
        
        setConversionResults(updatedResults);
        
        const successCount = updatedResults.filter((r: ConversionResult) => r.status === 'success').length;
        const successMessage = `Conversión completada. ${successCount} de ${selectedProjects.length} proyectos convertidos en Case Studies.`;
        
        // Actualizar el toast en lugar de crear uno nuevo
        toast.success(successMessage, {
          id: toastId
        });
      } else {
        throw new Error(data.message || 'Error desconocido durante la conversión');
      }
    } catch (error) {
      console.error('Error durante la conversión:', error);
      
      // Marcar todos como error
      setConversionResults(prevResults => 
        prevResults.map(result => ({
          ...result,
          status: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido'
        }))
      );
      
      const errorMessage = `Error durante la conversión: ${error instanceof Error ? error.message : 'Error desconocido'}`;
      
      // Actualizar el toast de error en lugar de crear uno nuevo
      toast.error(errorMessage, {
        id: toastId
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Función para ver un Case Study generado
  const handleViewCaseStudy = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="mt-6 border-slate-800/50 bg-slate-900/80 hover:border-slate-700/70 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileOutput className="h-5 w-5 text-teal-400" />
            <CardTitle>Convertir a Case Studies</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2">
          Utiliza Field Mapper V4 para convertir los proyectos seleccionados en Case Studies.
          Asegúrate de tener una configuración de mapeo guardada para obtener mejores resultados.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {selectedProjects.length > 0 ? (
                <>
                  <span className="text-teal-400 font-medium flex items-center">
                    <CheckCircle2 size={14} className="mr-1" />
                    {selectedProjects.length} proyectos seleccionados
                  </span>
                  {onClearSelection && (
                    <button 
                      onClick={onClearSelection} 
                      className="text-white/40 hover:text-white/70 transition-colors"
                      aria-label="Limpiar selección"
                    >
                      <X size={14} />
                    </button>
                  )}
                </>
              ) : (
                <span className="text-white/40 font-medium">
                  Ningún proyecto seleccionado
                </span>
              )}
            </div>
            <span className="text-slate-400 font-medium">Proyectos importados: <span className="text-white">{importedProjects.length}</span></span>
          </div>
          
          <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ 
                width: `${selectedProjects.length > 0 
                  ? (importedProjects.length / selectedProjects.length) * 100 
                  : 0}%` 
              }}
              aria-label={`Progreso: ${selectedProjects.length > 0 ? Math.round((importedProjects.length / selectedProjects.length) * 100) : 0}%`}
            ></div>
          </div>
        </div>
        
        <button
          onClick={handleConvertToCaseStudies}
          disabled={isConverting || importedProjects.length === 0}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-md flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
          tabIndex={0}
          aria-label="Convertir proyectos seleccionados a Case Studies"
        >
          {isConverting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Convirtiendo...</span>
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4" />
              <span>Convertir a Case Studies</span>
            </>
          )}
        </button>
        
        {importedProjects.length === 0 && (
          <div className="flex items-center gap-2 text-amber-400 text-xs p-2 bg-amber-950/20 border border-amber-800/30 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>Debes importar proyectos antes de poder convertirlos en Case Studies.</p>
          </div>
        )}
      </CardContent>
      
      {/* Resultados de la conversión */}
      {showResults && conversionResults.length > 0 && (
        <CardFooter className="flex-col items-start border-t border-slate-800 pt-4 px-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-teal-400" />
            Resultados de la conversión
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto w-full rounded-md">
            {conversionResults.map((result) => (
              <div 
                key={result.id} 
                className={`p-2.5 rounded-md flex items-center justify-between text-xs
                  ${result.status === 'success' 
                    ? 'bg-green-950/30 border border-green-800/30 text-green-300' 
                    : result.status === 'error'
                    ? 'bg-red-950/30 border border-red-800/30 text-red-300'
                    : 'bg-slate-800/50 border border-slate-700/30 text-slate-300'
                  }
                  transition-all duration-300 hover:border-opacity-50
                `}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {result.status === 'loading' && (
                    <RefreshCw className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 animate-spin" />
                  )}
                  {result.status === 'success' && (
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                  )}
                  {result.status === 'error' && (
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                  )}
                  <span className="truncate">{result.title}</span>
                </div>
                
                {result.status === 'success' && result.caseStudyUrl && (
                  <button
                    onClick={() => handleViewCaseStudy(result.caseStudyUrl!)}
                    className="ml-2 px-2 py-1 bg-green-900/40 hover:bg-green-800/50 text-green-300 rounded-md transition-colors flex-shrink-0 font-medium"
                    tabIndex={0}
                    aria-label="Ver Case Study"
                  >
                    Ver Case Study
                  </button>
                )}
                
                {result.status === 'error' && (
                  <span className="ml-2 text-red-400 truncate max-w-[200px]">{result.error}</span>
                )}
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotionToCaseStudyConverter;
