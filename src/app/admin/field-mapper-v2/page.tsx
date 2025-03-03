'use client'

/**
 * Optimized Field Mapper Page
 * 
 * This is an improved version of the Field Mapper with:
 * - React Query for API data fetching
 * - Incremental loading for better UX
 * - Optimized rendering with virtualization
 * - Improved error handling
 */

import React, { Suspense, useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  DatabaseIcon,
  LayoutTemplateIcon, 
  ArrowLeftRightIcon,
  LightbulbIcon,
  BeakerIcon,
  XCircleIcon,
  ArrowLeftIcon,
  EyeIcon
} from 'lucide-react'
import toast from '@/lib/toast'
import { useTestMappings } from '@/lib/field-mapper/api'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useFieldMapperStore } from '@/lib/field-mapper/store'

// Import optimized components with dynamic import to ensure client-side only rendering
const OptimizedMappingList = dynamic(
  () => import('@/components/field-mapper/OptimizedMappingList'),
  { ssr: false }
)
const FieldList = dynamic(
  () => import('@/components/field-mapper/FieldList'),
  { ssr: false }
)
import { IncrementalLoadProvider, LoadingIndicator, useLoadProgress, LoadStage } from '@/components/field-mapper/IncrementalLoadProvider'
import TestingPanel from '@/components/field-mapper/TestingPanel'
import TipsPanel from '@/components/field-mapper/TipsPanel'
import PreviewPanel from '@/components/field-mapper/PreviewPanel'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block p-4 rounded-full bg-slate-800">
              <DatabaseIcon className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-medium mb-2">Loading Field Mapper</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  )
}

// Error boundary component
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto my-8">
        <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircleIcon className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-medium text-red-300 mb-2">Error Loading Field Mapper</h2>
              <p className="text-red-200 mb-4">{error.message}</p>
              <div className="flex gap-3">
                <Link href="/admin" passHref>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Admin
                  </Button>
                </Link>
                <Button 
                  variant="default" 
                  className="bg-red-700 hover:bg-red-600 text-white"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Content component
function FieldMapperContent() {
  const { stage, error } = useLoadProgress();
  const isClientRef = useRef<boolean>(false);
  
  useEffect(() => {
    isClientRef.current = true;
  }, []);
  
  const { mutate: testMappings, isPending: isTestingMapping } = useTestMappings();
  const fieldMapperStore = useFieldMapperStore();
  const someListId = 'some-list-id'; // Replace with actual list ID
  
  // Handle test mapping
  const handleTestMapping = () => {
    // Obtener los mappings directamente del store
    const mappings = fieldMapperStore.mappings;
    
    testMappings(mappings, {
      onSuccess: () => {
        toast({
          title: "Test completed",
          description: "Mapping test completed successfully",
          status: "success",
        });
      },
      onError: (err) => {
        toast({
          title: "Test failed",
          description: err instanceof Error ? err.message : "Unknown error",
          status: "error",
        });
      }
    });
  };

  // Error handling
  if (error) {
    return <ErrorDisplay error={new Error(error)} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            <ArrowLeftRightIcon className="h-5 w-5" />
            Field Mapper v2
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin/field-mapper" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <ArrowLeftIcon className="h-4 w-4" /> Ver versión original
            </Link>
          </div>
          <p className="text-gray-400 mt-2">
            Mapeo optimizado de campos de Notion a los campos del sitio web
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" passHref>
            <Button variant="outline" className="flex items-center gap-2 text-sm">
              <ArrowLeftIcon className="h-4 w-4" />
              Volver a Admin
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Loading indicator */}
      <LoadingIndicator />
      
      {/* Main content - visible when data is loaded */}
      {stage !== LoadStage.Error && (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Left column - Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                  <DatabaseIcon className="h-5 w-5 text-blue-500" />
                  <h2 className="font-medium">Campos de Notion</h2>
                </div>
              </div>
              <div className="p-4">
                <FieldList source="notion" listId={someListId} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                  <LayoutTemplateIcon className="h-5 w-5 text-indigo-500" />
                  <h2 className="font-medium">Campos del Sitio Web</h2>
                </div>
              </div>
              <div className="p-4">
                <FieldList source="website" listId={someListId} />
              </div>
            </div>
          </div>

          {/* Center column - Mappings */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm h-full">
              <div className="border-b border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                  <ArrowLeftRightIcon className="h-5 w-5 text-green-500" />
                  <h2 className="font-medium">Mapeos</h2>
                </div>
              </div>
              <div className="p-4">
                <OptimizedMappingList />
              </div>
            </div>
          </div>

          {/* Right column - Testing & Tips */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                  <BeakerIcon className="h-5 w-5 text-purple-500" />
                  <h2 className="font-medium">Probar mapeo</h2>
                </div>
              </div>
              <div className="p-4">
                <Button 
                  variant="default" 
                  className="w-full mb-4"
                  onClick={handleTestMapping}
                  disabled={isTestingMapping || stage !== LoadStage.Complete}
                >
                  {isTestingMapping ? "Probando..." : "Probar mapeo"}
                </Button>
                
                <TestingPanel />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-5 w-5 text-blue-500" />
                  <h2 className="font-medium">Vista Previa</h2>
                </div>
              </div>
              <div className="p-4">
                <PreviewPanel />
              </div>
            </div>

            <Accordion type="single" collapsible defaultValue="tips" className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <AccordionItem value="tips" className="border-0">
                <AccordionTrigger className="px-4 py-3 border-b border-slate-800 bg-slate-900 hover:bg-slate-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                    <h2 className="font-medium">Consejos</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                  <TipsPanel />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component with React Query provider
export default function FieldMapperV2Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <IncrementalLoadProvider>
        <Suspense fallback={<LoadingFallback />}>
          <FieldMapperContent />
        </Suspense>
      </IncrementalLoadProvider>
    </QueryClientProvider>
  );
}
