'use client'

import { useState } from 'react'
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query'
import FieldMapperV3 from '@/components/field-mapper/FieldMapperV3'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FileWarning, Zap } from 'lucide-react'
import { TransformationInfoPanel } from '@/components/field-mapper/TransformationInfoPanel'

// Componente cliente que maneja el QueryClient y renderiza el FieldMapperV3
export const FieldMapperV3Wrapper = () => {
  // Crear una instancia de QueryClient en el lado del cliente
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: false,
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-end mb-6 text-white">
        <div className="flex gap-2">
          {/* Panel de Información de Transformaciones */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1.5 border-gray-700 text-white hover:text-white hover:bg-gray-800">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Ver Transformaciones</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] max-w-[900px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[900px] bg-gray-950 border-gray-800 p-6 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-white">Sistema de Transformaciones</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Visualiza todas las transformaciones disponibles entre tipos de campos y su impacto en el rendimiento.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <TransformationInfoPanel />
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Botón de Documentación (Placeholder) */}
          <Button variant="outline" className="flex items-center gap-1.5 border-gray-700 text-white hover:text-white hover:bg-gray-800">
            <FileWarning className="h-4 w-4 text-blue-500" />
            <span>Documentación</span>
          </Button>
        </div>
      </div>
      
      <FieldMapperV3 />
    </QueryClientProvider>
  )
}

// Exportación por defecto para compatibilidad con importaciones dinámicas
export default FieldMapperV3Wrapper;
