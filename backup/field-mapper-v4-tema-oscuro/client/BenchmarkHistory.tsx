'use client';

/**
 * Componente de Historial de Benchmarks
 * 
 * Muestra un historial de benchmarks guardados en el almacenamiento
 * local y permite compararlos o cargarlos para análisis.
 */

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportData, loadResultsFromLocalStorage } from '@/lib/field-mapper-v4/export';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Eye, BarChart } from 'lucide-react';

interface BenchmarkHistoryProps {
  onSelectResults?: (data: ExportData) => void;
  className?: string;
}

export default function BenchmarkHistory({
  onSelectResults,
  className = ''
}: BenchmarkHistoryProps) {
  const [savedItems, setSavedItems] = useState<{key: string, data: ExportData}[]>([]);
  const [selectedItem, setSelectedItem] = useState<ExportData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Cargar los elementos guardados
  useEffect(() => {
    const loadSavedItems = () => {
      const items: {key: string, data: ExportData}[] = [];
      
      // Buscar todos los elementos que corresponden al patrón
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('field-mapper-benchmark')) {
          const data = loadResultsFromLocalStorage(key);
          if (data) {
            items.push({key, data});
          }
        }
      }
      
      // Ordenar por fecha (más reciente primero)
      items.sort((a, b) => {
        return new Date(b.data.timestamp).getTime() - new Date(a.data.timestamp).getTime();
      });
      
      setSavedItems(items);
    };
    
    loadSavedItems();
  }, []);
  
  const handleDeleteItem = (key: string) => {
    localStorage.removeItem(key);
    setSavedItems(savedItems.filter(item => item.key !== key));
  };
  
  const handleViewItem = (data: ExportData) => {
    setSelectedItem(data);
    setIsDialogOpen(true);
  };
  
  const handleLoadItem = (data: ExportData) => {
    if (onSelectResults) {
      onSelectResults(data);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  if (savedItems.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No hay benchmarks guardados. Ejecuta un benchmark y guárdalo para verlo aquí.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Historial de Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Transformaciones</TableHead>
                <TableHead>Recomendaciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(item.data.timestamp)}</TableCell>
                  <TableCell>{item.data.benchmarkResults.length}</TableCell>
                  <TableCell>
                    {item.data.optimizationSummary?.recommendations.length || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewItem(item.data)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLoadItem(item.data)}
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Diálogo para ver detalles */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles del Benchmark</DialogTitle>
            <DialogDescription>
              {selectedItem && formatDate(selectedItem.timestamp)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <Tabs defaultValue="results">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Resultados</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="max-h-[60vh] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transformación</TableHead>
                      <TableHead>Tipo Origen</TableHead>
                      <TableHead>Tipo Destino</TableHead>
                      <TableHead>Iteraciones</TableHead>
                      <TableHead className="text-right">Tiempo Prom. (ms)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItem.benchmarkResults.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{result.transformationName}</TableCell>
                        <TableCell>{result.sourceType}</TableCell>
                        <TableCell>{result.targetType}</TableCell>
                        <TableCell>{result.iterations}</TableCell>
                        <TableCell className="text-right">
                          {result.averageTime.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="recommendations" className="max-h-[60vh] overflow-auto">
                {selectedItem.optimizationSummary?.recommendations.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Impacto</TableHead>
                        <TableHead className="text-right">Valores</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItem.optimizationSummary.recommendations.map((rec, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{rec.type}</TableCell>
                          <TableCell>{rec.description}</TableCell>
                          <TableCell>{rec.impact}</TableCell>
                          <TableCell className="text-right">
                            {rec.currentValue !== undefined && rec.suggestedValue !== undefined && (
                              <span>
                                {rec.currentValue} → {rec.suggestedValue}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    No hay recomendaciones disponibles para este benchmark.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => selectedItem && handleLoadItem(selectedItem)}
              className="ml-auto"
            >
              Cargar estos datos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
