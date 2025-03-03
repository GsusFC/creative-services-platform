'use client';

/**
 * Panel de Información de Transformaciones
 * 
 * Componente que muestra información detallada sobre las transformaciones
 * disponibles en el sistema, con ejemplos y detalles de rendimiento
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FieldType } from '@/lib/field-mapper-v4/types';
import { transformations, Transformation } from '@/lib/field-mapper-v4/transformations';
import { formatFieldType } from '@/lib/field-mapper-v4/utils';
import TransformationVisualizer from './TransformationVisualizer';

interface TransformationInfoPanelProps {
  onClose: () => void;
}

export default function TransformationInfoPanel({
  onClose
}: TransformationInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredTransformations, setFilteredTransformations] = useState<Transformation[]>([]);
  
  // Agrupar transformaciones por tipo de origen
  const transformationsBySourceType = transformations.reduce<Record<string, Transformation[]>>(
    (acc, transformation) => {
      const key = transformation.sourceType;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transformation);
      return acc;
    },
    {}
  );
  
  // Actualizar transformaciones filtradas cuando cambia la pestaña
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredTransformations(transformations);
    } else {
      setFilteredTransformations(transformationsBySourceType[activeTab] || []);
    }
  }, [activeTab]);

  return (
    <div className="bg-white rounded-lg border shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">Transformaciones Disponibles</h2>
        <button
          onClick={onClose}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
          aria-label="Cerrar panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="w-full flex overflow-x-auto mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            {Object.keys(transformationsBySourceType).map(sourceType => (
              <TabsTrigger key={sourceType} value={sourceType}>
                {formatFieldType(sourceType as FieldType)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="max-h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {filteredTransformations.map((transformation) => (
                <div key={transformation.id} className="border rounded-md">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{transformation.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {transformation.description}
                        </p>
                      </div>
                      <PerformanceBadge impact={transformation.performanceImpact} />
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Badge variant="outline">
                        {formatFieldType(transformation.sourceType)}
                      </Badge>
                      <span className="text-gray-400">→</span>
                      <Badge variant="outline">
                        {formatFieldType(transformation.targetType)}
                      </Badge>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <TransformationVisualizer
                      sourceType={transformation.sourceType}
                      targetType={transformation.targetType}
                      transformationId={transformation.id}
                    />
                  </div>
                </div>
              ))}
              
              {filteredTransformations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No hay transformaciones disponibles para este tipo
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componente para mostrar el impacto de rendimiento
function PerformanceBadge({ impact }: { impact: 'low' | 'medium' | 'high' }) {
  const getLabel = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return 'Impacto bajo';
      case 'medium': return 'Impacto medio';
      case 'high': return 'Impacto alto';
      default: return 'Desconocido';
    }
  };
  
  const getVariant = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return 'outline';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };
  
  return (
    <Badge variant={getVariant(impact) as any} className="ml-2">
      {getLabel(impact)}
    </Badge>
  );
}
