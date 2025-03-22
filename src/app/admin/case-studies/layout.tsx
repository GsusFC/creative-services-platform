'use client'

import { useEffect } from 'react'

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    console.log('[Debug] CaseStudiesLayout - Montado')
  }, [])

  return children
}
