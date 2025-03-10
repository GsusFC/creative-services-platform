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

  // Handle service note changes
  const handleServiceNotesChange = (serviceId: string, notes: string) => {
    setServiceNotes({
      ...serviceNotes,
      [serviceId]: notes
    });
  };

  // Save notes for a service
  const saveServiceNotes = (serviceId: string) => {
    if (serviceNotes[serviceId] !== undefined) {
      updateServiceNotes(serviceId, serviceNotes[serviceId]);
    }
  };

  // Save budget
  const handleSaveBudget = () => {
    // Validate at least one service
    if (selectedServices.length === 0) {
      setSaveMessage({
        type: 'error',
        text: 'Please add at least one service to save the budget'
      });
      return;
    }

    // Validate client info
    if (!clientInfo.name || !clientInfo.email) {
      setActiveTab('client');
      setSaveMessage({
        type: 'error',
        text: 'Client name and email are required'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Create object to save
      const budgetData = {
        client: clientInfo,
        project: projectInfo,
        services: selectedServices,
        totalPrice: getTotalPrice(),
      };

      // Save using the service
      const code = saveBudget(budgetData);

      // Show success message
      setSaveMessage({
        type: 'success',
        text: `Budget saved successfully with code: ${code}`
      });

      // Clear form after 2 seconds
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
      console.error('Error saving budget:', error);
      setSaveMessage({
        type: 'error',
        text: 'Error saving the budget'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format price to show in USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(price);
  };

  return (
    <div className="mt-6" style={{ fontFamily: 'var(--font-geist-mono)' }}>
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button 
          className={`px-4 py-2 text-xs font-medium uppercase transition-colors ${
            activeTab === 'services' 
              ? 'text-[#00ff00] border-b border-[#00ff00]' 
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab('services')}
        >
          Services ({selectedServices.length})
        </button>
        <button 
          className={`px-4 py-2 text-xs font-medium uppercase transition-colors ${
            activeTab === 'client' 
              ? 'text-[#00ff00] border-b border-[#00ff00]' 
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab('client')}
        >
          Client
        </button>
        <button 
          className={`px-4 py-2 text-xs font-medium uppercase transition-colors ${
            activeTab === 'project' 
              ? 'text-[#00ff00] border-b border-[#00ff00]' 
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab('project')}
        >
          Project
        </button>
      </div>

      {/* Messages */}
      {saveMessage && (
        <div className={`p-3 mb-4 text-xs border ${
          saveMessage.type === 'error' 
            ? 'bg-red-900/20 border-red-500/30 text-red-300' 
            : 'bg-green-900/20 border-green-500/30 text-green-300'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Content based on active tab */}
      <div className="mb-6">
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            {selectedServices.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                NO SERVICES ADDED YET
              </div>
            ) : (
              <ul className="space-y-2">
                {selectedServices.map(service => (
                  <li key={service.id} className="border-l border-[#00ff00]/50 bg-black/10 py-1.5 px-2 flex group">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs uppercase text-white truncate pr-2">{service.name}</h4>
                        <span className="text-[#00ff00] text-xs">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                      
                      <button 
                        className="text-[10px] text-white/40 hover:text-white inline-flex items-center"
                        onClick={() => {
                          // Show prompt for notes
                          const notes = prompt("Add notes:", serviceNotes[service.id] || service.notes || '');
                          if (notes !== null) {
                            handleServiceNotesChange(service.id, notes);
                            saveServiceNotes(service.id);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        {service.notes ? 'EDIT NOTES' : 'ADD NOTES'}
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeService(service.id)}
                      className="text-red-500/40 group-hover:text-red-500 ml-2 self-center p-1"
                      aria-label="Remove"
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

        {/* Client Tab */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={clientInfo.name} 
                onChange={(e) => updateClientInfo({ name: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
                placeholder="Client name"
              />
            </div>
            
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                value={clientInfo.email} 
                onChange={(e) => updateClientInfo({ email: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Phone
              </label>
              <input 
                type="tel" 
                value={clientInfo.phone} 
                onChange={(e) => updateClientInfo({ phone: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Company
              </label>
              <input 
                type="text" 
                value={clientInfo.company} 
                onChange={(e) => updateClientInfo({ company: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
                placeholder="Company name (optional)"
              />
            </div>
          </div>
        )}

        {/* Project Tab */}
        {activeTab === 'project' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Project Description
              </label>
              <textarea 
                value={projectInfo.description} 
                onChange={(e) => updateProjectInfo({ description: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
                placeholder="Briefly describe the project or its objectives..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Timeline
              </label>
              <select 
                value={projectInfo.timeline} 
                onChange={(e) => updateProjectInfo({ timeline: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
              >
                <option value="urgent">URGENT (less than 1 month)</option>
                <option value="short">SHORT TERM (1-3 months)</option>
                <option value="medium">MEDIUM TERM (3-6 months)</option>
                <option value="flexible">FLEXIBLE / UNDEFINED</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-white/80 mb-1 uppercase">
                Contact Preference
              </label>
              <select 
                value={projectInfo.contactPreference} 
                onChange={(e) => updateProjectInfo({ contactPreference: e.target.value })} 
                className="w-full bg-black border border-white/10 rounded p-2.5 text-white text-sm focus:border-white/30 focus:outline-none"
              >
                <option value="email">EMAIL</option>
                <option value="phone">PHONE</option>
                <option value="videocall">VIDEO CALL</option>
                <option value="meeting">IN-PERSON MEETING</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Summary and total */}
      <div className="border border-white/10 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/60 text-sm">SUBTOTAL ({selectedServices.length} services):</span>
          <span className="text-white">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-white">TOTAL:</span>
          <span className="text-[#00ff00] font-bold">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={clearSelection}
            className="px-4 py-2 border border-white/20 hover:border-white/40 text-white/80 text-xs uppercase transition-colors"
          >
            Clear
          </button>
          
          <button
            onClick={handleSaveBudget}
            disabled={isSaving || selectedServices.length === 0}
            className={`flex-1 px-4 py-2 text-xs uppercase font-bold transition-colors ${
              isSaving || selectedServices.length === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-[#00ff00] text-black hover:bg-[#00ff00]/90'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
