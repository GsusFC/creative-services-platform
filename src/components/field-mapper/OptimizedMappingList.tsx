'use client'

import React, { useCallback, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { FieldMapping, useFieldMapperStore } from '@/lib/field-mapper/store'
import { Mapping } from './Mapping'

export default function OptimizedMappingList() {
  // Obtener datos directamente del store
  const mappings = useFieldMapperStore(state => state?.mappings)
  const notionFields = useFieldMapperStore(state => state?.notionFields)
  const websiteFields = useFieldMapperStore(state => state?.websiteFields)
  const updateMapping = useFieldMapperStore(state => state?.updateMapping)
  const removeMapping = useFieldMapperStore(state => state?.removeMapping)
  
  const parentRef = React.useRef<HTMLDivElement>(null)
  
  // Use virtualization for better performance with large lists
  const rowVirtualizer = useVirtualizer({
    count: mappings?.length,
    getScrollElement: () => parentRef?.current,
    estimateSize: useCallback(() => 80, []), // Estimated row height
    overscan: 5,
  })

  // Memoize the mapping components to prevent unnecessary re-renders
  const virtualRows = useMemo(() => {
    return rowVirtualizer?.getVirtualItems().map(virtualRow => {
      const mapping = mappings[virtualRow?.index]
      return (
        <div
          key={mapping?.id || virtualRow?.index}
          data-index={virtualRow?.index}
          className="py-2"
          style={{
            height: `${virtualRow?.size}px`,
            transform: `translateY(${virtualRow?.start}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <Mapping
            key={mapping?.id || virtualRow?.index}
            index={virtualRow?.index}
            mapping={mapping}
            notionFields={notionFields}
            websiteFields={websiteFields}
            onUpdateMapping={updateMapping}
            onRemoveMapping={removeMapping}
          />
        </div>
      )
    })
  }, [rowVirtualizer?.getVirtualItems(), mappings, notionFields, websiteFields, updateMapping, removeMapping])

  return (
    <div 
      ref={parentRef} 
      className="overflow-auto max-h-[calc(100vh-300px)] relative border border-zinc-800 rounded-md"
      style={{ height: '500px' }}
    >
      <div
        style={{
          height: `${rowVirtualizer?.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {mappings?.length === 0 ? (
          <div className="p-4 text-center text-zinc-500">
            No mappings yet. Add a mapping to get started.
          </div>
        ) : (
          virtualRows
        )}
      </div>
    </div>
  )
}
