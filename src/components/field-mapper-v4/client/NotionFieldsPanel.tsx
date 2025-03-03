'use client';

/**
 * Panel de Campos de Notion
 * 
 * Muestra todos los campos disponibles en una base de datos de Notion
 */

import { NotionField, FieldMapping } from '@/lib/field-mapper-v4/types';

interface NotionFieldsPanelProps {
  fields: NotionField[];
  mappings: FieldMapping[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDatabaseChangeAction: (databaseId: string) => void;
  selectedDatabaseId: string | null;
}

export default function NotionFieldsPanel({
  fields,
  mappings,
  onDatabaseChangeAction,
  selectedDatabaseId,
}: NotionFieldsPanelProps) {
  // Comprobar si hay campos mapeados
  const mappedFieldsCount = mappings.length;
  
  return (
    <div className="h-full">
      <h2 className="text-lg font-medium text-teal-400 font-mono border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
        Campos de Notion
      </h2>
      
      {fields.length > 0 ? (
        <>
          {/* Información sobre campos mapeados */}
          <div className="flex justify-end text-xs text-white/70 font-mono mb-3">
            <span>{mappedFieldsCount} campos mapeados</span>
          </div>
          
          {/* Lista de campos */}
          <div className="overflow-y-auto space-y-2 pr-1 max-h-[calc(100vh-240px)]">
            {fields.map(field => {
              const isMapped = mappings.some(mapping => mapping.notionFieldId === field.id);
              return (
                <div 
                  key={field.id}
                  className={`
                    relative p-3 rounded-lg
                    ${field.type === 'title' ? 'bg-black/40 border-l-4 border-l-amber-500/70 border-t border-r border-b border-white/10' : 'bg-black/40 border border-white/10'} 
                    hover:bg-white/5
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center min-w-0">
                      <span className={`w-2 h-2 mr-2 rounded-full ${isMapped ? 'bg-teal-400' : 'bg-white/30'}`}></span>
                      <span className="text-sm font-mono text-white/90 truncate">{field.name}</span>
                    </div>
                    <div className="flex shrink-0 ml-2">
                      <span className="text-xs px-1.5 py-0.5 bg-black/40 border border-white/10 text-white/70 rounded font-mono">{field.type}</span>
                      {isMapped && (
                        <span className="text-xs px-1.5 py-0.5 bg-teal-500/20 text-teal-400 rounded font-mono ml-1.5">
                          Mapeado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : selectedDatabaseId ? (
        <div className="text-center py-8 bg-black/40 border border-white/10 rounded-lg p-4">
          <p className="text-white/60 font-mono">No hay campos disponibles en esta base de datos.</p>
        </div>
      ) : (
        <div className="text-center py-8 bg-black/40 border border-white/10 rounded-lg p-4">
          <p className="text-white/60 font-mono">Selecciona una base de datos para ver sus campos.</p>
        </div>
      )}
    </div>
  );
}
