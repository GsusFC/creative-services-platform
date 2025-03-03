'use client';

/**
 * Panel de Optimización
 * 
 * Componente que muestra recomendaciones de optimización basadas
 * en los resultados de benchmarks y proporciona controles para aplicarlas.
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Recommendation,
  RecommendationType,
  RecommendationImpact,
  OptimizationSummary,
  analyzeResults,
  applyRecommendedSettings,
  autoOptimize
} from '@/lib/field-mapper-v4/optimization';
import { BenchmarkResult } from '@/lib/field-mapper-v4/benchmark';
import { transformationCache, CacheSettings } from '@/lib/field-mapper-v4/cache';
import ExportResultsButton from './ExportResultsButton';

interface OptimizationPanelProps {
  benchmarkResults: BenchmarkResult[];
  onSettingsChanged?: () => void;
  className?: string;
}

export default function OptimizationPanel({ 
  benchmarkResults,
  onSettingsChanged,
  className = ''
}: OptimizationPanelProps) {
  // Estado para el análisis
  const [analysis, setAnalysis] = useState<OptimizationSummary | null>(null);
  
  // Estado para la configuración actual
  const [cacheSettings, setCacheSettings] = useState<CacheSettings>(() => 
    transformationCache.getSettings()
  );
  
  // Control de edición
  const [editing, setEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<CacheSettings>(cacheSettings);
  
  // Analizar resultados cuando cambian
  useEffect(() => {
    if (benchmarkResults.length > 0) {
      const newAnalysis = analyzeResults(benchmarkResults);
      setAnalysis(newAnalysis);
    }
  }, [benchmarkResults]);
  
  // Aplicar configuración automática
  const handleAutoOptimize = () => {
    if (benchmarkResults.length > 0) {
      const updatedSettings = autoOptimize(benchmarkResults);
      setCacheSettings(updatedSettings);
      if (onSettingsChanged) {
        onSettingsChanged();
      }
    }
  };
  
  // Aplicar recomendación específica
  const handleApplyRecommendation = (recommendation: Recommendation) => {
    if (!recommendation.suggestedValue) return;
    
    const newSettings: Partial<CacheSettings> = {};
    
    switch (recommendation.type) {
      case RecommendationType.INCREASE_CAPACITY:
      case RecommendationType.DECREASE_CAPACITY:
        newSettings.capacity = recommendation.suggestedValue;
        break;
      case RecommendationType.INCREASE_TTL:
      case RecommendationType.DECREASE_TTL:
        newSettings.ttl = recommendation.suggestedValue;
        break;
    }
    
    applyRecommendedSettings(newSettings);
    setCacheSettings(transformationCache.getSettings());
    
    if (onSettingsChanged) {
      onSettingsChanged();
    }
  };
  
  // Iniciar edición manual
  const handleStartEditing = () => {
    setEditedSettings({...cacheSettings});
    setEditing(true);
  };
  
  // Guardar configuración editada
  const handleSaveSettings = () => {
    applyRecommendedSettings(editedSettings);
    setCacheSettings(transformationCache.getSettings());
    setEditing(false);
    
    if (onSettingsChanged) {
      onSettingsChanged();
    }
  };
  
  // Cancelar edición
  const handleCancelEditing = () => {
    setEditing(false);
  };
  
  // Actualizar configuración editada
  const handleUpdateSetting = (key: keyof CacheSettings, value: any) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Renderizar badge de impacto
  const renderImpactBadge = (impact: RecommendationImpact) => {
    const variants: Record<RecommendationImpact, 'default' | 'secondary' | 'outline'> = {
      [RecommendationImpact.HIGH]: 'default',
      [RecommendationImpact.MEDIUM]: 'secondary',
      [RecommendationImpact.LOW]: 'outline'
    };
    
    return (
      <Badge variant={variants[impact]}>
        {impact === RecommendationImpact.HIGH ? 'Alto impacto' : 
         impact === RecommendationImpact.MEDIUM ? 'Impacto medio' : 
         'Bajo impacto'}
      </Badge>
    );
  };
  
  if (!analysis) {
    return (
      <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
        <p className="text-gray-500 text-center">
          Ejecute un benchmark para ver recomendaciones de optimización
        </p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumen general */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Resumen de rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Mejora promedio con caché</div>
                <div className="text-2xl font-bold mt-1">
                  {analysis.overallPerformance.averageImprovement.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Mejor transformación</div>
                <div className="text-base font-semibold mt-1 truncate">
                  {analysis.overallPerformance.bestTransformationName}
                </div>
                <div className="text-sm text-green-600">
                  +{analysis.overallPerformance.bestImprovement.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Configuración actual de caché</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Capacidad:</span>
                  <span className="ml-2">{cacheSettings.capacity} entradas</span>
                </div>
                <div>
                  <span className="text-gray-500">TTL:</span>
                  <span className="ml-2">{Math.round(cacheSettings.ttl / 1000 / 60)} min</span>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <span className="ml-2">{cacheSettings.enabled ? 'Activado' : 'Desactivado'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Formulario de edición */}
      {editing && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Editar configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad (entradas)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={editedSettings.capacity}
                    min={50}
                    max={10000}
                    onChange={(e) => handleUpdateSetting('capacity', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ttl">TTL (minutos)</Label>
                  <Input
                    id="ttl"
                    type="number"
                    value={Math.round(editedSettings.ttl / 1000 / 60)}
                    min={1}
                    max={1440} // 24 horas
                    onChange={(e) => handleUpdateSetting('ttl', parseInt(e.target.value) * 60 * 1000)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={editedSettings.enabled}
                    onCheckedChange={(checked) => handleUpdateSetting('enabled', checked)}
                  />
                  <Label htmlFor="enabled">Caché habilitado</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelEditing}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSettings}>
              Guardar cambios
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Recomendaciones */}
      <Card className="w-full">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recomendaciones de Optimización</CardTitle>
            {analysis && (
              <p className="text-sm text-muted-foreground mt-1">
                {analysis.recommendations.length} recomendaciones disponibles
              </p>
            )}
          </div>
          <ExportResultsButton 
            {...{ results: benchmarkResults, analysis }} 
          />
        </CardHeader>
        <CardContent>
          {analysis.recommendations.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No hay recomendaciones disponibles en este momento
            </p>
          ) : (
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation, index) => (
                <Alert key={index} className="relative">
                  <div className="absolute top-2 right-2">
                    {renderImpactBadge(recommendation.impact)}
                  </div>
                  <AlertTitle className="text-base mb-2">
                    {recommendation.transformationName 
                      ? `Optimizar: ${recommendation.transformationName}`
                      : recommendation.type === RecommendationType.INCREASE_CAPACITY
                      ? 'Aumentar capacidad de caché'
                      : recommendation.type === RecommendationType.DECREASE_CAPACITY
                      ? 'Reducir capacidad de caché'
                      : recommendation.type === RecommendationType.INCREASE_TTL
                      ? 'Aumentar tiempo de vida (TTL)'
                      : recommendation.type === RecommendationType.DECREASE_TTL
                      ? 'Reducir tiempo de vida (TTL)'
                      : 'Optimización recomendada'
                    }
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    <div className="mt-2">
                      {recommendation.description}
                    </div>
                    
                    {recommendation.currentValue !== undefined && recommendation.suggestedValue !== undefined && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span>Valor actual: {recommendation.currentValue}</span>
                        <span className="mx-2">→</span>
                        <span>Valor recomendado: {recommendation.suggestedValue}</span>
                      </div>
                    )}
                    
                    {recommendation.suggestedValue && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mt-3"
                        onClick={() => handleApplyRecommendation(recommendation)}
                      >
                        Aplicar esta recomendación
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleStartEditing}
            disabled={editing}
          >
            Editar manualmente
          </Button>
          <Button 
            onClick={handleAutoOptimize}
            disabled={analysis.recommendations.length === 0}
          >
            Auto-optimizar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
