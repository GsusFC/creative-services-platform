'use client';

/**
 * Componente para visualizar el rendimiento histórico con gráficos
 */

import React, { useMemo } from 'react';
import { 
  PerformanceDataPoint, 
  PerformanceTimeRange
} from '@/lib/field-mapper/types';
import { formatTime, formatBytes, formatPercentage } from '@/lib/field-mapper/utils';

interface PerformanceChartsProps {
  performanceHistory: PerformanceDataPoint[];
  timeRange: PerformanceTimeRange;
  onTimeRangeChange: (range: PerformanceTimeRange) => void;
}

export default function PerformanceCharts({
  performanceHistory,
  timeRange,
  onTimeRangeChange
}: PerformanceChartsProps) {
  // Filtrar datos según el rango de tiempo seleccionado
  const filteredData = useMemo(() => {
    const now = Date.now();
    let cutoffTime: number;
    
    switch (timeRange) {
      case '1h':
        cutoffTime = now - 60 * 60 * 1000;
        break;
      case '6h':
        cutoffTime = now - 6 * 60 * 60 * 1000;
        break;
      case '24h':
        cutoffTime = now - 24 * 60 * 60 * 1000;
        break;
      case '7d':
        cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        cutoffTime = now - 24 * 60 * 60 * 1000;
    }
    
    return performanceHistory.filter(point => point.timestamp >= cutoffTime);
  }, [performanceHistory, timeRange]);
  
  // Calcular estadísticas para los datos filtrados
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        validation: { avg: 0, max: 0, min: 0 },
        render: { avg: 0, max: 0, min: 0 },
        api: { avg: 0, max: 0, min: 0 },
        cache: { avg: 0, max: 0, min: 0 },
        memory: { avg: 0, max: 0, min: 0 }
      };
    }
    
    let validationSum = 0, validationMax = 0, validationMin = Infinity;
    let renderSum = 0, renderMax = 0, renderMin = Infinity;
    let apiSum = 0, apiMax = 0, apiMin = Infinity;
    let cacheSum = 0, cacheMax = 0, cacheMin = Infinity;
    let memorySum = 0, memoryMax = 0, memoryMin = Infinity;
    
    filteredData.forEach(point => {
      // Validation time
      validationSum += point.validationTime;
      validationMax = Math.max(validationMax, point.validationTime);
      validationMin = Math.min(validationMin, point.validationTime);
      
      // Render time
      renderSum += point.renderTime;
      renderMax = Math.max(renderMax, point.renderTime);
      renderMin = Math.min(renderMin, point.renderTime);
      
      // API response time
      apiSum += point.apiResponseTime;
      apiMax = Math.max(apiMax, point.apiResponseTime);
      apiMin = Math.min(apiMin, point.apiResponseTime);
      
      // Cache hit rate
      cacheSum += point.cacheHitRate;
      cacheMax = Math.max(cacheMax, point.cacheHitRate);
      cacheMin = Math.min(cacheMin, point.cacheHitRate);
      
      // Memory usage
      memorySum += point.memoryUsage;
      memoryMax = Math.max(memoryMax, point.memoryUsage);
      memoryMin = Math.min(memoryMin, point.memoryUsage);
    });
    
    const count = filteredData.length;
    
    return {
      validation: {
        avg: validationSum / count,
        max: validationMax,
        min: validationMin === Infinity ? 0 : validationMin
      },
      render: {
        avg: renderSum / count,
        max: renderMax,
        min: renderMin === Infinity ? 0 : renderMin
      },
      api: {
        avg: apiSum / count,
        max: apiMax,
        min: apiMin === Infinity ? 0 : apiMin
      },
      cache: {
        avg: cacheSum / count,
        max: cacheMax,
        min: cacheMin === Infinity ? 0 : cacheMin
      },
      memory: {
        avg: memorySum / count,
        max: memoryMax,
        min: memoryMin === Infinity ? 0 : memoryMin
      }
    };
  }, [filteredData]);
  
  // Preparar datos para los gráficos
  const chartData = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        validation: [],
        render: [],
        api: [],
        cache: [],
        memory: []
      };
    }
    
    // Determinar cuántos puntos mostrar (máximo 50 para evitar sobrecarga)
    const step = Math.max(1, Math.floor(filteredData.length / 50));
    const sampledData = filteredData.filter((_, i) => i % step === 0);
    
    return {
      validation: sampledData.map(point => ({
        x: new Date(point.timestamp).toLocaleTimeString(),
        y: point.validationTime
      })),
      render: sampledData.map(point => ({
        x: new Date(point.timestamp).toLocaleTimeString(),
        y: point.renderTime
      })),
      api: sampledData.map(point => ({
        x: new Date(point.timestamp).toLocaleTimeString(),
        y: point.apiResponseTime
      })),
      cache: sampledData.map(point => ({
        x: new Date(point.timestamp).toLocaleTimeString(),
        y: point.cacheHitRate
      })),
      memory: sampledData.map(point => ({
        x: new Date(point.timestamp).toLocaleTimeString(),
        y: point.memoryUsage
      }))
    };
  }, [filteredData]);
  
  // Determinar colores basados en métricas
  const colors = useMemo(() => {
    return {
      validation: stats.avg > 100 ? 'red' : stats.avg > 50 ? 'orange' : 'green',
      render: stats.avg > 50 ? 'red' : stats.avg > 20 ? 'orange' : 'green',
      api: stats.avg > 1000 ? 'red' : stats.avg > 500 ? 'orange' : 'green',
      cache: stats.avg < 0.5 ? 'red' : stats.avg < 0.7 ? 'orange' : 'green',
      memory: stats.avg > 100 * 1024 * 1024 ? 'red' : stats.avg > 50 * 1024 * 1024 ? 'orange' : 'green'
    };
  }, [stats]);
  
  // Función para renderizar un mini gráfico de línea
  const renderMiniChart = (data: Array<{x: string, y: number}>, color: string, height: number = 50) => {
    if (data?.length < 2) {
      return (
        <div className="h-12 flex items-center justify-center text-gray-400">
          Datos insuficientes
        </div>
      );
    }
    
    const maxValue = Math.max(...data?.map(d => d.y));
    const minValue = Math.min(...data?.map(d => d.y));
    const range = maxValue - minValue;
    
    const points = data?.map((point, index) => {
      const x = (index / (data?.length - 1)) * 100;
      const y = range === 0 ? 50 : 100 - (((point.y - minValue) / range) * 100);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="relative h-12">
        <svg width="100%" height={height} className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rendimiento histórico</h3>
        
        <div className="flex space-x-2">
          {(['1h', '6h', '24h', '7d', '30d'] as PerformanceTimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-2 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {filteredData.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500">
          No hay datos de rendimiento disponibles para el período seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tiempo de validación */}
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Tiempo de validación</h4>
                <p className="text-sm text-gray-500">Tiempo promedio para validar tipos</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  colors.validation === 'red' 
                    ? 'text-red-600' 
                    : colors.validation === 'orange' 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  {formatTime(stats.validation.avg)}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {formatTime(stats.validation.min)} / Max: {formatTime(stats.validation.max)}
                </div>
              </div>
            </div>
            {renderMiniChart(chartData.validation, colors.validation)}
          </div>
          
          {/* Tiempo de renderizado */}
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Tiempo de renderizado</h4>
                <p className="text-sm text-gray-500">Tiempo promedio de renderizado UI</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  colors.render === 'red' 
                    ? 'text-red-600' 
                    : colors.render === 'orange' 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  {formatTime(stats.render.avg)}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {formatTime(stats.render.min)} / Max: {formatTime(stats.render.max)}
                </div>
              </div>
            </div>
            {renderMiniChart(chartData.render, colors.render)}
          </div>
          
          {/* Tiempo de respuesta API */}
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Tiempo de respuesta API</h4>
                <p className="text-sm text-gray-500">Tiempo promedio de respuesta de API</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  colors.api === 'red' 
                    ? 'text-red-600' 
                    : colors.api === 'orange' 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  {formatTime(stats.api.avg)}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {formatTime(stats.api.min)} / Max: {formatTime(stats.api.max)}
                </div>
              </div>
            </div>
            {renderMiniChart(chartData.api, colors.api)}
          </div>
          
          {/* Tasa de aciertos de caché */}
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Tasa de aciertos de caché</h4>
                <p className="text-sm text-gray-500">Porcentaje de aciertos en caché</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  colors.cache === 'red' 
                    ? 'text-red-600' 
                    : colors.cache === 'orange' 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  {formatPercentage(stats.cache.avg)}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {formatPercentage(stats.cache.min)} / Max: {formatPercentage(stats.cache.max)}
                </div>
              </div>
            </div>
            {renderMiniChart(chartData.cache, colors.cache)}
          </div>
          
          {/* Uso de memoria */}
          <div className="bg-white border rounded-md p-4 shadow-sm md:col-span-2">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Uso de memoria</h4>
                <p className="text-sm text-gray-500">Uso de memoria JavaScript</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  colors.memory === 'red' 
                    ? 'text-red-600' 
                    : colors.memory === 'orange' 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  {formatBytes(stats.memory.avg)}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {formatBytes(stats.memory.min)} / Max: {formatBytes(stats.memory.max)}
                </div>
              </div>
            </div>
            {renderMiniChart(chartData.memory, colors.memory)}
          </div>
        </div>
      )}
    </div>
  );
}
