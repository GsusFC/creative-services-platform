'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Zap, Cpu, Info, ChevronRight, ChevronDown } from 'lucide-react';
import { 
  KNOWN_TRANSFORMATIONS,
  getTransformationExample,
  getTransformationDescription
} from '@/lib/field-mapper/v3-transformations';

/**
 * Panel informativo que muestra todas las transformaciones disponibles en el sistema,
 * con ejemplos y métricas de rendimiento.
 */
export const TransformationInfoPanel = () => {
  const [expandedTransformation, setExpandedTransformation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'sourceType' | 'targetType' | 'performance'>('sourceType');
  const [activeTab, setActiveTab] = useState<'example' | 'details'>('example');

  // Generar la lista de transformaciones con ejemplos
  const transformationsWithExamples = useMemo(() => {
    return Object.keys(KNOWN_TRANSFORMATIONS).flatMap(sourceType => {
      return Object.keys(KNOWN_TRANSFORMATIONS[sourceType]).map(targetType => {
        const example = getTransformationExample(sourceType, targetType);
        const description = getTransformationDescription(sourceType, targetType);
        
        return {
          id: `${sourceType}-${targetType}`,
          sourceType,
          targetType,
          description,
          example
        };
      });
    });
  }, []);

  // Filtrar por búsqueda
  const filteredTransformations = useMemo(() => {
    if (!searchQuery) return transformationsWithExamples;
    
    const query = searchQuery.toLowerCase();
    return transformationsWithExamples.filter(t => 
      t.sourceType.toLowerCase().includes(query) ||
      t.targetType.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  }, [transformationsWithExamples, searchQuery]);

  // Ordenar transformaciones
  const sortedTransformations = useMemo(() => {
    return [...filteredTransformations].sort((a, b) => {
      if (sortBy === 'sourceType') {
        return a.sourceType.localeCompare(b.sourceType);
      } else if (sortBy === 'targetType') {
        return a.targetType.localeCompare(b.targetType);
      } else {
        // Ordenar por rendimiento (bajo, medio, alto)
        const performanceOrder = { bajo: 0, medio: 1, alto: 2 };
        return (
          performanceOrder[a.example.performanceImpact as keyof typeof performanceOrder] -
          performanceOrder[b.example.performanceImpact as keyof typeof performanceOrder]
        );
      }
    });
  }, [filteredTransformations, sortBy]);

  // Función para renderizar el badge de rendimiento
  const renderPerformanceBadge = (performance: string) => {
    let color = 'bg-green-900 text-green-300';
    let icon = <Zap className="w-3 h-3 mr-1" />;
    
    if (performance === 'medio') {
      color = 'bg-yellow-900 text-yellow-300';
      icon = <Zap className="w-3 h-3 mr-1" />;
    } else if (performance === 'alto') {
      color = 'bg-red-900 text-red-300';
      icon = <Cpu className="w-3 h-3 mr-1" />;
    }
    
    return (
      <Badge className={`flex items-center ${color} border-none`}>
        {icon}
        {performance}
      </Badge>
    );
  };

  // Renderizar cada fila de transformación
  const renderTransformationRow = (transformation: typeof sortedTransformations[0]) => {
    const isExpanded = expandedTransformation === transformation.id;
    
    return (
      <React.Fragment key={transformation.id}>
        <TableRow className="hover:bg-gray-800/50 cursor-pointer" onClick={() => setExpandedTransformation(isExpanded ? null : transformation.id)}>
          <TableCell className="py-2">
            <Badge className="bg-blue-900 text-blue-300 border-none">
              {transformation.sourceType}
            </Badge>
          </TableCell>
          <TableCell className="py-2">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </TableCell>
          <TableCell className="py-2">
            <Badge className="bg-purple-900 text-purple-300 border-none">
              {transformation.targetType}
            </Badge>
          </TableCell>
          <TableCell className="py-2">
            {renderPerformanceBadge(transformation.example.performanceImpact)}
          </TableCell>
          <TableCell className="py-2">
            <button className="flex items-center text-gray-400 hover:text-white">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </TableCell>
        </TableRow>
        
        {isExpanded && (
          <TableRow className="bg-gray-900">
            <TableCell colSpan={5} className="p-4 border-t-0">
              <div className="rounded-md bg-gray-800 p-3">
                <div className="mb-2 text-sm text-gray-300">
                  <Info className="w-4 h-4 inline mr-1" />
                  {transformation.description}
                </div>
                
                <div className="flex space-x-2 mb-2">
                  <Button 
                    variant={activeTab === 'example' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveTab('example')}
                    className="text-xs"
                  >
                    Ejemplo
                  </Button>
                  <Button 
                    variant={activeTab === 'details' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveTab('details')}
                    className="text-xs"
                  >
                    Detalles técnicos
                  </Button>
                </div>
                
                {activeTab === 'example' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-700 rounded p-2 bg-gray-900">
                      <div className="text-gray-400 text-xs mb-1">Valor original ({transformation.sourceType}):</div>
                      <code className="text-xs break-all block bg-gray-950 p-2 rounded">
                        {transformation.example.before}
                      </code>
                    </div>
                    <div className="border border-gray-700 rounded p-2 bg-gray-900">
                      <div className="text-gray-400 text-xs mb-1">Transformado ({transformation.targetType}):</div>
                      <code className="text-xs break-all block bg-gray-950 p-2 rounded">
                        {transformation.example.after}
                      </code>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-300 space-y-2 bg-gray-900 p-2 rounded">
                    <p>
                      <span className="font-medium text-gray-200">Impacto en rendimiento: </span>
                      <span className={`
                        ${transformation.example.performanceImpact === 'bajo' ? 'text-green-400' : 
                          transformation.example.performanceImpact === 'medio' ? 'text-yellow-400' : 
                          'text-red-400'}
                      `}>
                        {transformation.example.performanceImpact}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-200">Conservación datos: </span>
                      {transformation.example.conservaValores ? (
                        <span className="text-green-400">Alta</span>
                      ) : (
                        <span className="text-yellow-400">Parcial</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium text-gray-200">Tipo origen: </span>
                      <code className="bg-blue-950 text-blue-300 px-1 py-0.5 rounded">{transformation.sourceType}</code>
                    </p>
                    <p>
                      <span className="font-medium text-gray-200">Tipo destino: </span>
                      <code className="bg-purple-950 text-purple-300 px-1 py-0.5 rounded">{transformation.targetType}</code>
                    </p>
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Card className="bg-gray-950 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Sistema de Transformaciones
        </CardTitle>
        <CardDescription className="text-gray-400">
          Visualización de todas las transformaciones de tipos disponibles
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar transformación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 py-1.5 bg-gray-900 border border-gray-800 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-900 border border-gray-800 rounded text-sm py-1.5 px-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="sourceType">Ordenar por tipo origen</option>
              <option value="targetType">Ordenar por tipo destino</option>
              <option value="performance">Ordenar por rendimiento</option>
            </select>
          </div>
          
          <div className="rounded-md border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300 font-medium">Tipo Origen</TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="text-gray-300 font-medium">Tipo Destino</TableHead>
                  <TableHead className="text-gray-300 font-medium">Rendimiento</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransformations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-400">
                      No se encontraron transformaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransformations.map(renderTransformationRow)
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 pt-4">
        <div className="text-xs text-gray-400">
          {sortedTransformations.length} transformaciones disponibles de {transformationsWithExamples.length} total
        </div>
      </CardFooter>
    </Card>
  );
};
