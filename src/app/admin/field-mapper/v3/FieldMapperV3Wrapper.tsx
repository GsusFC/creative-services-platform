'use client'

import { useState } from 'react'
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query'

// Componente cliente que maneja el QueryClient y renderiza el contenido
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
      <div className="p-4 text-center">
        <h2 className="text-xl text-white mb-2">Field Mapper V3</h2>
        <p className="text-gray-300">
          Este componente está temporalmente deshabilitado para solucionar problemas de despliegue.
        </p>
      </div>
    </QueryClientProvider>
  )
}

// Exportación por defecto para compatibilidad con importaciones dinámicas
export default FieldMapperV3Wrapper;
