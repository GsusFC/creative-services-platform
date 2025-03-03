'use client';

/**
 * Botón de Exportación de Resultados
 * 
 * Componente que permite exportar los resultados de un benchmark
 * a diferentes formatos para su análisis posterior.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  DownloadIcon, 
  FileIcon, 
  DatabaseIcon,
  Check
} from 'lucide-react';
import { BenchmarkResult } from '@/lib/field-mapper-v4/benchmark';
import { OptimizationSummary } from '@/lib/field-mapper-v4/optimization';
import { exportBenchmarkResults, saveResultsToLocalStorage, ExportData } from '@/lib/field-mapper-v4/export';

interface ExportResultsButtonProps {
  results: BenchmarkResult[];
  analysis: OptimizationSummary | null;
  onExport?: (format: string) => void;
  className?: string;
}

export default function ExportResultsButton({
  results,
  analysis,
  onExport,
  className = ''
}: ExportResultsButtonProps) {
  const [lastExportFormat, setLastExportFormat] = useState<string | null>(null);
  
  if (results.length === 0) {
    return null;
  }
  
  const handleExportJSON = () => {
    const url = exportBenchmarkResults(results, analysis, { format: 'json' });
    downloadFile(url, 'field-mapper-benchmark.json');
    setLastExportFormat('json');
    if (onExport) onExport('json');
  };
  
  const handleExportCSV = () => {
    const url = exportBenchmarkResults(results, analysis, { format: 'csv' });
    downloadFile(url, 'field-mapper-benchmark.csv');
    setLastExportFormat('csv');
    if (onExport) onExport('csv');
  };
  
  const handleSaveToLocalStorage = () => {
    const data: ExportData = {
      timestamp: new Date().toISOString(),
      benchmarkResults: results,
      optimizationSummary: analysis
    };
    
    saveResultsToLocalStorage('field-mapper-benchmark-results', data);
    setLastExportFormat('storage');
    if (onExport) onExport('storage');
  };
  
  const downloadFile = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Liberar URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <DownloadIcon className="h-4 w-4" />
          <span>Exportar Resultados</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON} className="flex items-center gap-2">
          <FileIcon className="h-4 w-4" />
          <span>Exportar como JSON</span>
          {lastExportFormat === 'json' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} className="flex items-center gap-2">
          <DatabaseIcon className="h-4 w-4" />
          <span>Exportar como CSV</span>
          {lastExportFormat === 'csv' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSaveToLocalStorage} className="flex items-center gap-2">
          <DownloadIcon className="h-4 w-4" />
          <span>Guardar en navegador</span>
          {lastExportFormat === 'storage' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
