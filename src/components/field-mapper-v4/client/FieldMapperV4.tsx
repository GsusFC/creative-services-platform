'use client';

/**
 * Field Mapper V4
 * 
 * Componente principal que integra los paneles de Notion y Case Study,
 * permitiendo al usuario mapear campos entre ambos de forma intuitiva.
 * 
 * Mejoras implementadas:
 * - Interfaz de drag & drop para mapeo intuitivo
 * - Indicadores visuales de compatibilidad
 * - Sistema de onboarding para nuevos usuarios
 * - Previsualización en tiempo real
 * - Optimización de rendimiento
 */

import { useState, useEffect } from 'react';
import { CaseStudyField, FieldMapping, NotionField, FieldMapperConfig } from '@/lib/field-mapper-v4/types';
import { saveFieldMapperConfig, fetchNotionFields, fetchCaseStudyStructure, loadFieldMapperConfig } from '@/lib/field-mapper-v4/actions';
import NotionFieldsPanel from './NotionFieldsPanel';
import CaseStudyStructure from './CaseStudyStructure';
import SummaryPanel from './SummaryPanel';
import MappingPreview from './MappingPreview';
import PerformanceTab from './PerformanceTab';
import OnboardingPanel from './OnboardingPanel';
import StatusMessage from './StatusMessage';
import { 
  Eye, 
  Save, 
  BarChart4, 
  RotateCcw, 
  Database, 
  ChevronDown, 
  ChevronUp,
  Zap,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Check,
  AlertTriangle,
  XCircle,
  Table,
  FileText,
  X
} from 'lucide-react';

