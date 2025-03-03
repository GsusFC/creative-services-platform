'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import React from 'react'

// Importamos el servicio desde el servicio centralizado y la interfaz desde el servicio mock
import { caseStudiesService } from '@/lib/cms/case-studies-service'
import { CaseStudyDetail } from '@/lib/case-studies/mock-service'

// Interfaz para elementos de galería que pueden ser objetos
interface GalleryItem {
  url: string;
  [key: string]: unknown;
}

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  // Definimos la referencia del video al inicio para evitar el error de hook condicional
  const videoRef = useRef<HTMLVideoElement>(null);
  const [caseStudy, setCaseStudy] = useState<CaseStudyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Para Next.js 14, deberíamos usar React.use para desenvolver params
    // Pero por ahora usamos una solución alternativa para la compatibilidad
    const slug = params?.slug;

    const loadCaseStudy = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Usamos nuestro servicio centralizado para obtener el caso de estudio
        const caseStudyData = await caseStudiesService.getCaseStudy(slug);
        
        if (caseStudyData) {
          setCaseStudy(caseStudyData);
        } else {
          throw new Error('No se encontró el caso de estudio');
        }
        
      } catch (error) {
        console.error('Error al cargar el Case Study:', error);
        setError('No se pudo cargar el Case Study.');
        toast.error('Error al cargar el Case Study');
      } finally {
        setLoading(false);
      }
    };
    
    loadCaseStudy();
  }, [params?.slug]); // Usamos params?.slug de manera segura

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#00ff00]" />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <p className="text-xl text-red-400 mb-4">{error || 'No se encontró el caso de estudio'}</p>
        <Link 
          href="/cases"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a casos de estudio</span>
        </Link>
      </div>
    );
  }

  // Función para renderizar elementos de galería (1 a ancho completo o 2 cuadradas)
  const renderGalleryItems = () => {
    if (!caseStudy.gallery || caseStudy.gallery.length === 0) return null;
    
    const galleryItems = [];
    
    for (let i = 0; i < caseStudy.gallery.length; i++) {
      // Si quedan dos imágenes y queremos mostrarlas como cuadradas lado a lado
      if (i + 1 < caseStudy.gallery.length && (i % 3 === 1)) { // Cada tercera fila (índice 1, 4, 7...) muestra par de imágenes
        galleryItems.push(
          <div key={`pair-${i}`} className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square w-full overflow-hidden group">
              <Image
                src={caseStudy.gallery[i]}
                alt={`${caseStudy.title} - Imagen ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden group">
              <Image
                src={caseStudy.gallery[i + 1]}
                alt={`${caseStudy.title} - Imagen ${i + 2}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        );
        i++; // Saltamos la siguiente imagen ya que la hemos incluido en este par
      } else {
        // Imagen a ancho completo en formato 16:9
        galleryItems.push(
          <div key={`full-${i}`} className="relative aspect-video w-full overflow-hidden group">
            <Image
              src={caseStudy.gallery[i]}
              alt={`${caseStudy.title} - Imagen ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        );
      }
    }
    
    return galleryItems;
  };

  return (
    <main className="min-h-screen bg-black text-white font-geist">
      {/* Hero Section - Full Width 16:9 */}
      <section className="relative w-full h-screen max-h-[1080px] overflow-hidden">
        {/* Hero Media - Imagen o Video */}
        <div className="absolute inset-0 bg-black">
          {caseStudy.heroVideo ? (
            <video 
              ref={videoRef}
              src={caseStudy.heroVideo}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : caseStudy.heroImage ? (
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
            />
          ) : null}
        </div>
        
        {/* Botón volver arriba */}
        <div className="absolute top-8 left-8">
          <Link 
            href="/cases"
            className="flex items-center gap-2 text-white/70 hover:text-white w-fit font-geist-mono text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>VOLVER</span>
          </Link>
        </div>
      </section>
      
      {/* Content Section - Dos columnas (a ancho completo) */}
      <section className="py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 xl:gap-24 w-full mx-auto px-10">
          {/* Columna izquierda - Cliente y Eslogan */}
          <div>
            <p className="text-sm text-[#00ff00] font-geist-mono uppercase tracking-wider mb-2">PROYECTO DESTACADO</p>
            {caseStudy.client_name && (
              <p className="text-lg text-white/80 font-geist-mono mb-4">{caseStudy.client_name}</p>
            )}
            
            <h1 className="text-5xl md:text-6xl font-druk uppercase mb-6 leading-tight">
              {caseStudy.title}
            </h1>
            
            {caseStudy.tagline && (
              <p className="text-2xl md:text-3xl text-white/90 font-druk uppercase leading-tight">
                {caseStudy.tagline}
              </p>
            )}
          </div>
          
          {/* Columna derecha - Descripción y Servicios */}
          <div className="space-y-12">
            <div>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                {caseStudy.description}
              </p>
            </div>
            
            {caseStudy.services && caseStudy.services.length > 0 && (
              <div>
                <h3 className="text-sm text-[#00ff00] font-geist-mono uppercase tracking-wider mb-4">SERVICIOS</h3>
                <div className="flex flex-wrap gap-3">
                  {caseStudy.services.map(service => (
                    <span 
                      key={service}
                      className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm font-geist-mono"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Galería - Mezcla de formatos (a ancho completo) */}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <section className="pb-24 w-full">
          <div className="w-full mx-auto px-10 grid grid-cols-1 gap-12">
            {renderGalleryItems()}
          </div>
        </section>
      )}
      
      {/* CTA Section (ancho completo) */}
      <section className="py-32 bg-black border-t border-white/10">
        <div className="w-full mx-auto px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-druk uppercase mb-8">¿LISTO PARA TU PRÓXIMO PROYECTO?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-geist">
            Nuestro equipo está listo para ayudarte a crear experiencias digitales excepcionales que impulsen tu negocio.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00ff00] text-black font-geist-mono font-bold rounded-none hover:bg-white transition-colors duration-300 uppercase tracking-wide"
          >
            <span>CONTACTAR</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </section>
      
      {/* Footer Navigation (ancho completo) */}
      <footer className="py-16 border-t border-white/10">
        <div className="w-full mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col gap-4 items-center md:items-start">
              <Link href="/" className="text-2xl font-druk text-white uppercase">STUDIO</Link>
              <p className="text-white/50 text-sm font-geist-mono">&copy; {new Date().getFullYear()} CREATIVE STUDIO. TODOS LOS DERECHOS RESERVADOS.</p>
            </div>
            
            <div className="flex gap-8 font-geist-mono text-sm uppercase">
              <Link href="/cases" className="text-white/70 hover:text-[#00ff00] transition-colors">Proyectos</Link>
              <Link href="/services" className="text-white/70 hover:text-[#00ff00] transition-colors">Servicios</Link>
              <Link href="/about" className="text-white/70 hover:text-[#00ff00] transition-colors">Nosotros</Link>
              <Link href="/contact" className="text-white/70 hover:text-[#00ff00] transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
