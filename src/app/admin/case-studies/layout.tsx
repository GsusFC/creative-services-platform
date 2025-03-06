'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isRoot = pathname === '/admin/case-studies'
  
  return (
    <>
      {isRoot ? null : (
        <div className="fixed top-24 left-8 z-10">
          <Link 
            href="/admin/case-studies" 
            className="flex items-center px-3 py-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-md text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Volver al listado
          </Link>
        </div>
      )}
      {children}
    </>
  )
}
