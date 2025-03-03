'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FilterIcon, ArrowRightIcon, SearchIcon } from 'lucide-react';

/**
 * Página de listado de Case Studies
 * Muestra todos los casos de estudio disponibles con opciones de filtrado
 */

export default function CaseStudiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Datos de ejemplo (en producción vendrían de una API)
  const caseStudies = [
    {
      id: '1',
      title: 'Rediseño Digital para FinTech',
      category: 'Finanzas',
      tags: ['UX/UI', 'Desarrollo Web', 'SEO'],
      thumbnail: '/placeholder.jpg',
      description: 'Transformación digital completa para empresa líder en el sector financiero.'
    },
    {
      id: '2',
      title: 'Plataforma E-commerce Premium',
      category: 'Retail',
      tags: ['E-commerce', 'Diseño Web', 'Marketing Digital'],
      thumbnail: '/placeholder.jpg',
      description: 'Desarrollo de experiencia de compra única para marca de lujo.'
    },
    {
      id: '3',
      title: 'App móvil para Salud',
      category: 'Salud',
      tags: ['App Móvil', 'UX/UI', 'API'],
      thumbnail: '/placeholder.jpg',
      description: 'Solución digital para seguimiento de salud y bienestar personal.'
    },
    {
      id: '4',
      title: 'Portal Educativo Interactivo',
      category: 'Educación',
      tags: ['E-learning', 'Diseño Web', 'Desarrollo'],
      thumbnail: '/placeholder.jpg',
      description: 'Plataforma educativa con herramientas interactivas para estudiantes.'
    },
    {
      id: '5',
      title: 'Dashboard Analytics B2B',
      category: 'Tecnología',
      tags: ['Analytics', 'Dashboard', 'B2B'],
      thumbnail: '/placeholder.jpg',
      description: 'Solución de visualización de datos para empresa tecnológica.'
    },
    {
      id: '6',
      title: 'Plataforma SaaS para Marketing',
      category: 'Marketing',
      tags: ['SaaS', 'Marketing', 'Automatización'],
      thumbnail: '/placeholder.jpg',
      description: 'Software como servicio para gestión de campañas de marketing.'
    }
  ];
  
  // Lista de categorías únicas para el filtro
  const categories = Array.from(new Set(caseStudies.map(cs => cs.category)));
  
  // Filtrar los case studies según búsqueda y categoría
  const filteredCaseStudies = caseStudies.filter(cs => {
    const matchesSearch = searchTerm === '' || 
      cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cs.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || cs.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Casos de Estudio</h1>
            <p className="text-xl text-gray-300 mb-10">
              Explora nuestros casos de éxito y descubre cómo podemos ayudar a tu empresa a alcanzar sus objetivos digitales.
            </p>
            
            {/* Buscador */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o tecnología..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center space-x-2">
            <FilterIcon size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            
            <div className="flex flex-wrap gap-2 ml-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === null 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Case Studies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          {filteredCaseStudies.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o categorías</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map(caseStudy => (
                <Link 
                  href={`/case-studies/${caseStudy.id}`} 
                  key={caseStudy.id}
                  className="group block"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${caseStudy.thumbnail})` }}
                    ></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                          {caseStudy.title}
                        </h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {caseStudy.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {caseStudy.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {caseStudy.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-end">
                        <span className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:underline">
                          Ver caso
                          <ArrowRightIcon size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-purple-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para iniciar tu proyecto?</h2>
          <p className="text-purple-200 max-w-3xl mx-auto mb-8">
            Nuestro equipo de expertos está listo para ayudarte a transformar tu negocio a través de soluciones digitales innovadoras.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Contactar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
