'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChangeAction: (page: number) => void
  siblingCount?: number
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChangeAction,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  const generatePagination = () => {
    // Calculate range of visible pages
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    // Show dots only if there's more than 1 page outside the range
    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 1

    const itemsList = []

    // Add first page
    if (totalPages > 0) {
      itemsList.push(1)
    }

    // Add left dots
    if (showLeftDots) {
      itemsList.push('leftDots')
    }

    // Add pages in range
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        itemsList.push(i)
      }
    }

    // Add right dots
    if (showRightDots) {
      itemsList.push('rightDots')
    }

    // Add last page
    if (totalPages > 1) {
      itemsList.push(totalPages)
    }

    return itemsList
  }

  const pages = generatePagination()

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChangeAction(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChangeAction(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChangeAction(page)
    }
  }

  return (
    <div
      className={cn('flex items-center justify-center space-x-2', className)}
      {...props}
    >
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-transparent p-1 text-sm font-medium text-white/80 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center space-x-2">
        {pages.map((page, i) => {
          if (page === 'leftDots' || page === 'rightDots') {
            return (
              <div
                key={`dots-${i}`}
                className="flex h-9 w-9 items-center justify-center text-white/60"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )
          }

          return (
            <button
              key={`page-${page}`}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-md border p-1 text-sm font-medium',
                currentPage === page
                  ? 'border-teal-500 bg-teal-500/20 text-teal-400'
                  : 'border-white/20 bg-transparent text-white/80 hover:bg-white/10'
              )}
              onClick={() => handlePageClick(page as number)}
              aria-label={`Ir a página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-transparent p-1 text-sm font-medium text-white/80 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
