'use client';

/**
 * Estadísticas de Caché
 * 
 * Componente para visualizar el rendimiento del sistema de caché
 * de transformaciones.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTransformations } from '@/lib/field-mapper-v4/hooks';
import { CacheStats as ICacheStats } from '@/lib/field-mapper-v4/cache';

interface CacheStatsProps {
  refreshInterval?: number; // Intervalo en ms para refrescar automáticamente
  className?: string;
}

export default function CacheStats({
  refreshInterval = 5000,
  className = '',
}: CacheStatsProps) {
  const { getCacheStats, clearCache } = useTransformations();
  const [stats, setStats] = useState<ICacheStats>({
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    capacity: 500,
  });

  // Refrescar estadísticas periódicamente
  useEffect(() => {
    // Actualizar inicialmente
    setStats(getCacheStats());
    
    // Configurar intervalo
    const interval = setInterval(() => {
      setStats(getCacheStats());
    }, refreshInterval);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [getCacheStats, refreshInterval]);

  // Manejar clic en botón de limpiar caché
  const handleClearCache = () => {
    clearCache();
    setStats(getCacheStats());
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Estadísticas de Caché</CardTitle>
          <Button 
            onClick={handleClearCache} 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            Limpiar caché
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Tamaño de caché */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Tamaño</div>
            <div className="text-xl font-medium">{stats.size}</div>
            <div className="text-xs text-gray-400 mt-1">entradas</div>
          </div>
          
          {/* Tasa de aciertos */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Tasa de aciertos</div>
            <div className="text-xl font-medium">
              {(stats.hitRate * 100).toFixed(1)}%
              <HitRateBadge hitRate={stats.hitRate} />
            </div>
          </div>
          
          {/* Aciertos */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Aciertos</div>
            <div className="text-xl font-medium">{stats.hits}</div>
          </div>
          
          {/* Fallos */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Fallos</div>
            <div className="text-xl font-medium">{stats.misses}</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p className="mb-1">
            Última actualización: {new Date().toLocaleTimeString()}
          </p>
          <p>
            El sistema de caché ayuda a optimizar el rendimiento almacenando 
            los resultados de transformaciones frecuentes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Badge para indicar la calidad de la tasa de aciertos
function HitRateBadge({ hitRate }: { hitRate: number }) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline';
  let label: string;
  
  if (hitRate >= 0.8) {
    variant = 'default'; // verde - bueno
    label = 'Excelente';
  } else if (hitRate >= 0.6) {
    variant = 'secondary'; // gris - medio
    label = 'Bueno';
  } else if (hitRate >= 0.3) {
    variant = 'outline'; // sin fondo - bajo
    label = 'Regular';
  } else {
    variant = 'destructive'; // rojo - malo
    label = 'Bajo';
  }
  
  // No mostrar nada si no hay suficientes datos
  if (hitRate === 0) return null;
  
  return (
    <Badge 
      variant={variant} 
      className="ml-2 text-[0.65rem] h-4 px-1"
    >
      {label}
    </Badge>
  );
}
