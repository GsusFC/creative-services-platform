import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldCompatibilityVisualizer } from '../FieldCompatibilityVisualizer';
import { ComponentField } from '@/lib/field-mapper/v3-types';

describe('FieldCompatibilityVisualizer', () => {
  const mockSourceField: ComponentField = {
    id: 'source-1',
    name: 'texto_origen',
    label: 'Texto Origen',
    type: 'rich_text',
    required: false,
    component: 'Hero',
  };

  const mockTargetField: ComponentField = {
    id: 'target-1',
    name: 'texto_destino',
    label: 'Texto Destino',
    type: 'plain_text',
    required: true,
    component: 'InfoSection',
  };

  const mockIdenticalTargetField: ComponentField = {
    id: 'target-2',
    name: 'texto_identico',
    label: 'Texto Idéntico',
    type: 'rich_text',
    required: false,
    component: 'InfoSection',
  };

  const mockIncompatibleTargetField: ComponentField = {
    id: 'target-3',
    name: 'imagen_destino',
    label: 'Imagen Destino',
    type: 'image',
    required: true,
    component: 'GallerySection',
  };

  it('debe mostrar mensaje de selección cuando no hay campos seleccionados', () => {
    render(<FieldCompatibilityVisualizer showConnector />);
    
    expect(screen.getByText(/selecciona campos/i)).toBeInTheDocument();
  });

  it('debe mostrar compatible cuando los tipos son idénticos', () => {
    render(
      <FieldCompatibilityVisualizer 
        sourceField={mockSourceField} 
        targetField={mockIdenticalTargetField}
        showConnector
      />
    );
    
    expect(screen.getByText(/compatible/i)).toBeInTheDocument();
  });

  it('debe mostrar transformación cuando hay tipos compatibles pero diferentes', () => {
    render(
      <FieldCompatibilityVisualizer 
        sourceField={mockSourceField} 
        targetField={mockTargetField}
        showConnector
      />
    );
    
    expect(screen.getByText(/transformación/i)).toBeInTheDocument();
    expect(screen.getByText(/automática/i)).toBeInTheDocument();
  });

  it('debe mostrar incompatible cuando los tipos no se pueden transformar', () => {
    render(
      <FieldCompatibilityVisualizer 
        sourceField={mockSourceField} 
        targetField={mockIncompatibleTargetField}
        showConnector
      />
    );
    
    expect(screen.getByText(/incompatible/i)).toBeInTheDocument();
  });

  it('debe deshabilitar el botón de mapeo cuando los campos son incompatibles', () => {
    const mockOnCreateMapping = jest.fn();
    
    render(
      <FieldCompatibilityVisualizer 
        sourceField={mockSourceField} 
        targetField={mockIncompatibleTargetField}
        showConnector
        onCreateMapping={mockOnCreateMapping}
      />
    );
    
    const button = screen.getByRole('button', { name: /mapear campos/i });
    expect(button).toBeDisabled();
  });

  it('debe mostrar ejemplo de transformación cuando hay una transformación disponible', () => {
    render(
      <FieldCompatibilityVisualizer 
        sourceField={mockSourceField} 
        targetField={mockTargetField}
        showConnector
      />
    );
    
    expect(screen.getByText(/impacto en rendimiento/i)).toBeInTheDocument();
    expect(screen.getByText(/valor original/i)).toBeInTheDocument();
    expect(screen.getByText(/transformado/i)).toBeInTheDocument();
  });
});
