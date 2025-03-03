'use client';

/**
 * Field Mapper V4
 * 
 * Componente principal que integra los paneles de Notion y Case Study,
 * permitiendo al usuario mapear campos entre ambos.
 */

import { useState, useEffect } from 'react';
import { CaseStudyField, FieldMapping, NotionField, FieldMapperConfig } from '@/lib/field-mapper-v4/types';
import { saveFieldMapperConfig, fetchNotionFields, fetchCaseStudyStructure, loadFieldMapperConfig } from '@/lib/field-mapper-v4/actions';
import NotionFieldsPanel from './NotionFieldsPanel';
import CaseStudyStructure from './CaseStudyStructure';
import SummaryPanel from './SummaryPanel';
import MappingPreview from './MappingPreview';
import PerformanceTab from './PerformanceTab';

export default function FieldMapperV4() {
  // Estados
  const [notionFields, setNotionFields] = useState<NotionField[]>([]);
  const [caseStudyFields, setCaseStudyFields] = useState<CaseStudyField[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPerformanceTools, setShowPerformanceTools] = useState(false);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Obtener estructura del case study (constante)
        const structure = await fetchCaseStudyStructure();
        setCaseStudyFields(structure);
        
        // Si hay un databaseId guardado, cargar esos campos
        const savedConfig = localStorage.getItem('lastDatabaseId');
        if (savedConfig) {
          setSelectedDatabaseId(savedConfig);
          const notionData = await fetchNotionFields(savedConfig);
          setNotionFields(notionData);
          
          // Intentar cargar configuración guardada
          try {
            const config = await loadFieldMapperConfig(savedConfig);
            if (config && config.mappings) {
              setMappings(config.mappings);
            }
          } catch (error) {
            console.error('Error cargando configuración:', error);
          }
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Manejar cambio de database de Notion
  const handleDatabaseChange = async (databaseId: string) => {
    setIsLoading(true);
    setSelectedDatabaseId(databaseId);
    localStorage.setItem('lastDatabaseId', databaseId);
    
    try {
      const fields = await fetchNotionFields(databaseId);
      setNotionFields(fields);
      
      // Reiniciar mapeos o cargar guardados
      try {
        const config = await loadFieldMapperConfig(databaseId);
        if (config && config.mappings) {
          setMappings(config.mappings);
        } else {
          setMappings([]);
        }
      } catch (error) {
        setMappings([]);
      }
    } catch (error) {
      console.error('Error al cargar campos de Notion:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar mapeo de campos
  const handleFieldMapping = (caseStudyFieldId: string, notionFieldId: string) => {
    // Eliminar mapeo existente para este campo de case study
    const updatedMappings = mappings.filter(
      mapping => mapping.caseStudyFieldId !== caseStudyFieldId
    );
    
    // Añadir nuevo mapeo
    if (notionFieldId) {
      updatedMappings.push({
        caseStudyFieldId,
        notionFieldId,
        transformationId: undefined, // Sin transformación inicialmente
      });
    }
    
    setMappings(updatedMappings);
  };
  
  // Manejar asignación de transformación
  const handleSetTransformation = (mapping: FieldMapping, transformationId: string) => {
    const updatedMappings = mappings.map(m => {
      if (m.caseStudyFieldId === mapping.caseStudyFieldId && m.notionFieldId === mapping.notionFieldId) {
        return {
          ...m,
          transformationId
        };
      }
      return m;
    });
    
    setMappings(updatedMappings);
  };
  
  // Guardar configuración de mapeo
  const handleSaveConfig = async () => {
    if (!selectedDatabaseId) return;
    
    // Crear objeto de configuración
    const config: Omit<FieldMapperConfig, 'createdAt' | 'updatedAt'> = {
      id: selectedDatabaseId,
      name: `Configuración para ${selectedDatabaseId}`,
      notionDatabaseId: selectedDatabaseId,
      mappings: mappings
    };
    
    try {
      setIsLoading(true);
      await saveFieldMapperConfig(config);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar configuración');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reiniciar mapeos
  const handleResetMappings = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar todos los mapeos?')) {
      setMappings([]);
    }
  };
  
  // Mostrar previsualización
  const handleShowPreview = () => {
    setShowPreview(true);
  };
  
  // Ocultar previsualización
  const handleClosePreview = () => {
    setShowPreview(false);
  };
  
  // Mostrar/ocultar herramientas de rendimiento
  const handleTogglePerformanceTools = () => {
    setShowPerformanceTools(!showPerformanceTools);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Barra superior */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800">
        <h1 className="text-xl font-bold text-white">Field Mapper V4</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleShowPreview}
            disabled={mappings.length === 0}
            className="py-2 px-4 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previsualizar
          </button>
          <button 
            className="flex items-center space-x-1 border border-gray-700 rounded py-2 px-4 hover:bg-gray-700 text-gray-300"
            onClick={handleTogglePerformanceTools}
          >
            <span>Rendimiento</span>
            <span className="text-xs">
              {showPerformanceTools ? '▲' : '▼'}
            </span>
          </button>
          <button 
            onClick={handleSaveConfig} 
            disabled={!selectedDatabaseId || mappings.length === 0}
            className="py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar mapeo
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="mt-3 text-lg text-white">Cargando...</span>
          </div>
        </div>
      )}

      {/* Contenido principal - Tres columnas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo: Campos de Notion */}
        <div className="w-1/3 h-full p-4 overflow-y-auto border-r border-gray-800 bg-gray-900">
          <NotionFieldsPanel
            fields={notionFields}
            mappings={mappings}
            onDatabaseChangeAction={handleDatabaseChange}
            selectedDatabaseId={selectedDatabaseId}
          />
        </div>
        
        {/* Panel central: Estructura de Case Study */}
        <div className="w-1/3 h-full p-4 overflow-y-auto border-r border-gray-800 bg-gray-900">
          <CaseStudyStructure
            fields={caseStudyFields}
            notionFields={notionFields}
            mappings={mappings}
            onMapField={handleFieldMapping}
            onSetTransformation={handleSetTransformation}
          />
        </div>
        
        {/* Panel derecho: Resumen y acciones */}
        <div className="w-1/3 h-full p-4 overflow-y-auto bg-gray-900">
          <SummaryPanel
            caseStudyFields={caseStudyFields}
            notionFields={notionFields}
            mappings={mappings}
            onSave={handleSaveConfig}
            onReset={handleResetMappings}
          />
          
          {showPerformanceTools && (
            <div className="mt-6 border border-gray-800 p-4 rounded-lg bg-gray-800">
              <h3 className="text-lg font-medium mb-4 text-white">Herramientas de Rendimiento</h3>
              <PerformanceTab />
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de previsualización */}
      {showPreview && (
        <MappingPreview
          caseStudyFields={caseStudyFields}
          notionFields={notionFields}
          mappings={mappings}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
}
