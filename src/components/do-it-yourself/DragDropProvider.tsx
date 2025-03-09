'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  notes?: string;
}

interface DragDropContextType {
  // Servicios seleccionados/agregados al presupuesto
  selectedServices: Service[];
  // Métodos para manipular servicios
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  updateServiceNotes: (serviceId: string, notes: string) => void;
  // Información de cliente
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  // Métodos para actualizar información del cliente
  updateClientInfo: (info: Partial<{ name: string; email: string; phone: string; company: string }>) => void;
  // Información del proyecto
  projectInfo: {
    description: string;
    timeline: string;
    contactPreference: string;
  };
  // Métodos para actualizar información del proyecto
  updateProjectInfo: (info: Partial<{ description: string; timeline: string; contactPreference: string }>) => void;
  // Obtener total
  getTotalPrice: () => number;
  // Limpiar selección
  clearSelection: () => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop debe utilizarse dentro de un DragDropProvider');
  }
  return context;
};

export const DragDropProvider = ({ children }: { children: ReactNode }) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [projectInfo, setProjectInfo] = useState({
    description: '',
    timeline: 'medium', // Por defecto: medio plazo
    contactPreference: 'email', // Por defecto: email
  });

  // Añadir servicio al presupuesto
  const addService = (service: Service) => {
    // Verificar si el servicio ya está en la lista
    if (!selectedServices.some(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Eliminar servicio del presupuesto
  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
  };

  // Actualizar notas de un servicio
  const updateServiceNotes = (serviceId: string, notes: string) => {
    setSelectedServices(
      selectedServices.map(service => 
        service.id === serviceId ? { ...service, notes } : service
      )
    );
  };

  // Actualizar información del cliente
  const updateClientInfo = (info: Partial<{ name: string; email: string; phone: string; company: string }>) => {
    setClientInfo({ ...clientInfo, ...info });
  };

  // Actualizar información del proyecto
  const updateProjectInfo = (info: Partial<{ description: string; timeline: string; contactPreference: string }>) => {
    setProjectInfo({ ...projectInfo, ...info });
  };

  // Calcular precio total
  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  // Limpiar selección
  const clearSelection = () => {
    setSelectedServices([]);
  };

  const value = {
    selectedServices,
    addService,
    removeService,
    updateServiceNotes,
    clientInfo,
    updateClientInfo,
    projectInfo,
    updateProjectInfo,
    getTotalPrice,
    clearSelection,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};
