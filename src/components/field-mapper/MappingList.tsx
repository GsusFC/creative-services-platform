import React from 'react';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Mapping } from './Mapping';

interface MappingListProps {
  className?: string;
}

const MappingList: React.FC<MappingListProps> = ({ className = '' }) => {
  // Usar el store
  const mappings = useFieldMapperStore(state => state.mappings);
  const addMapping = useFieldMapperStore(state => state.addMapping);
  
  // Add a new empty mapping
  const handleAddMapping = () => {
    addMapping({ notionField: '', websiteField: '' });
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-3">
        {mappings.map((mapping, index) => (
          <Mapping
            key={`${mapping.notionField || 'empty'}-${mapping.websiteField || 'empty'}-${index}`}
            mapping={mapping}
            index={index}
          />
        ))}
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

export default MappingList;
