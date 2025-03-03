'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Componente Skeleton para el estado de carga (loading)
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)}
      {...props}
    />
  );
}

export default Skeleton;
