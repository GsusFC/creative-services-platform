'use client';

import React, { useState } from 'react';
import { useDragDrop } from './DragDropProvider';
import { saveBudget } from '../../services/localStorageService';

const BudgetSummary = () => {
  const { 
    selectedServices, 
    removeService, 
    updateServiceNotes, 
    clientInfo, 
    updateClientInfo,
    projectInfo,
    updateProjectInfo,
    getTotalPrice,
    clearSelection
  } = useDragDrop();

  const [activeTab, setActiveTab] = useState('services'); // 'services', 'client', 'project'
  const [serviceNotes, setServiceNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: string, text: string} | null>(null);

  // Manejar cambio de notas en un servicio
  const handleServiceNotesChange = (serviceId: string, notes: string) => {
    setServiceNotes({
      ...serviceNotes,
      [serviceId]: notes
    });
  };

  // Guardar notas en servicio
  const saveServiceNotes = (serviceId: string) => {
    if (serviceNotes[serviceId] !== undefined) {
      updateServiceNotes(serviceId, serviceNotes[serviceId]);
    }
  };

  // Guardar presupuesto
  const handleSaveBudget = () => {
    // Validar que tenga al menos un servicio
    if (selectedServices.length === 0) {
      setSaveMessage({
        type: 'error',
        text: 'Debes añadir al menos un servicio para guardar el presupuesto'
      });
      return;
    }

    // Validar información del cliente
    if (!clientInfo.name || !clientInfo.email) {
      setActiveTab('client');
      setSaveMessage({
        type: 'error',
        text: 'Se requiere el nombre y email del cliente'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Crear objeto para guardar
      const budgetData = {
        client: clientInfo,
        project: projectInfo,
        services: selectedServices,
        totalPrice: getTotalPrice(),
      };

      // Guardar usando el servicio
      const code = saveBudget(budgetData);

      // Mostrar mensaje de éxito
      setSaveMessage({
        type: 'success',
        text: `Presupuesto guardado correctamente con código: ${code}`
      });

      // Limpiar formulario tras 2 segundos
      setTimeout(() => {
        clearSelection();
        updateClientInfo({
          name: '',
          email: '',
          phone: '',
          company: '',
        });
        setServiceNotes({});
      }, 2000);
    } catch (error) {
      console.error('Error al guardar presupuesto:', error);
      setSaveMessage({
        type: 'error',
        text: 'Error al guardar el presupuesto'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Formatear precio para mostrar en EUR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(price);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      {/* Pestañas */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'services' 
            ? 'text-[#00ff00] border-b-2 border-[#00ff00]' 
            : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('services')}
        >
          Servicios ({selectedServices.length})
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'client' 
            ? 'text-[#00ff00] border-b-2 border-[#00ff00]' 
            : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('client')}
        >
          Cliente
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'project' 
            ? 'text-[#00ff00] border-b-2 border-[#00ff00]' 
            : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('project')}
        >
          Proyecto
        </button>
      </div>

      {/* Mensajes */}
      {saveMessage && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${
          saveMessage.type === 'error' 
            ? 'bg-red-900/30 border border-red-700 text-red-200' 
            : 'bg-green-900/30 border border-green-700 text-green-200'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Contenido según pestaña */}
      <div className="mb-6">
        {/* Tab Servicios */}
        {activeTab === 'services' && (
          <div>
            {selectedServices.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No has añadido ningún servicio aún
              </div>
            ) : (
              <ul className="space-y-2">
                {selectedServices.map(service => (
                  <li key={service.id} className="border-l-2 border-[#00ff00]/50 bg-black/20 py-1.5 px-2 flex group">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-mono text-sm truncate pr-2">{service.name}</h4>
                        <span className="text-[#00ff00] font-mono text-xs">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                      
                      <button 
                        className="text-[10px] text-gray-500 hover:text-white inline-flex items-center"
                        onClick={() => {
                          // Mostrar modal para notas o expandir la tarjeta
                          const notes = prompt("Añadir notas:", serviceNotes[service.id] || service.notes || '');
                          if (notes !== null) {
                            handleServiceNotesChange(service.id, notes);
                            saveServiceNotes(service.id);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        {service.notes ? 'Editar notas' : 'Añadir notas'}
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeService(service.id)}
                      className="text-red-500/40 group-hover:text-red-500 ml-2 self-center p-1"
                      aria-label="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tab Cliente */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={clientInfo.name} 
                onChange={(e) => updateClientInfo({ name: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                placeholder="Nombre del cliente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                value={clientInfo.email} 
                onChange={(e) => updateClientInfo({ email: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                placeholder="email@ejemplo.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Teléfono
              </label>
              <input 
                type="tel" 
                value={clientInfo.phone} 
                onChange={(e) => updateClientInfo({ phone: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                placeholder="+34 600 000 000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Empresa
              </label>
              <input 
                type="text" 
                value={clientInfo.company} 
                onChange={(e) => updateClientInfo({ company: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                placeholder="Nombre de la empresa (opcional)"
              />
            </div>
          </div>
        )}

        {/* Tab Proyecto */}
        {activeTab === 'project' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción del proyecto
              </label>
              <textarea 
                value={projectInfo.description} 
                onChange={(e) => updateProjectInfo({ description: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                placeholder="Describe brevemente el proyecto o sus objetivos..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Plazo de tiempo
              </label>
              <select 
                value={projectInfo.timeline} 
                onChange={(e) => updateProjectInfo({ timeline: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
              >
                <option value="urgent">Urgente (menos de 1 mes)</option>
                <option value="short">Corto plazo (1-3 meses)</option>
                <option value="medium">Medio plazo (3-6 meses)</option>
                <option value="flexible">Flexible / No definido</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Preferencia de contacto
              </label>
              <select 
                value={projectInfo.contactPreference} 
                onChange={(e) => updateProjectInfo({ contactPreference: e.target.value })} 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
              >
                <option value="email">Email</option>
                <option value="phone">Teléfono</option>
                <option value="videocall">Videollamada</option>
                <option value="meeting">Reunión presencial</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Resumen y total */}
      <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Subtotal ({selectedServices.length} servicios):</span>
          <span className="font-bold">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-[#00ff00] font-mono">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <div className="mt-4 flex justify-between gap-4">
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg text-sm transition-colors"
          >
            Limpiar
          </button>
          
          <button
            onClick={handleSaveBudget}
            disabled={isSaving || selectedServices.length === 0}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              isSaving || selectedServices.length === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#00ff00] text-black hover:bg-[#00ff00]/80'
            }`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Presupuesto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
