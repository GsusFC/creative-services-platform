'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

// Componente principal para la página de paquetes de servicios
const PacksPage = () => {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <div className="pt-10 md:pt-20 px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <header className="mb-10 md:mb-16">
            <h1 className="text-4xl md:text-6xl text-white font-druk mb-4">
              Paquetes de Diseño
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-2xl">
              Soluciones completas para tus necesidades de diseño. Nuestros paquetes combinan 
              diferentes servicios para ofrecerte un valor integral con precios optimizados.
            </p>
            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-md flex items-start">
              <InfoIcon className="text-cyan-400 w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/60">
                Limitación: Solo puedes contratar un paquete de cada tipo por mes. Para más información sobre los términos y condiciones,
                contacta con tu responsable de cuenta.
              </p>
            </div>
          </header>
          
          {/* Grid de Paquetes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Identity Pack */}
            <PackCard 
              title="Identity Pack" 
              credits={70} 
              price={4200}
              variant="identity"
              services={[
                { name: "Co-Design Workshop", credits: 15, description: "FigJam Session" },
                { name: "Conceptualization", credits: 10, description: "Research & Moodboards" },
                { name: "Identidad Lite", credits: 45, description: "Logo, Sistema Visual, Colores, Tipografías, Social Assets" }
              ]}
            />
            
            {/* Web Design Pack */}
            <PackCard 
              title="Web Design Pack" 
              credits={70} 
              price={4200}
              variant="web"
              services={[
                { name: "Co-Design Workshop", credits: 15, description: "FigJam Session" },
                { name: "Conceptualization", credits: 5, description: "Research & Moodboards" },
                { name: "Landing/Website", credits: 40, description: "UI Design, No-Code Framer (hasta 4 páginas)" },
                { name: "Handoff", credits: 10, description: "Specs & Tutorial" }
              ]}
            />
            
            {/* Starter Pack */}
            <PackCard 
              title="Starter Pack" 
              subtitle="Design as a Sprint"
              credits={115} 
              price={6900}
              variant="starter"
              services={[
                { name: "Co-Design Workshop", credits: 15, description: "FigJam Session" },
                { name: "Conceptualization", credits: 10, description: "Research & Moodboards" },
                { name: "Identidad Lite", credits: 45, description: "Logo, Sistema Visual, Colores, Tipografías, Social Assets" },
                { name: "Landing de lanzamiento", credits: 40, description: "UI Design, No-Code Framer" },
                { name: "Deck", credits: 5, description: "Presentación de proyecto" }
              ]}
            />
            
            {/* Branding In Public Pack */}
            <PackCard 
              title="Branding in Public" 
              subtitle="BIP"
              credits={200} 
              price={12000}
              variant="branding"
              services={[
                { name: "Workshop Jam Session", credits: 20, description: "Broadcast (Podcast, Twitch, Figma) y Formulario (Mini o customizado)" },
                { name: "Estrategia Lite", credits: 40, description: "Planteamiento estratégico de la marca" },
                { name: "Dinámicas Colaborativas", credits: 10, description: "Sesiones de trabajo colaborativo" },
                { name: "Identidad Lite", credits: 100, description: "Logo, Sistema Visual, Colores, Tipografías" },
                { name: "Brand Center", credits: 20, description: "Centro de recursos de marca" }
              ]}
            />
          </div>
          

        </div>
      </div>
    </main>
  );
};

// Componente para tarjetas de paquetes
interface Service {
  name: string;
  credits: number;
  description: string;
}

interface PackCardProps {
  title: string;
  subtitle?: string;
  credits: number;
  price: number;
  services: Service[];
  variant?: 'identity' | 'web' | 'starter' | 'branding';
}

const PackCard: React.FC<PackCardProps> = ({ 
  title, 
  subtitle, 
  credits, 
  price, 
  services,
  variant = 'identity'
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <div className={`h-full bg-black border border-white/20 hover:border-white/40 p-6 sm:p-8 relative group transition-all duration-300 hover:translate-y-[-5px] flex flex-col ${getPackVariantClasses(variant)}`}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        <div className="text-center mb-8">
          <h3 
            className="text-sm mb-1 text-white uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-white/60 mb-2">{subtitle}</p>
          )}
          <div 
            className="text-2xl sm:text-3xl md:text-4xl mb-1 leading-none text-white"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            {price.toLocaleString('es-ES')}€
          </div>
          <div 
            className="text-white text-xs uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {credits} CRÉDITOS
          </div>
        </div>
        
        {/* Services list */}
        <div className="space-y-3 mb-8">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span 
                    className="text-white text-xs tracking-tight uppercase"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {service.name}
                  </span>
                </div>
                <span className="text-xs text-white/50 ml-2 whitespace-nowrap">
                  {service.credits} CR
                </span>
              </div>
              <p className="text-[10px] text-white/60 line-clamp-2 mt-0.5">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-auto">
          <Link href="/do-it-yourself">
            <button 
              className={`w-full h-11 text-sm rounded-none transition-all duration-300 tracking-wide uppercase ${getButtonClasses(variant)}`}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              CONTRATAR
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Función para obtener las clases CSS según la variante del paquete
const getPackVariantClasses = (variant: 'identity' | 'web' | 'starter' | 'branding') => {
  switch (variant) {
    case 'identity':
      return 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-purple-900/20 before:to-transparent before:opacity-40 before:z-[-5]';
    case 'web':
      return 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-900/20 before:to-transparent before:opacity-40 before:z-[-5]';
    case 'starter':
      return 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-cyan-900/20 before:to-transparent before:opacity-40 before:z-[-5]';
    case 'branding':
      return 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-emerald-900/20 before:to-transparent before:opacity-40 before:z-[-5]';
    default:
      return '';
  }
};

// Función para obtener las clases CSS para los botones según la variante
const getButtonClasses = (variant: 'identity' | 'web' | 'starter' | 'branding') => {
  switch (variant) {
    case 'identity':
      return 'bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white';
    case 'web':
      return 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white';
    case 'starter':
      return 'bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white';
    case 'branding':
      return 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white';
    default:
      return 'bg-white hover:bg-white/90 text-black';
  }
};

export default PacksPage;
