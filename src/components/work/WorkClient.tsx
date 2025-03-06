"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCaseStudies } from '@/lib/case-studies/service';
import { CaseStudy } from '@/types/case-study';
import { motion } from 'framer-motion';

export default function WorkClient() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Cargar los case studies al montar el componente
  useEffect(() => {
    async function loadCaseStudies() {
      try {
        setIsLoading(true);
        const data = await getAllCaseStudies();
        
        // Ordenar por campo order
        const sortedCaseStudies = data.sort((a, b) => a.order - b.order);
        
        setCaseStudies(sortedCaseStudies);
        setFilteredCaseStudies(sortedCaseStudies);
        
        // Extraer todos los tags únicos
        const uniqueTags = Array.from(
          new Set(sortedCaseStudies.flatMap(cs => cs.tags))
        ).sort();
        
        setAllTags(uniqueTags);
      } catch (error) {
        console.error('Error al cargar los case studies:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCaseStudies();
  }, []);
  
  // Filtrar case studies por tag seleccionado
  const filterByTag = (tag: string | null) => {
    setActiveTag(tag);
    
    if (!tag) {
      setFilteredCaseStudies(caseStudies);
      return;
    }
    
    const filtered = caseStudies.filter(cs => cs.tags.includes(tag));
    setFilteredCaseStudies(filtered);
  };
  
  // Componente para mostrar un case study en formato cuadrado
  const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
    // Encontrar la primera imagen para la miniatura
    const thumbnailImage = caseStudy.mediaItems.find(m => m.type === "image");
    const thumbnailUrl = thumbnailImage ? thumbnailImage.url : "/placeholder.jpg";
    
    return (
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -10 }}
      >
        <Link href={`/work/${caseStudy.slug}`} className="block group">
          <div className="relative aspect-square overflow-hidden mb-4">
            <Image
              src={thumbnailUrl}
              alt={caseStudy.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="text-xl font-druk uppercase mb-1">{caseStudy.title}</h3>
          <p className="text-sm text-gray-600 font-mono">{caseStudy.client}</p>
        </Link>
      </motion.div>
    );
  };

  // Animaciones para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <motion.div 
        className="w-full pt-36 pb-24 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-druk tracking-tight uppercase mb-8">
            TRABAJOS
          </h1>
        </div>
      </motion.div>
      
      {/* Filtros de tags */}
      <motion.div 
        className="w-full px-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-wrap items-center">
            <button
              onClick={() => filterByTag(null)}
              className={`px-4 py-2 mr-3 mb-3 rounded-full transition-colors ${
                activeTag === null
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => filterByTag(tag)}
                className={`px-4 py-2 mr-3 mb-3 rounded-full transition-colors ${
                  activeTag === tag
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Grid de Case Studies */}
      <motion.div 
        className="w-full px-8 mb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-screen-xl mx-auto">
          {isLoading ? (
            // Mostrar skeletons mientras carga
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="mb-8 animate-pulse">
                  <div className="aspect-square bg-gray-200 mb-4"></div>
                  <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCaseStudies.length > 0 ? (
            // Mostrar case studies
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCaseStudies.map(caseStudy => (
                <motion.div key={caseStudy.id} variants={itemVariants}>
                  <CaseStudyCard caseStudy={caseStudy} />
                </motion.div>
              ))}
            </div>
          ) : (
            // Mostrar mensaje si no hay resultados
            <div className="text-center py-12">
              <p className="text-xl font-mono">
                No se encontraron proyectos con el filtro seleccionado
              </p>
              <button
                onClick={() => filterByTag(null)}
                className="mt-4 px-6 py-3 bg-black text-white font-mono hover:bg-gray-800 transition-colors"
              >
                Ver todos los proyectos
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
