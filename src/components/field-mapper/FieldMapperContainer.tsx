'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useNotionFields, useMappings, useSaveMappings, useTestMappings } from '@/lib/field-mapper/api';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { FieldMapping } from '@/lib/field-mapper/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Save, Play, Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';
import VirtualizedMappingList from './VirtualizedMappingList';
import FieldList from './FieldList';

// Loading fallback component
const LoadingFallback = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

// Error display component
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

/**
 * Field Mapper Container Component
 * 
 * Main container for the Field Mapper interface with:
 * - Suspense for incremental loading
 * - React Query for data fetching and caching
 * - Optimized rendering with virtualization
 * - Robust error handling
 */
const FieldMapperContainer: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('mapping');
  
  // Get queries from React Query hooks
  const notionFieldsQuery = useNotionFields();
  const mappingsQuery = useMappings();
  const saveMappingsMutation = useSaveMappings();
  const testMappingsMutation = useTestMappings();
  
  // Get store actions
  const setNotionFields = useFieldMapperStore(state => state?.setNotionFields);
  const setMappings = useFieldMapperStore(state => state?.setMappings);
  const mappings: FieldMapping[] = useFieldMapperStore(state => state?.mappings);
  
  // Load data into store when queries complete
  useEffect(() => {
    if (notionFieldsQuery?.data) {
      // Convertir NotionField[] a Field[] añadiendo la propiedad 'source'
      const fieldsWithSource = notionFieldsQuery?.data.map(field => ({
        ...field,
        source: 'notion' as const
      }));
      setNotionFields(fieldsWithSource);
    }
    if (mappingsQuery?.data) {
      setMappings(mappingsQuery?.data);
    }
  }, [notionFieldsQuery?.data, mappingsQuery?.data, setNotionFields, setMappings]);
  
  // Handlers
  const handleSaveMappings = () => {
    saveMappingsMutation?.mutate(mappings);
  };
  
  const handleTestMappings = () => {
    testMappingsMutation?.mutate(mappings);
  };
  
  // Función para manejar el mapeo de campos (no utilizada actualmente)
  // const handleFieldMap = (_field: FieldMapping) => {
  //   // lógica aquí
  // }
  
  // Determine loading and error states
  const isLoading = notionFieldsQuery?.isLoading || mappingsQuery?.isLoading || false;
  const isError = notionFieldsQuery?.isError || mappingsQuery?.isError || false;
  const errorMessage = (notionFieldsQuery?.error as Error)?.message || (mappingsQuery?.error as Error)?.message || 'Error al cargar los datos';
  
  // Show loading state
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  // Show error state
  if (isError) {
    return <ErrorDisplay message={errorMessage} />;
  }
  
  return (
    <div className="container mx-auto py-6">
      {/* Toaster para notificaciones */}
      <Toaster position="bottom-right" theme="dark" richColors />
      <Card>
        <CardHeader>
          <CardTitle>Field Mapper</CardTitle>
          <CardDescription>
            Mapea campos de Notion a campos del sitio web para casos de estudio
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="mapping">Mappings</TabsTrigger>
              <TabsTrigger value="preview">Vista previa</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mapping" className="min-h-[500px]">
              <div className="flex justify-end mb-4 gap-2">
                <Button
                  onClick={handleTestMappings}
                  variant="outline"
                  disabled={testMappingsMutation?.isPending || false}
                >
                  {testMappingsMutation?.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Probar mappings
                </Button>
                
                <Button
                  onClick={handleSaveMappings}
                  disabled={saveMappingsMutation?.isPending || false}
                >
                  {saveMappingsMutation?.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Guardar
                </Button>
              </div>
              
              {/* Las notificaciones de éxito y error ahora se manejan con toast en api.ts */}
              
              {/* Two-column layout with fields and mappings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Field panels */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Campos de Notion</CardTitle>
                      <CardDescription className="text-xs">
                        Campos disponibles en la base de datos de Notion
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-3">
                      <Suspense fallback={<LoadingFallback />}>
                        <FieldList source="notion" listId="notion-fields" />
                      </Suspense>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Campos del Sitio Web</CardTitle>
                      <CardDescription className="text-xs">
                        Campos disponibles en el sitio web
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-3">
                      <Suspense fallback={<LoadingFallback />}>
                        <FieldList source="website" listId="website-fields" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right column - Mappings */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Mappings</CardTitle>
                      <CardDescription className="text-xs">
                        Asignaciones entre campos de Notion y campos del sitio web
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-3">
                      <Suspense fallback={<LoadingFallback />}>
                        <div className="h-[500px]">
                          <VirtualizedMappingList />
                        </div>
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="p-4 border rounded-md">
                <p>Vista previa de los datos mapeados (próximamente)</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="p-4 border rounded-md">
                <p>Configuración del Field Mapper (próximamente)</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldMapperContainer;
