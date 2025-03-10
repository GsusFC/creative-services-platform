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

  // Get services filtered by category
  const filteredServices = selectedCategory 
    ? services.filter(service => service.category_id === selectedCategory)
    : services;

  // Get icon for category
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
        <h3 className="text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>ERROR LOADING SERVICES</h3>
        <p style={{ fontFamily: 'var(--font-geist-mono)' }}>{error}</p>
      </div>
    );
  }

  return (
    <DragDropProvider>
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full"
          >
            <div className="bg-black border border-white/10 p-6 rounded-lg shadow-2xl">
              <h2 
                className="text-2xl uppercase mb-6 text-white"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <span className="inline-block w-8 h-8 mr-2 text-[#00ff00] bg-[#00ff00]/10 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </span>
                CATEGORIES
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  className={`px-3 py-2 text-sm transition-all border
                            ${selectedCategory === null 
                              ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                              : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'}`}
                  onClick={() => setSelectedCategory(null)}
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  ALL
                </button>
                
                {categories.map(category => (
                  <button 
                    key={category.id}
                    className={`px-3 py-2 text-sm flex items-center gap-2 transition-all border
                              ${selectedCategory === category.id 
                                ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                                : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'}`}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    <span className="text-current">
                      {getCategoryIcon(category.icon)}
                    </span>
                    {category.name.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <h2 
                className="text-2xl uppercase mb-4 text-white"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <span className="inline-block w-8 h-8 mr-2 text-[#00ff00] bg-[#00ff00]/10 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </span>
                SERVICES
              </h2>
              
              {filteredServices.length === 0 ? (
                <p className="text-white/60 text-center py-8" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  NO SERVICES AVAILABLE IN THIS CATEGORY
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.05 // Each card appears with a slight delay
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full"
          >
            <div className="bg-black border border-white/10 p-6 rounded-lg shadow-2xl">
              <h2 
                className="text-2xl uppercase mb-4 text-white"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <span className="inline-block w-8 h-8 mr-2 text-[#00ff00] bg-[#00ff00]/10 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                YOUR BUDGET
              </h2>
              
              <DropZone />
              <BudgetSummary />
            </div>
          </motion.div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
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
