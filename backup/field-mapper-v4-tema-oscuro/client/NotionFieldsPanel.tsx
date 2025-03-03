'use client';

/**
 * Panel de Campos de Notion
 * 
 * Muestra todos los campos disponibles en una base de datos de Notion
 * y permite filtrarlos por nombre o tipo
 */

import { useState, useEffect } from 'react';
import { NotionField, FieldMapping } from '@/lib/field-mapper-v4/types';

interface NotionFieldsPanelProps {
  fields: NotionField[];
  mappings: FieldMapping[];
  onDatabaseChangeAction: (databaseId: string) => void;
  selectedDatabaseId: string | null;
}

type NotionDatabase = {
  id: string;
  name: string;
};

// Función para obtener las bases de datos de Notion (simulada)
const fetchNotionDatabases = async (): Promise<NotionDatabase[]> => {
  // En una implementación real, esto se conectaría a la API de Notion
  // Por ahora, devolvemos datos de ejemplo
  return [
    { id: 'database_1', name: 'Case Studies' },
    { id: 'database_2', name: 'Proyectos' },
    { id: 'database_3', name: 'Clientes' },
    { id: 'database_4', name: 'Marketing' },
  ];
};

export default function NotionFieldsPanel({
  fields,
  mappings,
  onDatabaseChangeAction,
  selectedDatabaseId,
}: NotionFieldsPanelProps) {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(true);
  
  // Obtener bases de datos disponibles
  useEffect(() => {
    const loadDatabases = async () => {
      try {
        const dbs = await fetchNotionDatabases();
        setDatabases(dbs);
      } catch (error) {
        console.error('Error cargando bases de datos:', error);
      } finally {
        setIsLoadingDatabases(false);
      }
    };
    
    loadDatabases();
  }, []);
  
  // Filtrar campos según búsqueda y tipo
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? field.type === selectedType : true;
    return matchesSearch && matchesType;
  });
  
  // Obtener tipos únicos para el filtro
  const uniqueTypes = [...new Set(fields.map(field => field.type))].sort();
  
  // Verificar si un campo está mapeado
  const isFieldMapped = (fieldId: string) => {
    return mappings.some(mapping => mapping.notionFieldId === fieldId);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white mb-4">Campos de Notion</h2>
      
      {/* Selector de base de datos */}
      <div className="mb-4">
        <label htmlFor="database-select" className="block text-sm font-medium mb-1 text-gray-300">
          Base de datos de Notion
        </label>
        
        {isLoadingDatabases ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-300">Cargando bases de datos...</span>
          </div>
        ) : (
          <select
            id="database-select"
            value={selectedDatabaseId || ''}
            onChange={(e) => onDatabaseChangeAction(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una base de datos</option>
            {databases.map(db => (
              <option key={db.id} value={db.id}>
                {db.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {fields.length > 0 ? (
        <>
          {/* Filtros */}
          <div className="mb-4 space-y-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar campo..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="text">Texto</option>
              <option value="number">Número</option>
              <option value="select">Select</option>
              <option value="multi_select">Multi Select</option>
              <option value="date">Fecha</option>
              <option value="checkbox">Checkbox</option>
              <option value="url">URL</option>
              <option value="email">Email</option>
              <option value="phone_number">Teléfono</option>
              <option value="formula">Fórmula</option>
              <option value="relation">Relación</option>
              <option value="files">Archivos</option>
            </select>
          </div>
          
          {/* Lista de campos */}
          <div className="space-y-2">
            {filteredFields.map((field) => {
              const isMapped = mappings.some(mapping => mapping.notionFieldId === field.id);
              return (
                <div 
                  key={field.id}
                  className={`p-3 rounded-md border ${
                    isMapped 
                      ? 'bg-blue-900/20 border-blue-800' 
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-white">{field.name}</h3>
                      <p className="text-xs text-gray-400">Tipo: {field.type}</p>
                    </div>
                    {isMapped && (
                      <span className="px-2 py-1 text-xs bg-blue-900 text-blue-200 rounded">
                        Mapeado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : selectedDatabaseId ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No hay campos disponibles en esta base de datos.</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">Selecciona una base de datos para ver sus campos.</p>
        </div>
      )}
    </div>
  );
}