export default function FieldMapperV4() {
  // Referencias eliminadas para evitar warns "is defined but never used"
  /* 
   * Comentarios para futuras implementaciones:
   * - Implementar drag & drop para mapeo visual
   * - Usar useRef para referencias a elementos DOM
   */
  
  // Estados principales
  const [notionFields, setNotionFields] = useState<NotionField[]>([]);
  const [caseStudyFields, setCaseStudyFields] = useState<CaseStudyField[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPerformanceTools, setShowPerformanceTools] = useState(false);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
  
  // Estados para experiencia de usuario mejorada
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showCompatibilityInfo, setShowCompatibilityInfo] = useState(false);
  const [showTransformationTips, setShowTransformationTips] = useState(false);
  // Estados para funcionalidades planificadas en próximas iteraciones
  /*
   * Funcionalidades pendientes:
   * - Previsualización en tiempo real
   * - Drag & drop entre paneles
   */
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener estructura del case study (constante) con validación
        const structure = await fetchCaseStudyStructure();
        if (Array.isArray(structure) && structure.length > 0) {
          setCaseStudyFields(structure);
        } else {
          console.warn('No se encontró estructura de Case Study o el formato es incorrecto');
          setCaseStudyFields([]);
          setSuccessMessage('Error al cargar la estructura de Case Study. Contacta con soporte.');
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 5000);
        }
        
        // Si hay un databaseId guardado, cargar esos campos
        const savedConfig = localStorage.getItem('lastDatabaseId');
        if (savedConfig) {
          setSelectedDatabaseId(savedConfig);
          
          // Cargar campos de Notion con manejo de errores mejorado
          try {
            const notionData = await fetchNotionFields(savedConfig);
            if (Array.isArray(notionData) && notionData.length > 0) {
              setNotionFields(notionData);
            } else {
              console.warn('No se encontraron campos de Notion o el formato es incorrecto');
              setNotionFields([]);
              setSuccessMessage('No se pudieron cargar los campos de Notion. Verifica tu configuración.');
              setShowSuccessMessage(true);
              setTimeout(() => setShowSuccessMessage(false), 5000);
            }
          } catch (notionError) {
            console.error('Error cargando campos de Notion:', notionError);
            setSuccessMessage('Error al conectar con Notion. Verifica tu API key y permisos.');
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 5000);
          }
          
          // Intentar cargar configuración guardada
          try {
            const config = await loadFieldMapperConfig(savedConfig);
            if (config) {
              // Si hay configuración guardada, cargar los mapeos
              if (config.mappings && Array.isArray(config.mappings)) {
                setMappings(config.mappings);
              }
              
              // Determinar si mostrar onboarding basado en el estado guardado
              // Si hasCompletedOnboarding es undefined o false, mostrar onboarding
              setShowOnboarding(config.hasCompletedOnboarding !== true);
              
              // Si el usuario ya ha completado el onboarding, mostrar un mensaje de bienvenida
              if (config.hasCompletedOnboarding === true) {
                setSuccessMessage('Bienvenido de nuevo al Field Mapper V4');
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
              }
            }
          } catch (error) {
            console.error('Error cargando configuración:', error);
          }
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
      setIsLoading(false);
    };
    
    loadInitialData();
  }, []);
  
  // Manejar cambio de database de Notion con mejor manejo de errores
  const handleDatabaseChange = async (databaseId: string) => {
    try {
      setIsLoading(true);
      setSelectedDatabaseId(databaseId);
      localStorage.setItem('lastDatabaseId', databaseId);
      
      // Mostrar mensaje de carga
      setSuccessMessage('Cargando campos de la base de datos seleccionada...');
      setShowSuccessMessage(true);
      
      // Cargar campos de Notion
      const fields = await fetchNotionFields(databaseId);
      if (Array.isArray(fields) && fields.length > 0) {
        setNotionFields(fields);
        setSuccessMessage('Campos cargados correctamente');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        console.warn('No se encontraron campos en la base de datos seleccionada');
        setNotionFields([]);
        setSuccessMessage('No se encontraron campos en la base de datos seleccionada');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
      
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
  const handleMapFieldAction = (caseStudyFieldId: string, notionFieldId: string | null) => {
    // Eliminar mapeo existente para este campo de case study
    const updatedMappings = mappings.filter(
      mapping => mapping.caseStudyFieldId !== caseStudyFieldId
    );
    
    // Añadir nuevo mapeo solo si notionFieldId no es null
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
      mappings: mappings,
      hasCompletedOnboarding: !showOnboarding // Guardamos el estado de onboarding
    };
    
    try {
      setIsLoading(true);
      // Guardamos la configuración pero no necesitamos el valor de retorno por ahora
      await saveFieldMapperConfig(config);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Configuración guardada correctamente');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setSuccessMessage(`Error al guardar configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
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
    setShowPerformanceTools(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-black to-gray-950 text-white/90 overflow-hidden absolute inset-0">
      {/* Barra superior */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium text-teal-400 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Field Mapper V4
          </h1>
          <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-teal-500/80 to-emerald-500/80 text-white rounded-full font-medium">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShowPreview}
            disabled={mappings.length === 0}
            className="flex items-center gap-2 py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-white/90 hover:bg-white/10 hover:border-teal-500/50 hover:text-teal-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            aria-label="Previsualizar mapeo"
          >
            <Eye className="h-4 w-4" />
            <span>Previsualizar</span>
          </button>
          <button 
            className="flex items-center gap-2 py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-white/90 hover:bg-white/10 hover:border-purple-500/50 hover:text-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            onClick={handleTogglePerformanceTools}
            aria-label="Mostrar herramientas de rendimiento"
          >
            <BarChart4 className="h-4 w-4" />
            <span>Rendimiento</span>
            {showPerformanceTools ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </button>
          <button 
            onClick={handleSaveConfig} 
            disabled={!selectedDatabaseId || mappings.length === 0}
            className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-teal-500/80 to-emerald-500/80 hover:from-teal-500/90 hover:to-emerald-500/90 rounded-lg text-white font-medium shadow-[0_0_10px_rgba(20,184,166,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:from-teal-500/30 disabled:to-emerald-500/30 disabled:shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            aria-label="Guardar configuración de mapeo"
          >
            <Save className="h-4 w-4" />
            <span>Guardar</span>
          </button>
          <button 
            onClick={handleResetMappings}
            disabled={mappings.length === 0}
            className="flex items-center gap-2 py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Reiniciar mapeos"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm w-screen h-screen">
          <div className="flex flex-col items-center bg-black/80 p-8 rounded-xl border border-white/10 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
            <div className="w-12 h-12 border-4 border-t-teal-400 border-r-teal-400/30 border-b-teal-400/10 border-l-teal-400/30 rounded-full animate-spin"></div>
            <span className="mt-4 text-lg text-white/90">Cargando...</span>
          </div>
        </div>
      )}

      {/* Panel de selección de base de datos (si no hay una seleccionada) */}
      {!selectedDatabaseId && !isLoading && (
        <div className="flex-1 flex items-center justify-center w-full p-6">
          <div className="bg-black/60 border border-white/10 rounded-xl p-8 max-w-lg w-full shadow-[0_0_30px_rgba(20,184,166,0.15)]">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-teal-400">
              <Database className="h-6 w-6" />
              Selecciona una base de datos
            </h2>
            <p className="text-white/70 mb-6">
              Para comenzar, selecciona una base de datos de Notion que contenga los datos que deseas mapear para tus Case Studies.
            </p>
            <div className="bg-black/40 p-5 rounded-lg border border-white/10">
              <h3 className="text-base font-medium text-white/90 mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-teal-400" />
                Bases de datos disponibles
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleDatabaseChange("notion_database_1")}
                  className="w-full p-4 text-left bg-white/5 hover:bg-white/10 text-white/90 rounded-lg border border-white/10 transition-all hover:border-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 group"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Table className="h-4 w-4 text-teal-400 group-hover:text-teal-300 transition-colors" />Portfolio de proyectos</span>
                  <p className="text-xs text-white/70 mt-1 font-geist-mono">Base de datos principal de proyectos</p>
                </button>
                <button
                  onClick={() => handleDatabaseChange("notion_database_2")}
                  className="w-full p-4 text-left bg-white/5 hover:bg-white/10 text-white/90 rounded-lg border border-white/10 transition-all hover:border-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 group"
                >
                  <span className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-400 group-hover:text-teal-300 transition-colors" />
                    Casos de estudio
                  </span>
                  <p className="text-xs text-white/70 mt-1">Base de datos de casos de estudio completos</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Onboarding */}
      {showOnboarding && (
        <OnboardingPanel
          currentStep={onboardingStep}
          totalSteps={5}
          onCloseAction={() => setShowOnboarding(false)}
          onNextAction={() => setOnboardingStep(prev => Math.min(prev + 1, 5))}
          onPreviousAction={() => setOnboardingStep(prev => Math.max(prev - 1, 1))}
          onCompleteAction={async () => {
            setShowOnboarding(false);
            // Guardar que el usuario ha completado el onboarding
            if (selectedDatabaseId) {
              try {
                // Crear objeto de configuración con onboarding completado
                const config: Omit<FieldMapperConfig, 'createdAt' | 'updatedAt'> = {
                  id: selectedDatabaseId,
                  name: `Configuración para ${selectedDatabaseId}`,
                  notionDatabaseId: selectedDatabaseId,
                  mappings: mappings,
                  hasCompletedOnboarding: true // Marcamos que ha completado el onboarding
                };
                
                await saveFieldMapperConfig(config);
                setSuccessMessage('¡Enhorabuena! Ya sabes cómo usar el Field Mapper V4');
              } catch (error) {
                console.error('Error al guardar estado de onboarding:', error);
                setSuccessMessage(`Error al guardar progreso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
              }
              setShowSuccessMessage(true);
              setTimeout(() => setShowSuccessMessage(false), 5000);
            }
          }}
        />
      )}
      
      {/* Mensaje de Estado */}
      <StatusMessage
        message={successMessage}
        type={successMessage.toLowerCase().includes('error') ? 'error' : 'success'}
        show={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
      
      {/* Botón de ayuda */}
      <button
        onClick={() => setShowHelpPanel(!showHelpPanel)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-black/60 text-white/90 rounded-full shadow-md border border-white/10 hover:bg-black/80 hover:border-teal-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        aria-label="Mostrar ayuda"
      >
        <HelpCircle className="w-5 h-5 text-teal-400" />
      </button>
      
      {/* Panel de ayuda rápida */}
      {showHelpPanel && (
        <div className="fixed bottom-20 right-6 z-40 w-72 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10 shadow-sm p-4 text-white/90 font-mono">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <h3 className="text-base font-medium flex items-center gap-2 text-teal-400">
              <HelpCircle className="w-4 h-4" />
              Ayuda rápida
            </h3>
            <button 
              onClick={() => setShowHelpPanel(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Cerrar ayuda"
            >
              <X className="w-4 h-4 text-white/70 hover:text-white/90" />
            </button>
          </div>
          <ul className="space-y-3">
            <li>
              <button 
                onClick={() => {
                  setShowOnboarding(true);
                  setOnboardingStep(1);
                  setShowHelpPanel(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 group"
                aria-label="Ver tutorial completo"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Ver tutorial completo</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setShowTransformationTips(!showTransformationTips);
                  setShowHelpPanel(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 group"
                aria-label="Consejos de transformación"
              >
                <Lightbulb className="w-4 h-4 text-teal-400" />
                <span>Consejos de transformación</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setShowCompatibilityInfo(!showCompatibilityInfo);
                  setShowHelpPanel(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 group"
                aria-label="Compatibilidad de tipos"
              >
                <AlertCircle className="w-4 h-4 text-teal-400" />
                <span>Compatibilidad de tipos</span>
              </button>
            </li>
          </ul>
        </div>
      )}
      
      {/* Contenido principal */}
      {selectedDatabaseId && (
        <div className="flex flex-1 w-full h-[calc(100vh-180px)] max-h-[calc(100vh-180px)] overflow-hidden gap-4">
          {/* Panel izquierdo: Campos de Notion */}
          <div className="w-[22%] overflow-auto bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
            <div className="p-4">
              <NotionFieldsPanel
                fields={notionFields}
                mappings={mappings}
                onDatabaseChangeAction={handleDatabaseChange}
                selectedDatabaseId={selectedDatabaseId}
              />
            </div>
          </div>
          
          {/* Panel central: Estructura de Case Study */}
          <div className="w-[56%] h-full overflow-y-auto bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
            <div className="p-4">
              <CaseStudyStructure
                fields={caseStudyFields}
                notionFields={notionFields}
                mappings={mappings}
                onMapFieldAction={handleMapFieldAction}
                onSetTransformation={handleSetTransformation}
              />
            </div>
          </div>
          
          {/* Panel derecho: Resumen y acciones */}
          <div className="w-[22%] overflow-auto">
            <SummaryPanel
              caseStudyFields={caseStudyFields}
              notionFields={notionFields}
              mappings={mappings}
              onSave={handleSaveConfig}
              onResetAction={handleResetMappings}
            />
            
            {showPerformanceTools && (
              <div className="mt-6 p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
                <h3 className="text-base font-medium mb-3 text-purple-400 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Herramientas de Rendimiento
                </h3>
                <PerformanceTab />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal de previsualización */}
      {showPreview && (
        <MappingPreview
          caseStudyFields={caseStudyFields}
          notionFields={notionFields}
          mappings={mappings}
          onCloseAction={handleClosePreview}
        />
      )}
      
      {/* Panel de consejos de transformación */}
      {showTransformationTips && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[550px] max-w-[95vw] bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-6 text-white/90 font-mono">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
            <h3 className="text-base font-medium flex items-center gap-2 text-white/90">
              <Lightbulb className="w-5 h-5 text-teal-400" />
              Consejos de transformación
            </h3>
            <button 
              onClick={() => setShowTransformationTips(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Cerrar consejos"
            >
              <X className="w-5 h-5 text-white/70 hover:text-white/90" />
            </button>
          </div>
          <div className="space-y-5">
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Transformaciones básicas
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">toString()</code> para convertir números o booleanos a texto
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">Number(valor)</code> para convertir texto a número
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">Boolean(valor)</code> para convertir a booleano
                </li>
              </ul>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Transformaciones de texto
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">valor.toUpperCase()</code> para convertir a mayúsculas
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">valor.toLowerCase()</code> para convertir a minúsculas
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">valor.trim()</code> para eliminar espacios al inicio y final
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">valor.replace(buscar, reemplazar)</code> para sustituir texto
                </li>
              </ul>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Transformaciones de fechas
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">new Date(valor)</code> para convertir texto a fecha
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">fecha.toISOString()</code> para formato estándar
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">fecha.toLocaleDateString()</code> para formato local
                </li>
              </ul>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Transformaciones avanzadas
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">JSON.parse(valor)</code> para convertir JSON a objeto
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">JSON.stringify(valor)</code> para convertir objeto a JSON
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-white/60"></div>
                  Usa <code className="bg-black/60 px-2 py-0.5 rounded text-teal-400 mx-1 text-xs">Array.isArray(valor) ? valor : [valor]</code> para asegurar un array
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
            <button 
              onClick={() => setShowTransformationTips(false)}
              className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50 flex items-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Entendido
            </button>
          </div>
        </div>
      )}
      
      {/* Panel de compatibilidad de tipos */}
      {showCompatibilityInfo && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[550px] max-w-[95vw] bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-6 text-white/90 font-mono">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
            <h3 className="text-base font-medium flex items-center gap-2 text-white/90">
              <AlertCircle className="w-5 h-5 text-teal-400" />
              Compatibilidad de tipos
            </h3>
            <button 
              onClick={() => setShowCompatibilityInfo(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Cerrar información de compatibilidad"
            >
              <X className="w-5 h-5 text-white/70 hover:text-white/90" />
            </button>
          </div>
          <div className="space-y-5">
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Compatibilidad directa
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-emerald-400"></div>
                  <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Texto</span> → <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Texto</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-emerald-400"></div>
                  <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Número</span> → <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Número</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-emerald-400"></div>
                  <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Booleano</span> → <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Booleano</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-emerald-400"></div>
                  <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Fecha</span> → <span className="bg-emerald-400/10 px-2 py-0.5 rounded text-emerald-400 mx-1 text-xs">Fecha</span>
                </li>
              </ul>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Requiere transformación
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-yellow-400"></div>
                  <span className="bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400 mx-1 text-xs">Número</span> → <span className="bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400 mx-1 text-xs">Texto</span> (usar <code className="bg-black/60 px-1 rounded text-teal-400">toString()</code>)
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-yellow-400"></div>
                  <span className="bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400 mx-1 text-xs">Texto</span> → <span className="bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400 mx-1 text-xs">Número</span> (usar <code className="bg-black/60 px-1 rounded text-teal-400">Number()</code>)
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-yellow-400"></div>
                  <span className="bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400 mx-1 text-xs">Fecha</span> → <span className="bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400 mx-1 text-xs">Texto</span> (usar <code className="bg-black/60 px-1 rounded text-teal-400">toISOString()</code>)
                </li>
              </ul>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="bg-black/40 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-white/90 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                Incompatible
              </h4>
              <ul className="space-y-2.5 pl-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-red-400"></div>
                  <span className="bg-red-400/10 px-2 py-0.5 rounded text-red-400 mx-1 text-xs">Objeto</span> → <span className="bg-red-400/10 px-2 py-0.5 rounded text-red-400 mx-1 text-xs">Número</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-red-400"></div>
                  <span className="bg-red-400/10 px-2 py-0.5 rounded text-red-400 mx-1 text-xs">Array</span> → <span className="bg-red-400/10 px-2 py-0.5 rounded text-red-400 mx-1 text-xs">Booleano</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 min-w-[3px] h-[3px] w-[3px] rounded-full bg-red-400"></div>
                  <span className="bg-red-400/10 px-2 py-0.5 rounded text-red-400 mx-1 text-xs">Texto no numérico</span> → <span className="bg-red-400/10 px-2 py-0.5 rounded text-red-400 mx-1 text-xs">Número</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
            <button 
              onClick={() => setShowCompatibilityInfo(false)}
              className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50 flex items-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
