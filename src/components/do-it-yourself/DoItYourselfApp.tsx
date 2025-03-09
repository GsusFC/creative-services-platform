'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropProvider } from './DragDropProvider';
import { useNotionServices } from '../../hooks/useNotionServices';
import ServiceCard from './ServiceCard';
import DropZone from './DropZone';
import BudgetSummary from './BudgetSummary';

const DoItYourselfApp = () => {
  const { categories, services, loading, error } = useNotionServices();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Obtener servicios filtrados por categoría
  const filteredServices = selectedCategory 
    ? services.filter(service => service.category_id === selectedCategory)
    : services;

  // Obtener icono para la categoría
  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'palette': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      'code': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      'trending-up': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      'image': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      'video': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    };

    return icons[iconName] || (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-700 rounded-lg text-white">
        <h3 className="text-xl font-bold mb-2">Error al cargar servicios</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <DragDropProvider>
      <div className="px-4 md:px-8 bg-gradient-to-b from-black/40 to-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-3">
            <div className="sticky top-[100px] bg-black/30 p-5 rounded-2xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-mono mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Categorías
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${selectedCategory === null 
                              ? 'bg-[#00ff00] text-black shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Todos
                </button>
                
                {categories.map(category => (
                  <button 
                    key={category.id}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                              ${selectedCategory === category.id 
                                ? 'bg-[#00ff00] text-black shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="text-current">
                      {getCategoryIcon(category.icon)}
                    </span>
                    {category.name}
                  </button>
                ))}
              </div>
              
              <h2 className="text-xl font-mono mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Servicios
              </h2>
              
              {filteredServices.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay servicios disponibles en esta categoría</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.05 // Cada tarjeta aparece con un ligero retraso
                      }}
                    >
                      <ServiceCard 
                        id={service.id}
                        name={service.name}
                        description={service.description}
                        price={service.price}
                        category_id={service.category_id}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-mono mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Tu Presupuesto
              </h2>
              
              <DropZone />
              <BudgetSummary />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 0, 0.5);
        }
      `}</style>
    </DragDropProvider>
  );
};

export default DoItYourselfApp;
