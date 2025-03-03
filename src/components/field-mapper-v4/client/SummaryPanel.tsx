'use client';

/**
 * Panel de Resumen
 * 
 * Muestra un resumen del estado de los mapeos y proporciona
 * controles para guardar, previsualizar o reiniciar la configuración
 */

import { useMemo } from 'react';
import { CaseStudyField, FieldMapping, CompatibilityStatus, NotionField } from '@/lib/field-mapper-v4/types';
import { checkFieldCompatibility } from '@/lib/field-mapper-v4/validation';
import CompatibilityIndicator from './CompatibilityIndicator';
import { CheckCircle2, X } from 'lucide-react';

interface SummaryPanelProps {
  caseStudyFields: CaseStudyField[];
  notionFields: NotionField[];
  mappings: FieldMapping[];
  onSave: () => void;
  onResetAction: () => void;
}

export default function SummaryPanel({
  caseStudyFields,
  notionFields,
  mappings,
  onSave,
  onResetAction,
}: SummaryPanelProps) {
  // Calcular estado de configuración
  const isConfigReady = useMemo(() => {
    const requiredCaseStudyFields = caseStudyFields.filter(field => field.required);
    return requiredCaseStudyFields.every(field => 
      mappings.some(mapping => mapping.caseStudyFieldId === field.id)
    );
  }, [caseStudyFields, mappings]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = caseStudyFields.length;
    const mapped = mappings.length;
    const requiredTotal = caseStudyFields.filter(field => field.required).length;
    const requiredMapped = caseStudyFields
      .filter(field => field.required)
      .filter(field => mappings.some(mapping => mapping.caseStudyFieldId === field.id))
      .length;
    
    const transformations = mappings.filter(mapping => mapping.transformationId).length;
    
    return {
      percentComplete: total > 0 ? Math.round((mapped / total) * 100) : 0,
      mapped,
      total,
      requiredMapped,
      requiredTotal,
      transformations,
    };
  }, [caseStudyFields, mappings]);

  return (
    <div className="p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
      <h2 className="text-xl font-medium flex items-center gap-2 text-teal-400 mb-4">
        Resumen de Configuración
      </h2>
      
      {/* Panel de Estado */}
      <div className={`
        mb-6 p-4 border rounded-lg backdrop-blur-sm transition-all duration-300
        ${isConfigReady 
          ? 'bg-black/40 border-green-500/30 shadow-sm shadow-green-500/10' 
          : 'bg-black/40 border-white/10'}
      `}>
        <div className="flex items-center mb-3">
          <div className={`
            w-3 h-3 rounded-full mr-2 transition-colors duration-300
            ${isConfigReady ? 'bg-green-400' : 'bg-yellow-400'}
          `}/>
          <h3 className="text-base font-medium text-white/90">
            {isConfigReady ? 'Configuración Completa' : 'Configuración Pendiente'}
          </h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>Progreso general</span>
            <span>{stats.percentComplete}%</span>
          </div>
          <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out
                ${isConfigReady ? 'bg-green-400' : 'bg-teal-400'}`} 
              style={{ width: `${stats.percentComplete}%` }}
            />
          </div>
        </div>
        
        <ul className="space-y-2 text-sm text-white/80">
          <li className="flex justify-between">
            <span>Campos mapeados:</span>
            <span className={stats.mapped === stats.total ? 'text-green-400' : ''}>
              {stats.mapped}/{stats.total}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Campos requeridos:</span>
            <span className={stats.requiredMapped === stats.requiredTotal ? 'text-green-400' : 'text-amber-400'}>
              {stats.requiredMapped}/{stats.requiredTotal}
            </span>
          </li>
          {stats.transformations > 0 && (
            <li className="flex justify-between">
              <span>Transformaciones aplicadas:</span>
              <span className="text-amber-400">{stats.transformations}</span>
            </li>
          )}
        </ul>
      </div>
      
      {/* Acciones */}
      <div className="space-y-3">
        <button 
          onClick={onSave}
          disabled={!isConfigReady}
          className={`
            w-full py-2.5 px-4 rounded-lg text-white/90 font-medium
            transition-all duration-300 flex items-center justify-center gap-2
            ${isConfigReady 
              ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700' 
              : 'bg-black/40 border border-white/10 text-white/60 cursor-not-allowed'}
          `}
          aria-label="Guardar configuración"
        >
          <CheckCircle2 size={18} />
          Guardar Configuración
          {!isConfigReady && (
            <span className="block text-xs mt-1 text-white/50">
              Completa todos los campos requeridos
            </span>
          )}
        </button>
        
        <button
          onClick={onResetAction}
          className="w-full py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/90 font-medium transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
          aria-label="Reiniciar configuración"
        >
          <X size={18} />
          Reiniciar Configuración
        </button>
      </div>
      
      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-white/90 mb-3">Leyenda</h3>
        <ul className="space-y-2.5 text-xs text-white/70">
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 mr-2.5"></span>
            <span>Compatible directamente</span>
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-2.5"></span>
            <span>Requiere transformación</span>
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-2.5"></span>
            <span>Incompatible</span>
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2.5"></span>
            <span>No mapeado</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
