/**
 * Configuración centralizada para el módulo Do-It-Yourself
 */

// Configuración de accesibilidad
export const diyA11y = {
  // Etiquetas para secciones
  sections: {
    catalogTitle: 'Catálogo de elementos disponibles',
    budgetTitle: 'Resumen de presupuesto',
    filterTitle: 'Filtros y opciones',
    paginationRegion: 'Controles de paginación'
  },
  
  // Textos para botones y acciones
  actions: {
    addToCart: 'Añadir al presupuesto',
    removeFromCart: 'Eliminar del presupuesto',
    filterProducts: 'Filtrar productos',
    toggleSprint: 'Activar/desactivar modo sprint',
    viewDetails: 'Ver detalles',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    goToPage: 'Ir a la página'
  },
  
  // Descripciones y tooltips
  descriptions: {
    productCard: 'Tarjeta de producto con información básica',
    serviceCard: 'Tarjeta de servicio con información básica',
    packageCard: 'Tarjeta de paquete con información básica',
    totalAmount: 'Cantidad total del presupuesto',
    discountInfo: 'Información sobre el descuento aplicado',
    sprintInfo: 'El modo sprint incrementa el precio pero reduce los tiempos de entrega'
  },
  
  // Funciones de generación de etiquetas para accesibilidad
  agregarAPresupuesto: (nombre: string) => `Agregar ${nombre} al presupuesto`,
  verDetalles: (nombre: string) => `Ver detalles de ${nombre}`,
  eliminarDelPresupuesto: (nombre: string) => `Eliminar ${nombre} del presupuesto`
};

// Estilos centralizados
export const diyStyles = {
  colors: {
    primary: 'text-[#00ff00]',
    secondary: 'text-white/75',
    highlight: 'text-white',
    background: 'bg-black',
    card: {
      bg: 'bg-zinc-900/60',
      bgHover: 'bg-zinc-900/80',
      outline: 'border-white/10',
      highlightOutline: 'border-[#00ff00]/50'
    }
  },
  
  text: {
    // Todo mono siguiendo requisitos
    title: 'font-druk font-black text-white uppercase',
    subtitle: 'uppercase text-white/70',
    secondary: 'text-white/70',
    price: 'text-[#00ff00] font-bold font-mono',
    body: 'text-white/80 font-mono',
    small: 'text-white/50 font-mono',
    mono: 'font-mono'
  },
  
  layout: {
    card: 'rounded-lg p-4 h-full flex flex-col',
    section: 'mb-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    flexBetween: 'flex justify-between items-center',
    flexCenter: 'flex justify-center items-center'
  },
  
  animations: {
    transition: 'transition-all duration-300 ease-out',
    hover: 'hover:scale-[1.02]',
    pulse: 'active:scale-[0.98]'
  },
  
  buttons: {
    primary: 'bg-[#00ff00] text-black rounded-md px-4 py-2 hover:bg-[#00ff00]/90 transition-colors',
    secondary: 'bg-white/10 text-white rounded-md px-4 py-2 hover:bg-white/20 transition-colors',
    icon: 'p-2 rounded-full hover:bg-white/10 transition-colors',
    pagination: 'px-3 py-1 rounded hover:bg-white/10 transition-colors',
    disabled: 'bg-white/5 text-white/30 cursor-not-allowed'
  },
  
  // Estilos específicos para tarjetas
  // Contenedor principal clickable con efecto de borde degradado
  cardContainer: `group rounded-lg h-full relative cursor-pointer p-[2px] 
    before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-neutral-900 before:z-0
    after:absolute after:inset-0 after:rounded-lg after:p-[2px] after:content-[''] after:bg-gradient-to-r
    after:from-pink-500 after:via-purple-500 after:to-blue-500 after:opacity-0 after:transition-opacity
    hover:after:opacity-100 hover:translate-y-[-5px] transition-all duration-300 ease-out shadow-lg`,
  cardContent: 'flex flex-col h-full w-full bg-neutral-900 rounded-[9px] relative z-10 overflow-hidden border-none',
  cardHeader: 'relative',
  cardBody: 'p-4 flex-grow flex flex-col',
  cardTitle: 'text-sm text-white line-clamp-2 uppercase font-druk font-black tracking-tight mb-2',
  cardMetaContainer: 'flex flex-wrap gap-y-3 mt-2 mb-4',
  cardMetaItem: 'flex items-center text-sm mr-4',
  cardMetaLabel: 'text-white/60 mr-1 uppercase text-xs font-mono',
  cardMetaValue: 'text-white font-bold',
  cardDescription: 'text-sm text-white/70 mb-4 line-clamp-3 font-mono',
  cardTag: 'inline-block bg-white/10 text-white/90 px-2 py-0.5 text-xs rounded mr-2 mb-1 font-mono uppercase',
  
  // Estilos para tarjeta con borde degradado en hover
  cardInteractive: 'relative transition-all duration-300 ease-out hover:translate-y-[-5px] h-full p-[2px] hover:p-[2px] bg-origin-border bg-clip-padding bg-black hover:bg-gradient-mask',
  cardIndicator: 'absolute top-3 right-3 w-3 h-3 rounded-full bg-[#00ff00] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20',
  cardPrice: 'text-[#00ff00] font-mono text-xs font-bold',
  cardFooterContainer: 'mt-auto pt-2 flex justify-between items-center',
  cardFooterItem: 'flex flex-col',
  cardTimeLabel: 'uppercase text-[10px] font-mono text-white/60',
  cardTimeValue: 'font-bold text-xs text-white'
  
  // Eliminamos los botones de acción antiguos ya que ahora la tarjeta completa es clickable
};

