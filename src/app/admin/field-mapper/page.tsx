'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  Loader2Icon, 
  DatabaseIcon, 
  CheckIcon, 
  SaveIcon, 
  XIcon, 
  LayoutTemplateIcon, 
  ArrowLeftRightIcon, 
  FlaskRoundIcon, 
  InfoIcon, 
  LightbulbIcon,
  BeakerIcon,
  XCircleIcon,
  RefreshCwIcon,
  PlusIcon
} from 'lucide-react'
import toast from '@/lib/toast'
import FieldList from '@/components/field-mapper/FieldList'
import TestingPanel from '@/components/field-mapper/TestingPanel'
import TipsPanel from '@/components/field-mapper/TipsPanel'
import ActionButtons from '@/components/field-mapper/ActionButtons'
import MappingList from '@/components/field-mapper/MappingList'
import { useFieldMapperStore } from '@/lib/field-mapper/store'
import { testMapping } from '@/lib/field-mapper/test-mapping'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

// Crear alias para iconos que no existen
const TestIcon = BeakerIcon;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
})

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen flex flex-col bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white">
    <div className="flex items-center justify-between p-3 border-b border-white/10">
      <h1 className="text-xl font-bold">Field Mapper</h1>
      <Link href="/" className="text-sm text-white/70 hover:text-white">← Volver al inicio</Link>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2Icon className="h-5 w-5 animate-spin text-white/70" />
        <span>Cargando Field Mapper...</span>
      </div>
    </div>
  </div>
)

// Error boundary component
const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="h-screen flex flex-col bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white">
    <div className="flex items-center justify-between p-3 border-b border-white/10">
      <h1 className="text-xl font-bold">Field Mapper</h1>
      <Link href="/" className="text-sm text-white/70 hover:text-white">← Volver al inicio</Link>
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-red-900/20 p-4 rounded-md border border-red-500/30 max-w-lg">
        <h2 className="text-red-400 font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  </div>
)

