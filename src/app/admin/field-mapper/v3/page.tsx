/**
 * Field Mapper V3 - Página principal
 * 
 * Implementación moderna para Next.js 15.2.0
 */

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { FieldMapperV3Wrapper } from './FieldMapperV3Wrapper'
import { DEBUG_CONFIG } from '@/lib/debug'
import FieldMapperDebugPanel from '../../../../components/field-mapper/FieldMapperDebugPanel'

// Componente de carga
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm text-slate-400">Cargando Field Mapper V3...</p>
    </div>
  </div>
)

export default function FieldMapperV3Page() {
  return (
    <div className="min-h-screen w-full bg-black pt-[80px]">
      <Suspense fallback={<Loading />}>
        <>
          <FieldMapperV3Wrapper />
          {/* Panel de depuración solo visible según configuración */}
          {DEBUG_CONFIG.enabled && DEBUG_CONFIG.showDebugPanel && <FieldMapperDebugPanel />}
        </>
      </Suspense>
    </div>
  )
}
