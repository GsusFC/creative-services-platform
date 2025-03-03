'use client';

/**
 * Panel de Onboarding
 * 
 * Componente que guía al usuario a través del proceso de mapeo de campos
 * con instrucciones paso a paso y ejemplos visuales
 */

import { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X, Check, HelpCircle, Lightbulb, Eye, Save, CheckCircle2 } from 'lucide-react';

interface OnboardingPanelProps {
  currentStep: number;
  totalSteps: number;
  onCloseAction: () => void;
  onNextAction: () => void;
  onPreviousAction: () => void;
  onCompleteAction: () => void;
}

export default function OnboardingPanel({
  currentStep,
  totalSteps,
  onCloseAction,
  onNextAction,
  onPreviousAction,
  onCompleteAction,
}: OnboardingPanelProps) {
  const [animateIn, setAnimateIn] = useState(false);
  
  // Efecto de animación al entrar
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Contenido de los pasos
  const steps = [
    {
      title: 'Bienvenido al Field Mapper V4',
      content: (
        <div className="space-y-4">
          <p className="text-white/90 mb-4">
            Esta herramienta te permite mapear campos entre Notion y Case Studies de forma intuitiva.
          </p>
          <div className="flex items-center p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg mb-4">
            <BookOpen className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
            <p className="text-sm text-white/90">
              Te guiaremos a través del proceso en unos sencillos pasos para que puedas aprovechar al máximo esta herramienta.
            </p>
          </div>
          <p className="text-sm text-white/70">
            Puedes cerrar esta guía en cualquier momento y volver a ella desde el botón de ayuda en la esquina inferior derecha.
          </p>
        </div>
      ),
    },
    {
      title: 'Selecciona una Base de Datos',
      content: (
        <div className="space-y-5">
          <p className="text-white/90">
            Primero, selecciona la base de datos de Notion que contiene tus proyectos.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center mb-3 pb-2 border-b border-white/10">
              <div className="w-4 h-4 rounded-full bg-teal-400 mr-2"></div>
              <span className="font-medium text-teal-300">Selector de Base de Datos</span>
            </div>
            <p className="text-sm text-white/80">
              Usa el menú desplegable para elegir entre tus bases de datos conectadas.
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/5 border border-yellow-500/30 rounded-lg">
            <HelpCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90">
              Si no ves tus bases de datos, asegúrate de haber configurado correctamente la API de Notion.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mapea tus Campos',
      content: (
        <div className="space-y-5">
          <p className="text-white/90">
            Arrastra campos desde el panel de Notion al panel de Case Study para crear mapeos.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-teal-500/20 rounded-lg p-3">
              <div className="text-xs font-medium mb-2 text-teal-300 pb-1 border-b border-white/10">Campos de Notion</div>
              <div className="space-y-2">
                <div className="bg-black/30 p-2 rounded border border-white/10 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                  Título
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/10 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                  Descripción
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-emerald-500/20 rounded-lg p-3">
              <div className="text-xs font-medium mb-2 text-emerald-300 pb-1 border-b border-white/10">Campos de Case Study</div>
              <div className="space-y-2">
                <div className="bg-black/30 p-2 rounded border border-white/10 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  project_name
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/10 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  description
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/5 border border-teal-500/30 rounded-lg">
            <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90">
              Los indicadores de compatibilidad te mostrarán si los campos son compatibles o requieren transformación.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Transformaciones',
      content: (
        <div className="space-y-5">
          <p className="text-white/90">
            Algunos campos pueden requerir transformaciones para ser compatibles.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="font-medium text-teal-300">Transformación</span>
              <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">Requerida</span>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Las transformaciones convierten datos de un formato a otro, como convertir un array a texto.
            </p>
            <div className="flex justify-center">
              <div className="flex items-center">
                <div className="px-3 py-1.5 bg-teal-500/20 text-teal-300 rounded text-xs border border-teal-500/30">Array</div>
                <div className="w-10 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 mx-3"></div>
                <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded text-xs border border-emerald-500/30">Texto</div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/5 border border-teal-500/30 rounded-lg">
            <Lightbulb className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90">
              Haz clic en un mapeo que requiera transformación para configurarla. Puedes usar funciones como <code className="bg-white/10 px-1.5 py-0.5 rounded text-teal-200">toString()</code> o <code className="bg-white/10 px-1.5 py-0.5 rounded text-teal-200">Number()</code>.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Previsualización y Guardado',
      content: (
        <div className="space-y-5">
          <p className="text-white/90">
            Previsualiza el resultado y guarda tu configuración.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-teal-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <Eye className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium text-teal-300">Previsualizar</span>
              </div>
              <p className="text-sm text-white/80">
                Comprueba cómo se verán tus datos convertidos antes de guardar.
              </p>
            </div>
            <div className="bg-white/5 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <Save className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Guardar</span>
              </div>
              <p className="text-sm text-white/80">
                Guarda tu configuración para usarla en cualquier momento.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/5 border border-emerald-500/30 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90">
              ¡Ya estás listo para convertir tus proyectos de Notion a Case Studies! Utiliza los botones de la barra superior para previsualizar y guardar tu configuración.
            </p>
          </div>
        </div>
      ),
    },
  ];
  
  // Obtener el paso actual
  const step = steps[currentStep - 1];
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-black/60 border border-white/10 rounded-lg w-full max-w-2xl transition-transform duration-300 ${animateIn ? 'transform-none' : 'transform translate-y-8'} text-white/90 overflow-hidden font-mono`}>
        <div className="flex items-center justify-between border-b border-white/10 p-4 bg-black/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-medium text-white/90">{step.title}</h2>
          </div>
          <button 
            onClick={onCloseAction}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white/90" />
          </button>
        </div>
        
        <div className="p-6">
          {step.content}
        </div>
        
        <div className="flex items-center justify-between border-t border-white/10 p-4 bg-black/40">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${currentStep === i + 1 ? 'bg-teal-400' : 'bg-white/20'} transition-colors`}
              ></div>
            ))}
          </div>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={onPreviousAction}
                className="flex items-center gap-1.5 px-3 py-2 bg-black/40 text-white/80 hover:bg-black/60 hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md"
                aria-label="Ir al paso anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={onNextAction}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 rounded-md text-teal-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                aria-label="Ir al siguiente paso"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onCompleteAction}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 rounded-md text-teal-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                aria-label="Completar tutorial"
              >
                Completar
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