// Main Content component
function FieldMapperContent() {
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isTestingMapping, setIsTestingMapping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Acceder al store directamente sin useCallback
  const store = useFieldMapperStore();
  const mappings = store.mappings;
  const notionFields = store.notionFields;
  const websiteFields = store.websiteFields;
  const setNotionFields = store.setNotionFields;
  const setWebsiteFields = store.setWebsiteFields;
  const setMappings = store.setMappings;
  const setStoreError = store.setError;
  const setStoreLoading = store.setLoading;

  useEffect(() => {
    // Inicializar con los datos de Notion y los mappings guardados
    initializeData();
  }, []);

  // Definir la función initializeData fuera del useEffect para poder llamarla desde el botón
  const initializeData = async () => {
    setIsLoading(true);
    setStoreLoading(true);
    
    // Cargar campos de Notion
    await loadNotionFields();
    
    // Configurar campos del sitio web (estos son estáticos por ahora)
    setWebsiteFields([
      { id: 'title', name: 'Title', type: 'text', source: 'website' },
      { id: 'slug', name: 'Slug', type: 'text', source: 'website' },
      { id: 'description', name: 'Description', type: 'text', source: 'website' },
      { id: 'content', name: 'Content', type: 'richText', source: 'website' },
      { id: 'date', name: 'Date', type: 'date', source: 'website' },
      { id: 'featuredImage', name: 'Featured Image', type: 'url', source: 'website' },
      { id: 'tags', name: 'Tags', type: 'multiSelect', source: 'website' },
      { id: 'status', name: 'Status', type: 'select', source: 'website' },
      { id: 'author', name: 'Author', type: 'text', source: 'website' },
      { id: 'seo', name: 'SEO Description', type: 'text', source: 'website' },
    ]);

    // Cargar mappings guardados
    try {
      const res = await fetch('/api/notion/mappings');
      
      // Si no hay mappings guardados, no es un error crítico
      if (res.status === 404) {
        setIsLoading(false);
        setStoreLoading(false);
        return;
      }
      
      if (!res.ok) {
        throw new Error('Error al cargar los mappings guardados');
      }
      
      const data = await res.json();
      
      if (data.mappings && Array.isArray(data.mappings)) {
        // Usar setMappings del store
        setMappings(data.mappings);
        if (data.mappings.length > 0) {
          toast({
            title: "Mappings cargados",
            description: `Se cargaron ${data.mappings.length} mappings guardados anteriormente`,
            status: "info",
          });
        }
      }
    } catch (err: any) {
      console.error('Error loading saved mappings:', err);
      toast({
        title: "Error al cargar mappings",
        description: "No se pudieron cargar los mappings guardados anteriormente",
        status: "warning",
      });
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  // Función para cargar campos de Notion
  const loadNotionFields = async () => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
      setError(null);
      
      const res = await fetch('/api/notion/database/structure');
      
      if (!res.ok) {
        throw new Error('Error al cargar la estructura de la base de datos de Notion');
      }
      
      const data = await res.json();
      
      // La API devuelve data.properties, no data.structure
      if (data.properties && Array.isArray(data.properties)) {
        const formattedFields = data.properties.map((field: any) => ({
          id: field.id,
          name: field.name,
          type: field.type,
          source: 'notion',
          typeDetails: field.typeDetails || {}
        }));
        
        setNotionFields(formattedFields);
        
        toast({
          title: "Datos de Notion cargados",
          description: `Se cargaron ${formattedFields.length} campos de la base de datos "${data.databaseName || 'Notion'}"`,
          status: "success",
        });
        
        return true;
      } else {
        console.warn('Estructura inesperada en la respuesta de Notion:', data);
        setError('La respuesta de la API de Notion no tiene el formato esperado');
        setStoreError('La respuesta de la API de Notion no tiene el formato esperado');
        
        toast({
          title: "Error de formato",
          description: "La respuesta de Notion no tiene el formato esperado",
          status: "error",
        });
        
        return false;
      }
    } catch (err: any) {
      console.error('Error loading Notion database structure:', err);
      setError('Error al cargar los campos de Notion. ' + err.message);
      setStoreError('Error al cargar los campos de Notion. ' + err.message);
      
      toast({
        title: "Error al cargar datos de Notion",
        description: err.message,
        status: "error",
      });
      
      return false;
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  };

  const handleTestMapping = async () => {
    setIsTestingMapping(true);
    setError(null);
    setTestResult(null);
    
    try {
      const result = await testMapping(mappings);
      setTestResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to test mapping. Please try again.');
    } finally {
      setIsTestingMapping(false);
    }
  };

  const handleSaveMapping = async () => {
    setError(null);
    
    try {
      await fetch('/api/notion/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mappings }),
      });
      
      // Show success message
      toast({
        title: "Mappings saved successfully",
        description: "Your field mappings have been saved.",
        status: "success",
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save mapping. Please try again.');
    }
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Field Mapper</h1>
          <p className="text-gray-400 text-sm">
            Mapea campos de Notion a los campos del sitio web
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 rounded-md px-3 py-2 flex items-center gap-2 text-sm"
            onClick={loadNotionFields}
            disabled={isLoading}
            title="Recargar campos de Notion"
          >
            <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recargar Notion</span>
          </button>
          <ActionButtons />
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 border border-red-900/30 bg-red-950/20 text-red-400 rounded-md">
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <p className="font-medium">Error: {error}</p>
          </div>
          <p className="ml-7 mt-1 text-sm">
            Intenta recargar la página o contacta al administrador si el problema persiste.
          </p>
        </div>
      )}
      
      {isLoading && (
        <div className="mb-6 p-4 border border-blue-900/30 bg-blue-950/20 text-blue-400 rounded-md flex items-center gap-3">
          <Loader2Icon className="h-5 w-5 animate-spin text-blue-400" />
          <p>Cargando la estructura de datos y los mappings guardados...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr_auto] gap-6 items-start">
        {/* Panel izquierdo - Lista de campos */}
        <div className="space-y-6 w-max min-w-[250px] max-w-[400px]">
          <Accordion type="multiple" defaultValue={["notion-fields", "website-fields"]} className="space-y-6">
            {/* Campos de Notion */}
            <AccordionItem value="notion-fields" className="border border-gray-800 rounded-md bg-gray-950/50 overflow-hidden shadow-md">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <h3 className="text-sm text-gray-300 font-medium flex items-center gap-2" style={{ fontFamily: 'var(--font-druk)' }}>
                  <DatabaseIcon className="h-4 w-4 text-blue-400" />
                  <span>CAMPOS DE NOTION</span>
                  <span className="text-xs ml-1 py-0.5 px-1.5 rounded-full bg-blue-900/30 text-blue-400">
                    {notionFields.length}
                  </span>
                </h3>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <FieldList 
                  source="notion"
                  listId="notion-fields" 
                />
              </AccordionContent>
            </AccordionItem>
            
            {/* Campos del Sitio Web */}
            <AccordionItem value="website-fields" className="border border-gray-800 rounded-md bg-gray-950/50 overflow-hidden shadow-md">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <h3 className="text-sm text-gray-300 font-medium flex items-center gap-2" style={{ fontFamily: 'var(--font-druk)' }}>
                  <LayoutTemplateIcon className="h-4 w-4 text-purple-400" />
                  <span>CAMPOS DEL SITIO WEB</span>
                  <span className="text-xs ml-1 py-0.5 px-1.5 rounded-full bg-purple-900/30 text-purple-400">
                    {websiteFields.length}
                  </span>
                </h3>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <FieldList 
                  source="website"
                  listId="website-fields" 
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
          
        {/* Panel central - Mappings */}
        <div className="bg-gray-950/50 border border-gray-800 rounded-md p-4 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-300 font-medium flex items-center gap-2" style={{ fontFamily: 'var(--font-druk)' }}>
              <ArrowLeftRightIcon className="h-4 w-4 text-green-400" />
              <span>FIELD MAPPINGS</span>
              <span className="text-xs ml-1 py-0.5 px-1.5 rounded-full bg-green-900/30 text-green-400">
                {mappings.length}
              </span>
            </h3>
            <button 
              onClick={() => useFieldMapperStore.getState().addMapping({ notionField: '', websiteField: '' })}
              className="bg-green-900/30 hover:bg-green-800/50 text-green-300 px-3 py-1 rounded-md text-xs flex items-center gap-1"
            >
              <PlusIcon className="h-3 w-3" />
              <span>Añadir Mapping</span>
            </button>
          </div>
          
          {/* Lista de mappings */}
          <div className="mt-4">
            {mappings.length === 0 ? (
              <div className="border-2 border-dashed border-gray-800/30 rounded-md p-6 text-center">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowLeftRightIcon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-gray-400 font-medium mb-2" style={{ fontFamily: 'var(--font-druk)' }}>No hay mappings definidos</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Puedes crear mappings seleccionando campos de Notion y del sitio web.
                </p>
                <button
                  onClick={() => useFieldMapperStore.getState().addMapping({ notionField: '', websiteField: '' })}
                  className="bg-green-900/30 hover:bg-green-800/50 text-green-300 px-4 py-2 rounded-md text-sm inline-flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Añadir Mapping Manual</span>
                </button>
              </div>
            ) : (
              <MappingList />
            )}
          </div>
        </div>

        {/* Tercer Panel - Testing y Resultado */}
        <div className="bg-gray-950/50 border border-gray-800 rounded-md p-4 flex flex-col space-y-4 w-max min-w-[250px] max-w-[400px]">
          <h3 className="text-sm text-gray-300 font-medium mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-druk)' }}>
            <TestIcon className="h-4 w-4 text-orange-400" />
            <span>TESTING</span>
          </h3>
          <TestingPanel />
          <div className="mt-4">
            <h3 className="text-sm text-gray-300 font-medium mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-druk)' }}>
              <LightbulbIcon className="h-4 w-4 text-yellow-400" />
              <span>TIPS & INFORMACIÓN</span>
            </h3>
            <TipsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with React Query provider
// Adding trigger comment for Vercel rebuild
export default function FieldMapperPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <FieldMapperContent />
      </Suspense>
    </QueryClientProvider>
  );
}
