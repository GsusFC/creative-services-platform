/**
 * Componente para configurar las opciones de optimización del Field Mapper
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Gauge, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { FieldMapperConfig } from '@/lib/field-mapper/types';
import { transformationCache, CacheSettings } from '@/lib/field-mapper-v4/cache';
import { 
  Recommendation, 
  RecommendationImpact, 
  RecommendationType,
  analyzeResults
} from '@/lib/field-mapper-v4/optimization';
import { BenchmarkResult } from '@/lib/field-mapper-v4/benchmark';

interface OptimizationSettingsProps {
  config: FieldMapperConfig;
  onConfigChange: (newConfig: Partial<FieldMapperConfig>) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  benchmarkResults?: BenchmarkResult[];
}

export default function OptimizationSettings({
  config,
  onConfigChange,
  isExpanded,
  onToggleExpand,
  benchmarkResults = []
}: OptimizationSettingsProps) {
  // Estado local para la configuración del caché V4
  const [cacheConfig, setCacheConfig] = useState<CacheSettings>(
    transformationCache.getSettings()
  );
  
  // Estado para recomendaciones
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  // Actualizar el estado con la configuración actual
  useEffect(() => {
    setCacheConfig(transformationCache.getSettings());
  }, []);
  
  // Procesar resultados de benchmark para generar recomendaciones
  useEffect(() => {
    if (benchmarkResults.length > 0) {
      const analysis = analyzeResults(benchmarkResults);
      setRecommendations(analysis.recommendations);
    }
  }, [benchmarkResults]);
  
  // Manejar cambios en la configuración de Field Mapper
  const handleToggle = (key: keyof FieldMapperConfig) => {
    if (typeof config[key] === 'boolean') {
      onConfigChange({ [key]: !config[key] });
    }
  };
  
  // Manejar cambios en valores numéricos
  const handleNumberChange = (key: keyof FieldMapperConfig, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && typeof config[key] === 'number') {
      onConfigChange({ [key]: numValue });
    }
  };
  
  // Aplicar configuración al caché V4
  const handleApplyCacheSettings = () => {
    transformationCache.updateSettings(cacheConfig);
    
    // También actualizamos la configuración del Field Mapper
    onConfigChange({
      cacheEnabled: cacheConfig.enabled,
      cacheTTL: cacheConfig.ttl,
      cacheMaxSize: cacheConfig.capacity
    });
  };
  
  // Manejar cambios en la configuración del caché V4
  const handleCacheConfigChange = (key: keyof CacheSettings, value: any) => {
    setCacheConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Aplicar una recomendación específica
  const handleApplyRecommendation = (recommendation: Recommendation) => {
    if (!recommendation.suggestedValue) return;
    
    // Actualizar la configuración local
    if (recommendation.type === RecommendationType.INCREASE_CAPACITY || 
        recommendation.type === RecommendationType.DECREASE_CAPACITY) {
      setCacheConfig(prev => ({
        ...prev,
        capacity: recommendation.suggestedValue || prev.capacity
      }));
    } else if (recommendation.type === RecommendationType.INCREASE_TTL || 
               recommendation.type === RecommendationType.DECREASE_TTL) {
      setCacheConfig(prev => ({
        ...prev,
        ttl: recommendation.suggestedValue || prev.ttl
      }));
    }
  };
  
  // Reiniciar a valores predeterminados
  const handleResetToDefaults = () => {
    setCacheConfig({
      enabled: true,
      capacity: 500,
      ttl: 30 * 60 * 1000 // 30 minutos
    });
  };
  
  // Generar color para badge de impacto
  const getImpactColor = (impact: RecommendationImpact): string => {
    switch (impact) {
      case RecommendationImpact.HIGH:
        return 'bg-green-600 hover:bg-green-700';
      case RecommendationImpact.MEDIUM:
        return 'bg-blue-600 hover:bg-blue-700';
      case RecommendationImpact.LOW:
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };
  
  return (
    <div className="bg-white border rounded-md shadow-sm overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
        onClick={onToggleExpand}
      >
        <div className="flex items-center space-x-2">
          <Gauge className="text-blue-500 h-5 w-5" />
          <h3 className="font-medium">Configuración de optimización</h3>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? (
            <svg xmlns="http://www.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Panel superior con recomendaciones */}
          {recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="text-blue-500 h-5 w-5" />
                <h4 className="font-medium">Recomendaciones de optimización</h4>
              </div>
              
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-blue-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getImpactColor(rec.impact)}>
                          {rec.impact === RecommendationImpact.HIGH ? 'Alto' : 
                           rec.impact === RecommendationImpact.MEDIUM ? 'Medio' : 'Bajo'}
                        </Badge>
                        <span className="font-medium text-sm">{rec.transformationName || 'General'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    
                    {rec.suggestedValue && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleApplyRecommendation(rec)}
                        className="whitespace-nowrap"
                      >
                        Aplicar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opciones de caché V4 */}
            <div className="space-y-5">
              <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                <span>Opciones de caché avanzado</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Esta configuración afecta al sistema de caché V4,
                        que proporciona un rendimiento optimizado para transformaciones.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cache-enabled" className="flex items-center gap-2 cursor-pointer">
                    <span>Habilitar caché</span>
                  </Label>
                  <Switch
                    id="cache-enabled"
                    checked={cacheConfig.enabled}
                    onCheckedChange={(checked) => handleCacheConfigChange('enabled', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="cache-capacity">
                      Capacidad máxima: {cacheConfig.capacity} entradas
                    </Label>
                  </div>
                  <Slider
                    id="cache-capacity"
                    min={50}
                    max={2000}
                    step={50}
                    value={[cacheConfig.capacity]}
                    onValueChange={(value) => handleCacheConfigChange('capacity', value[0])}
                    disabled={!cacheConfig.enabled}
                    className={cacheConfig.enabled ? '' : 'opacity-50'}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="cache-ttl">
                      Tiempo de vida: {Math.round(cacheConfig.ttl / 1000 / 60)} minutos
                    </Label>
                  </div>
                  <Slider
                    id="cache-ttl"
                    min={1}
                    max={120}
                    step={1}
                    value={[Math.round(cacheConfig.ttl / 1000 / 60)]}
                    onValueChange={(value) => handleCacheConfigChange('ttl', value[0] * 60 * 1000)}
                    disabled={!cacheConfig.enabled}
                    className={cacheConfig.enabled ? '' : 'opacity-50'}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleResetToDefaults}
                >
                  Restablecer
                </Button>
                <Button 
                  onClick={handleApplyCacheSettings}
                  size="sm"
                >
                  Aplicar configuración
                </Button>
              </div>
            </div>
            
            {/* Opciones de rendimiento generales */}
            <div className="space-y-5">
              <h4 className="font-medium text-sm text-gray-700">Opciones de rendimiento</h4>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-worker" className="flex items-center gap-2 cursor-pointer">
                    <span>Habilitar Web Worker</span>
                    <span className="text-xs text-gray-500">(Evita bloqueos)</span>
                  </Label>
                  <Switch
                    id="toggle-worker"
                    checked={config?.workerEnabled}
                    onCheckedChange={() => handleToggle('workerEnabled')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-virtualization" className="flex items-center gap-2 cursor-pointer">
                    <span>Habilitar virtualización</span>
                    <span className="text-xs text-gray-500">(Listas grandes)</span>
                  </Label>
                  <Switch
                    id="toggle-virtualization"
                    checked={config?.virtualizationEnabled}
                    onCheckedChange={() => handleToggle('virtualizationEnabled')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-debug" className="flex items-center gap-2 cursor-pointer">
                    <span>Modo depuración</span>
                    <span className="text-xs text-gray-500">(Registros detallados)</span>
                  </Label>
                  <Switch
                    id="toggle-debug"
                    checked={config?.debugMode}
                    onCheckedChange={() => handleToggle('debugMode')}
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Recomendación</p>
                    <p className="mt-1">
                      Para volúmenes pequeños de datos, recomendamos mantener el caché 
                      habilitado con un tamaño moderado (500-1000 entradas) para un 
                      equilibrio óptimo entre rendimiento y uso de memoria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
