import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { Skeleton } from '@/components/ui/skeleton'

// Importación dinámica del componente cliente
const FieldMapperV3Wrapper = dynamic(
  () => import("./FieldMapperV3Wrapper")
)

// Componente de carga
const Loading = () => (
  <div className="bg-black min-h-screen w-full">
    <div className="container mx-auto py-10 mt-[80px] text-white">
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-[400px] bg-gray-800" />
        <Skeleton className="h-[400px] bg-gray-800" />
        <Skeleton className="h-[400px] bg-gray-800" />
      </div>
    </div>
  </div>
)

// Metadata solo puede exportarse desde Server Components
export const metadata: Metadata = {
  title: '',
  description: 'Herramienta para mapear componentes de Case Studies entre Notion y el sitio web',
}

export default function FieldMapperV3Page() {
  return (
    <div className="bg-black min-h-screen w-full">
      <Suspense fallback={<Loading />}>
        <div className="container mx-auto py-10 mt-[80px] text-white">
          <FieldMapperV3Wrapper />
        </div>
      </Suspense>
    </div>
  )
}