// Configuración para el UI
export const diyUIConfig = {
  itemsPerPage: 9,
  maxDiscountPercentage: 50,
  sprintModeFactor: 1.5,
  cardAnimationDelay: 0.05,
  fadeInDuration: 0.3,
  messageAnimationDuration: 0.2,
  defaultCurrency: '$',
  defaultLocale: 'es-ES',
  gridLayout: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
};

// Labels y textos
export const diyLabels = {
  titles: {
    products: 'Productos',
    services: 'Servicios',
    packages: 'Paquetes',
    relatedServices: 'Servicios relacionados',
    relatedProducts: 'Productos incluidos',
    budget: 'Resumen de presupuesto',
    filters: 'Filtros'
  },
  
  filters: {
    department: 'Departamento',
    type: 'Tipo de elemento',
    discount: 'Descuento global',
    sprintMode: 'Modo sprint',
    all: 'Todos'
  },
  
  budget: {
    subtotal: 'Subtotal',
    discount: 'Descuento',
    total: 'Total',
    sprintMode: 'Modo sprint activado',
    empty: 'No hay elementos en el presupuesto',
    downloadPdf: 'Descargar PDF',
    sendByEmail: 'Enviar por email'
  },
  
  pagination: {
    of: 'de',
    page: 'Página'
  }
};

// Animaciones
export const diyAnimations = {
  // Variantes para el contenedor de tarjetas
  catalogContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  },
  
  // Variantes para las tarjetas individuales
  catalogItem: {
    hidden: { y: 15, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.3
      }
    }
  },
  
  // Variantes para elementos del presupuesto
  budgetItem: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    }
  },
  
  // Efectos de hover para tarjetas
  cardHover: {
    scale: 1.02,
    boxShadow: '0 4px 20px rgba(0, 255, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

/**
 * Estilo CSS para el efecto gradient mask de las tarjetas
 * Se exporta como string para aplicarlo dinámicamente
 */
export const cardGradientStyles = `
  .card-gradient-outline {
    position: relative;
    border-radius: 8px;
    padding: 1.5px;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.1));
    transition: all 0.3s ease;
  }
  
  .card-gradient-outline:hover {
    transform: translateY(-2px);
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), 
      linear-gradient(45deg, rgb(255, 0, 0), rgb(0, 255, 0), rgb(0, 0, 255), rgb(255, 0, 0));
    background-size: 100% 100%, 300% 300%;
    animation: gradient-move 3s linear infinite;
  }
  
  @keyframes gradient-move {
    0% {
      background-position: 0% 0%, 0% 50%;
    }
    50% {
      background-position: 0% 0%, 100% 50%;
    }
    100% {
      background-position: 0% 0%, 0% 50%;
    }
  }
  
  .card-inner {
    background-color: #000;
    border-radius: 6.5px;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;
