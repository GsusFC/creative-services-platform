'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { FieldMapping, Field } from '@/lib/field-mapper/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import MappingComponent from './Mapping';

interface VirtualizedMappingListProps {
  className?: string;
}

/**
 * Virtualized Mapping List Component
 * 
 * Renders a virtualized list of field mappings for improved performance
 * with large datasets. Only renders the mappings that are visible in the viewport.
 */
const VirtualizedMappingList: React.FC<VirtualizedMappingListProps> = ({ className = '' }) => {
  // Get store data
  const mappings = useFieldMapperStore(state => state.mappings);
  const notionFields = useFieldMapperStore(state => state.notionFields);
  const websiteFields = useFieldMapperStore(state => state.websiteFields);
  const updateMapping = useFieldMapperStore(state => state.updateMapping);
  const removeMapping = useFieldMapperStore(state => state.removeMapping);
  const addMapping = useFieldMapperStore(state => state.addMapping);
  
  // Container ref for virtualization
  const parentRef = useRef<HTMLDivElement>(null);
  
  // State for container measurements
  const [parentHeight, setParentHeight] = useState(0);
  
  // Update parent height on resize
  useEffect(() => {
    const updateParentHeight = () => {
      if (parentRef.current) {
        setParentHeight(parentRef.offsetHeight);
      }
    };
    
    // Initial measurement
    updateParentHeight();
    
    // Add resize listener
    window?.addEventListener('resize', updateParentHeight);
    
    // Cleanup
    return () => {
      window?.removeEventListener('resize', updateParentHeight);
    };
  }, []);
  
  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: mappings?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Estimated height of each mapping item
    overscan: 5, // Number of items to render outside of the visible area
  });
  
  // Handlers
  const handleUpdateMapping = useCallback((index: number, mapping: FieldMapping) => {
    updateMapping(index, mapping);
  }, [updateMapping]);
  
  const handleRemoveMapping = useCallback((index: number) => {
    removeMapping(index);
  }, [removeMapping]);
  
  const handleAddMapping = useCallback(() => {
    addMapping({ notionField: '', websiteField: '' });
    
    // Scroll to the bottom after adding a new mapping
    setTimeout(() => {
      if (parentRef.current) {
        (parentRef.scrollTop) = parentRef.scrollHeight;
      }
    }, 0);
  }, [addMapping]);
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div 
        ref={parentRef}
        className="flex-1 overflow-auto"
        style={{
          height: `calc(100% - 50px)`, // Leave space for the add button
          position: 'relative'
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer?.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer?.getVirtualItems().map(virtualRow => {
            const mapping = mappings[virtualRow?.index];
            return (
              <div
                key={virtualRow?.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow?.size}px`,
                  transform: `translateY(${virtualRow?.start}px)`,
                  padding: '8px 0'
                }}
              >
                <MappingComponent
                  mapping={mapping}
                  index={virtualRow?.index}
                  notionFields={notionFields}
                  websiteFields={websiteFields}
                  onUpdateMapping={handleUpdateMapping}
                  onRemoveMapping={handleRemoveMapping}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={handleAddMapping}
          size="sm"
          className="w-full bg-green-900/30 hover:bg-green-800/50 text-green-300 border-green-900/30"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Añadir nuevo mapping
        </Button>
      </div>
    </div>
  );
};

export default VirtualizedMappingList;
