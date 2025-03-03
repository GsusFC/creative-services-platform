/**
 * Field Mapper Dashboard Page
 * 
 * Página de administración que muestra el panel de control del Field Mapper
 * con estadísticas, monitoreo de rendimiento y configuración.
 */

'use client'

import React, { Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Dashboard from '@/components/field-mapper/Dashboard'

export default function FieldMapperDashboardPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold">Field Mapper Dashboard</h1>
        <p className="text-muted-foreground">
          Monitoreo de rendimiento y estadísticas del Field Mapper
        </p>
      </div>
      
      <Separator className="mb-6" />
      
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  )
}

// Componente de esqueleto para carga
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      
      <Skeleton className="h-4 w-48" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
      
      <Skeleton className="h-[200px] w-full" />
    </div>
  )
}
