'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TechnicalTermProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'api-key' | 'url' | 'code'
}

export function TechnicalTerm({
  children,
  className,
  variant = 'default',
}: TechnicalTermProps) {
  // Cada variante puede tener un estilo ligeramente diferente
  const variantClasses = {
    default: 'bg-gray-900/30',
    'api-key': 'bg-blue-950/30 border-blue-800/50',
    url: 'bg-green-950/30 border-green-800/50',
    code: 'bg-purple-950/30 border-purple-800/50',
  }

  return (
    <code
      className={cn(
        'admin-page technical-term inline-block font-mono text-sm px-1.5 py-0.5 rounded border border-gray-700/50',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </code>
  )
}
