"use client";

/**
 * Field Mapper Debug Panel
 * 
 * Panel de depuración para FieldMapperV3 que muestra información de errores,
 * estado interno y herramientas de diagnóstico.
 * 
 * Este componente solo se muestra en entornos de desarrollo.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  ClipboardCopy as Clipboard, 
  CheckCircle2, 
  DownloadCloud as Download, 
  Trash2,
  AlertCircle, 
  Bug, 
  X,
  LineChart 
} from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

import BenchmarkTool from '@/components/field-mapper-v4/client/BenchmarkTool';
import OptimizationPanel from '@/components/field-mapper-v4/client/OptimizationPanel';
import { BenchmarkResult } from '@/lib/field-mapper-v4/benchmark';

import { 
  useFieldMapperDebugger,
  useValidationDebugger,
  useFieldMapperV3Store,
  captureFieldMapperState
} from '@/lib/debug'

/**
 * Panel de depuración para Field Mapper V3
 * 
 * Este componente proporciona una interfaz para ver y gestionar errores
 * registrados durante el desarrollo de Field Mapper V3.
 */
export const FieldMapperDebugPanel: React.FC = () => {
  const debuggerInstance = useFieldMapperDebugger();
  const validationDebugger = useValidationDebugger();
  const [report, setReport] = useState<{ 
    report: string; 
    criticalCount: number; 
    highCount: number; 
  }>({ report: '', criticalCount: 0, highCount: 0 });
  const [visible, setVisible] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [stateAnalysis, setStateAnalysis] = useState('');
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([]);
  const fieldMapperStore = useFieldMapperV3Store();

  // Activar el depurador al montar el componente
  useEffect(() => {
    if (typeof debuggerInstance.enableConsoleCapture === 'function') {
      debuggerInstance.enableConsoleCapture();
    }
    
    // Limpiar al desmontar
    return () => {
      if (typeof debuggerInstance.disableConsoleCapture === 'function') {
        debuggerInstance.disableConsoleCapture();
      }
    };
  }, [debuggerInstance]);

  // Generar informe cada vez que se abre o refresca
  useEffect(() => {
    if (typeof debuggerInstance.generateReport === 'function') {
      const generatedReport = debuggerInstance.generateReport();
      setReport(generatedReport);
    } else {
      setReport({ report: 'Función de reporte no disponible', criticalCount: 0, highCount: 0 });
    }
  }, [debuggerInstance, refreshCounter, visible]);

  // Capturar estado actual para depuración
  const handleCaptureCurrentState = () => {
    if (fieldMapperStore) {
      captureFieldMapperState('FieldMapperV3', {
        notionAssets: fieldMapperStore.notionAssets || [],
        mappings: fieldMapperStore.mappings || [],
        selectedNotionAssetId: fieldMapperStore.selectedNotionAssetId,
        selectedPageSectionId: fieldMapperStore.selectedPageSectionId,
        validationResults: fieldMapperStore.validationResults
      });
      setRefreshCounter(prev => prev + 1);
    }
  };

  // Ejecutar pruebas de validación
  const handleRunValidationTests = async () => {
    const state = {
      validationResults: fieldMapperStore.validationResults,
      mappings: fieldMapperStore.mappings,
      pageComponents: fieldMapperStore.pageStructure,
      notionComponents: fieldMapperStore.notionAssets
    };
    
    const results = await validationDebugger.runAllTests(state);
    setTestResults(results);
    
    const analysis = validationDebugger.analyzeFieldMapperState({
      notionAssets: fieldMapperStore.notionAssets,
      mappings: fieldMapperStore.mappings,
      selectedNotionAssetId: fieldMapperStore.selectedNotionAssetId,
      selectedPageSectionId: fieldMapperStore.selectedPageSectionId,
      validationResults: fieldMapperStore.validationResults,
      pageStructure: fieldMapperStore.pageStructure
    });
    
    setStateAnalysis(analysis);
    setRefreshCounter(prev => prev + 1);
  };

  // Descargar informe como archivo de texto
  const handleDownloadReport = () => {
    const blob = new Blob([report.report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `field-mapper-debug-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copiar informe al portapapeles
  const handleCopyReport = () => {
    navigator.clipboard.writeText(report.report)
      .then(() => {
        alert('Informe copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar informe:', err);
      });
  };

  return (
    <>
      {/* Botón flotante para abrir el panel */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg z-50"
        onClick={() => setVisible(true)}
        aria-label="Abrir panel de depuración"
      >
        <Bug className="h-6 w-6" />
        {(report.criticalCount > 0 || report.highCount > 0) && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center"
          >
            {report.criticalCount + report.highCount}
          </Badge>
        )}
      </Button>
      
      {/* Panel de depuración */}
      <Sheet open={visible} onOpenChange={setVisible}>
        <SheetContent 
          side="right" 
          className="w-[90vw] sm:w-[600px] bg-gray-950 text-gray-300 border-gray-800"
        >
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Panel de Depuración - Field Mapper V3
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              Sistema de triaje y monitoreo de errores para desarrollo rápido
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="report" className="mt-6">
            <TabsList className="bg-gray-900 text-gray-400">
              <TabsTrigger value="report" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                Informe de Errores
                {(report.criticalCount > 0 || report.highCount > 0) && (
                  <Badge 
                    variant="destructive" 
                    className="ml-2"
                  >
                    {report.criticalCount + report.highCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="validation" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                Validación
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                <div className="flex items-center gap-1">
                  <LineChart className="h-3.5 w-3.5" />
                  <span>Rendimiento</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                Acciones
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="report" className="mt-4">
              <div className="border border-gray-800 rounded-md p-3 bg-gray-900">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Resumen de Errores</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
                      onClick={() => setRefreshCounter(prev => prev + 1)}
                    >
                      Refrescar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
                      onClick={handleCopyReport}
                    >
                      <Clipboard className="h-3.5 w-3.5 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[60vh]">
                  <div 
                    className="font-mono text-xs p-3 bg-black rounded border border-gray-800 whitespace-pre-wrap"
                  >
                    {report.report || 'No hay errores registrados.'}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="validation" className="mt-4">
              <div className="border border-gray-800 rounded-md p-3 bg-gray-900">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Diagnóstico de Validación</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
                    onClick={handleRunValidationTests}
                  >
                    Ejecutar Pruebas
                  </Button>
                </div>
                
                {Object.keys(testResults).length > 0 && (
                  <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
                    <h4 className="text-xs font-medium mb-2 text-white">Resultados de Pruebas</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.entries(testResults).map(([testName, passed]) => (
                        <div 
                          key={testName}
                          className={`flex items-center gap-2 p-2 rounded text-xs ${
                            passed ? 'bg-green-950 text-green-300' : 'bg-red-950 text-red-300'
                          }`}
                        >
                          {passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span>{testName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-[50vh]">
                  <div 
                    className="font-mono text-xs p-3 bg-black rounded border border-gray-800 whitespace-pre-wrap"
                  >
                    {stateAnalysis || 'Ejecuta las pruebas para ver el análisis del estado actual.'}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4 space-y-4">
              <div className="border border-gray-800 rounded-md bg-gray-900">
                <div className="p-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Benchmark y Optimización</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-xs text-gray-400 mb-4">
                    Evalúa el rendimiento de las transformaciones y aplica optimizaciones
                    para mejorar la velocidad de procesamiento del Field Mapper.
                  </div>
                  
                  <Tabs defaultValue="benchmark" className="w-full">
                    <TabsList className="bg-gray-950 text-gray-400 w-full mb-4">
                      <TabsTrigger value="benchmark" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white flex-1">
                        Benchmark
                      </TabsTrigger>
                      <TabsTrigger value="optimize" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white flex-1">
                        Optimización
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="benchmark">
                      <BenchmarkTool
                        className="border-none shadow-none"
                        onResultsChange={setBenchmarkResults}
                      />
                    </TabsContent>
                    
                    <TabsContent value="optimize">
                      <OptimizationPanel
                        benchmarkResults={benchmarkResults}
                        className="border-none"
                        onSettingsChanged={() => setRefreshCounter(prev => prev + 1)}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="mt-4 space-y-4">
              <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                <h3 className="text-sm font-medium mb-3 text-white">Capturar Estado Actual</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Registra el estado actual de Field Mapper V3 para análisis posterior.
                  Útil cuando encuentras un error pero no sabes exactamente por qué ocurre.
                </p>
                <Button
                  variant="outline"
                  className="bg-blue-900 hover:bg-blue-800 text-white border-blue-700"
                  onClick={handleCaptureCurrentState}
                >
                  Capturar Estado Actual
                </Button>
              </div>
              
              <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                <h3 className="text-sm font-medium mb-3 text-white">Exportar Informe</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Descarga un archivo de texto con el informe completo de errores para su análisis.
                </p>
                <Button
                  variant="outline"
                  className="bg-green-900 hover:bg-green-800 text-white border-green-700"
                  onClick={handleDownloadReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Informe
                </Button>
              </div>
              
              <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                <h3 className="text-sm font-medium mb-3 text-white">Limpiar Registro</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Elimina todos los errores registrados hasta el momento. Usa esta opción
                  cuando quieras comenzar con un registro limpio.
                </p>
                <Button
                  variant="outline"
                  className="bg-red-900 hover:bg-red-800 text-white border-red-700"
                  onClick={() => {
                    debuggerInstance.clearErrors();
                    setRefreshCounter(prev => prev + 1);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Errores
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
              >
                Cerrar Panel
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FieldMapperDebugPanel;
