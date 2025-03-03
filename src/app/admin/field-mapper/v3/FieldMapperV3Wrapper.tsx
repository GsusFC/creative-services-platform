'use client'

/**
 * Field Mapper V3 - Wrapper para el componente principal
 * 
 * Este componente es un wrapper del cliente para el FieldMapperV3
 * que carga el componente correctamente en Next.js 15.2.0
 */

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Creamos un componente de error para cuando falle la carga dinámica
const ErrorFallback = () => (
  <div className="flex h-[500px] w-full flex-col items-center justify-center gap-4 p-4">
    <div className="rounded-lg bg-red-900/20 p-4 text-center">
      <h3 className="mb-2 text-lg font-semibold text-red-500">Error al cargar Field Mapper V3</h3>
      <p className="text-sm text-slate-400">
        Hubo un problema al cargar el componente. Intenta recargar la página.
      </p>
    </div>
    <button 
      onClick={() => window.location.reload()} 
      className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
    >
      Recargar página
    </button>
  </div>
)

// En Next.js 15, los componentes dinámicos en client components no necesitan `ssr: false`
// La directiva 'use client' ya garantiza que se renderiza del lado del cliente
const FieldMapperV3 = dynamic(
  () => import('@/components/field-mapper/FieldMapperV3').then(mod => mod.default || mod),
  {
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    ),
    error: ErrorFallback
  }
)

// Crea un cliente para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
})

export function FieldMapperV3Wrapper() {
  const [isMounted, setIsMounted] = useState(false)

  // Asegurarse de que el componente solo se monte en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Componente de carga mientras espera el montaje del cliente
  if (!isMounted) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <FieldMapperV3 />
    </QueryClientProvider>
  )
}

export default FieldMapperV3Wrapper
