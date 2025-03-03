'use client';

/**
 * Mensaje de Estado
 * 
 * Componente para mostrar mensajes de éxito, error o información
 * con animación y desaparición automática
 */

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type StatusType = 'success' | 'error' | 'info';

interface StatusMessageProps {
  message: string;
  type?: StatusType;
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

export default function StatusMessage({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  show,
}: StatusMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Configuración según el tipo
  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      bgColor: 'bg-black/80',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-white/90',
      shadowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      progressColor: 'bg-emerald-500',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      bgColor: 'bg-black/80',
      borderColor: 'border-red-500/30',
      textColor: 'text-white/90',
      shadowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
      progressColor: 'bg-red-500',
    },
    info: {
      icon: <Info className="w-5 h-5 text-teal-400" />,
      bgColor: 'bg-black/80',
      borderColor: 'border-teal-500/30',
      textColor: 'text-white/90',
      shadowColor: 'shadow-[0_0_15px_rgba(20,184,166,0.3)]',
      progressColor: 'bg-teal-500',
    },
  };
  
  // Efecto para mostrar/ocultar con animación
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Ocultar automáticamente después de la duración
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300); // Tiempo para la animación de salida
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose]);
  
  // Manejar cierre manual
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  if (!show && !isVisible) return null;
  
  const { icon, bgColor, borderColor, textColor, shadowColor, progressColor } = config[type];
  
  return (
    <div 
      className={`fixed top-6 right-6 z-50 flex flex-col max-w-md rounded-xl border backdrop-blur-sm transition-all duration-300 ${bgColor} ${borderColor} ${shadowColor} ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-[-20px]'}`}
      role="alert"
    >
      <div className="flex items-center p-4">
        <div className="mr-3 flex-shrink-0">
          {icon}
        </div>
        <div className={`flex-1 ${textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="ml-3 p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-white/70 hover:text-white/90" />
        </button>
      </div>
      
      {/* Barra de progreso */}
      <div className="h-1 w-full bg-white/10 rounded-b-xl overflow-hidden">
        <div 
          className={`h-full ${progressColor} transition-all duration-300 ease-linear`}
          style={{ 
            width: isVisible ? '0%' : '100%', 
            transitionDuration: `${duration}ms`,
            animation: isVisible ? `progress ${duration}ms linear forwards` : 'none'
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
