import { v4 as uuidv4 } from 'uuid';
import { CaseStudyDataV4 } from './mapper-utils';

/**
 * Interfaz para el servicio mock que mantiene compatibilidad con CaseStudyDataV4
 * pero usa nombres alternativos para algunos campos
 */
export interface CaseStudyDetail {
  // Metadatos y gestión (los mismos que en CaseStudyDataV4)
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  
  // Campos específicos para el mock service
  title: string;        // Equivalente a project_name en CaseStudyDataV4
  project_name: string; // Para compatibilidad con CaseStudyDataV4
  description: string;
  tagline?: string;
  
  // Campos de imagen y multimedia 
  heroImage?: string;   // Nombre alternativo usado en el mock service
  heroVideo?: string;   // Campo adicional no presente en CaseStudyDataV4
  hero_image: string;   // Para compatibilidad con CaseStudyDataV4 (siempre debe tener valor)
  
  // Otros campos igual que en CaseStudyDataV4
  services: string[];
  gallery?: string[];
  category?: string;
  tags?: string[];
  client_name?: string;
  client_logo?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

// Almacenamiento en memoria para los casos de estudio
const _caseStudies: Record<string, CaseStudyDetail> = {};

/**
 * Servicio mock para gestionar operaciones CRUD de casos de estudio sin base de datos
 */
export class MockCaseStudyService {
  /**
   * Obtiene todos los casos de estudio
   * @param onlyPublished Si es true, solo devuelve los casos de estudio publicados
   */
  static async getAllCaseStudies(
    onlyPublished: boolean = false
  ): Promise<CaseStudyDetail[]> {
    let result = Object.values(_caseStudies);
    
    if (onlyPublished) {
      result = result.filter(cs => cs.published);
    }
    
    // Ordenar por fecha de creación descendente
    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
    
    return result;
  }
  
  /**
   * Obtiene un caso de estudio por su slug
   * @param slug Slug único del caso de estudio
   * @param requirePublished Si es true, solo devuelve el caso si está publicado
   */
  static async getCaseStudyBySlug(
    slug: string,
    requirePublished: boolean = false
  ): Promise<CaseStudyDetail | null> {
    // Acceder directamente usando el slug como clave
    const caseStudy = _caseStudies[slug];
    
    if (!caseStudy) {
      return null;
    }
    
    if (requirePublished && !caseStudy.published) {
      return null;
    }
    
    return caseStudy;
  }
  
  /**
   * Crea un nuevo caso de estudio
   * @param caseStudyData Datos del caso de estudio a crear
   */
  static async createCaseStudy(
    caseStudyData: Partial<CaseStudyDetail>
  ): Promise<CaseStudyDetail> {
    // Generar ID y slug si no se proporcionan
    const id = caseStudyData.id || uuidv4();
    const slug = caseStudyData.slug || this.generateSlug(caseStudyData.title || 'case-study');
    
    const now = new Date().toISOString();
    
    // Obtener la imagen principal (asegurando compatibilidad entre los dos campos)
    const heroImage = caseStudyData.heroImage || '';
    
    // Crear el nuevo caso de estudio con todos los campos requeridos
    const newCaseStudy: CaseStudyDetail = {
      id,
      slug,
      title: caseStudyData.title || '',
      project_name: caseStudyData.title || caseStudyData.project_name || '', // Mapeo de compatibilidad
      description: caseStudyData.description || '',
      tagline: caseStudyData.tagline || '',
      heroImage: heroImage,
      heroVideo: caseStudyData.heroVideo || '',
      hero_image: heroImage, // Asegurar que hero_image siempre tenga un valor
      services: caseStudyData.services || [],
      gallery: caseStudyData.gallery || [],
      tags: caseStudyData.tags || [],
      category: caseStudyData.category || '',
      challenge: caseStudyData.challenge || '',
      solution: caseStudyData.solution || '',
      results: caseStudyData.results || [],
      client_name: caseStudyData.client_name || '',
      client_logo: caseStudyData.client_logo || '',
      published: caseStudyData.published || false,
      created_at: now,
      updated_at: now,
    };
    
    // Guardar en el almacenamiento en memoria
    _caseStudies[slug] = newCaseStudy;
    
    return newCaseStudy;
  }
  
  /**
   * Actualiza un caso de estudio existente
   * @param slug Slug del caso de estudio a actualizar
   * @param caseStudyData Datos actualizados del caso de estudio
   */
  static async updateCaseStudy(
    slug: string,
    caseStudyData: Partial<CaseStudyDetail>
  ): Promise<CaseStudyDetail | null> {
    if (!_caseStudies[slug]) {
      return null;
    }
    
    // Actualizar el caso de estudio
    _caseStudies[slug] = {
      ..._caseStudies[slug],
      ...caseStudyData,
      updated_at: new Date().toISOString()
    };
    
    return _caseStudies[slug];
  }
  
  /**
   * Elimina un caso de estudio
   * @param slug Slug del caso de estudio a eliminar
   */
  static async deleteCaseStudy(slug: string): Promise<boolean> {
    if (!_caseStudies[slug]) {
      return false;
    }
    
    delete _caseStudies[slug];
    return true;
  }
  
  /**
   * Cambia el estado de publicación de un caso de estudio
   * @param slug Slug del caso de estudio
   * @param published Nuevo estado de publicación
   */
  static async togglePublishStatus(
    slug: string,
    published: boolean
  ): Promise<CaseStudyDataV4 | null> {
    if (!_caseStudies[slug]) {
      return null;
    }
    
    _caseStudies[slug] = {
      ..._caseStudies[slug],
      published,
      updated_at: new Date().toISOString()
    };
    
    return _caseStudies[slug];
  }
  
  /**
   * Busca casos de estudio por texto
   * @param searchTerm Término de búsqueda
   * @param onlyPublished Si es true, solo busca en casos publicados
   */
  static async searchCaseStudies(
    searchTerm: string,
    onlyPublished: boolean = false
  ): Promise<CaseStudyDataV4[]> {
    const searchRegex = new RegExp(searchTerm, 'i');
    
    let result = Object.values(_caseStudies).filter(cs => {
      // Verificar si el término de búsqueda aparece en algún campo relevante
      return (
        searchRegex.test(cs.project_name) ||
        searchRegex.test(cs.description || '') ||
        cs.tags?.some(tag => searchRegex.test(tag))
      );
    });
    
    if (onlyPublished) {
      result = result.filter(cs => cs.published);
    }
    
    // Ordenar por fecha de creación descendente
    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
    
    return result;
  }
  
  /**
   * Filtra casos de estudio por categoría y/o tags
   * @param category Categoría para filtrar
   * @param tags Tags para filtrar
   * @param onlyPublished Si es true, solo incluye casos publicados
   */
  static async filterCaseStudies(
    category?: string,
    tags?: string[],
    onlyPublished: boolean = false
  ): Promise<CaseStudyDetail[]> {
    let result = Object.values(_caseStudies).filter(cs => {
      let matches = true;
      
      // Filtrar por categoría si se especifica
      if (category && cs.category !== category) {
        matches = false;
      }
      
      // Filtrar por tags si se especifican
      if (tags && tags.length > 0) {
        if (!cs.tags || !tags.some(tag => cs.tags?.includes(tag))) {
          matches = false;
        }
      }
      
      return matches;
    });
    
    if (onlyPublished) {
      result = result.filter(cs => cs.published);
    }
    
    // Ordenar por fecha de creación descendente
    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
    
    return result;
  }
  
  /**
   * Genera un slug a partir del nombre del proyecto
   * @param name Nombre del proyecto
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Eliminar guiones múltiples
      .trim();
  }

  /**
   * Obtiene todas las versiones de un caso de estudio (devuelve lista vacía en mock)
   * @param slug Slug del caso de estudio
   */
  static async getCaseStudyVersions(slug: string) {
    // En el mock, no hay versiones reales
    return {
      caseStudyId: _caseStudies[slug]?.id || '',
      totalVersions: 1,
      versions: [
        {
          version: 1,
          data: _caseStudies[slug] || {},
          comment: 'Versión inicial (mock)',
          created_at: _caseStudies[slug]?.created_at || new Date().toISOString(),
          created_by: 'system'
        }
      ]
    };
  }
  
  /**
   * Obtiene una versión específica de un caso de estudio (devuelve la versión actual en mock)
   * @param slug Slug del caso de estudio
   * @param _versionNumber Número de versión
   */
  static async getCaseStudyVersion(slug: string, _versionNumber: number) {
    // En el mock, siempre devolvemos la versión actual como la única versión
    if (_versionNumber !== 1 || !_caseStudies[slug]) {
      return null;
    }
    
    return {
      version: 1,
      data: _caseStudies[slug],
      comment: 'Versión inicial (mock)',
      created_at: _caseStudies[slug].created_at,
      created_by: 'system'
    };
  }
  
  /**
   * Restaura una versión anterior de un caso de estudio (no hace nada real en mock)
   * @param slug Slug del caso de estudio
   * @param _versionNumber Número de versión a restaurar
   */
  static async restoreCaseStudyVersion(
    slug: string,
    _versionNumber: number
  ): Promise<CaseStudyDataV4 | null> {
    // En el mock, simplemente devolvemos el caso de estudio actual
    return _caseStudies[slug] || null;
  }

  // Añadir algunos casos de ejemplo para la demostración
  static populateWithSampleData() {
    const _sampleCaseStudies = [
      {
        title: 'Portal Web para ETH Barcelona',
        description: 'Desarrollo de portal web responsive para el evento de ETH Barcelona, con sistema de registro, agenda y gestión de ponentes.',
        heroImage: 'https://picsum.photos/1200/600?random=1',
        tagline: 'Plataforma web para eventos de blockchain',
        services: ['Desarrollo Web', 'Blockchain', 'UI/UX'],
        gallery: [
          'https://picsum.photos/800/600?random=1', 
          'https://picsum.photos/800/600?random=2',
          'https://picsum.photos/800/600?random=3'
        ],
        tags: ['Ethereum', 'Next.js', 'Web3'],
        category: 'Blockchain',
        challenge: 'Crear una plataforma que integre información del evento con funcionalidades de web3 y un sistema de compra de entradas con tokens.',
        solution: 'Implementamos un sistema basado en Next.js con integración de Metamask para la autenticación y compra de entradas utilizando smart contracts.',
        results: ['10,000+ visitantes durante el evento', 'Procesamiento de 500+ transacciones de venta de entradas', 'Reducción del 60% en tiempos de registro'],
        client_name: 'ETH Barcelona',
        client_logo: 'https://picsum.photos/200/200?random=1',
        published: true
      },
      {
        title: 'NFT Marketplace para Rarible',
        description: 'Desarrollo de marketplace especializado en NFTs para artistas digitales, con funcionalidades de minting, subastas y colecciones.',
        heroImage: 'https://picsum.photos/1200/600?random=2',
        tagline: 'Plataforma de compra-venta de NFTs',
        services: ['Desarrollo Web', 'Smart Contracts', 'NFTs', 'Blockchain'],
        gallery: [
          'https://picsum.photos/800/600?random=4', 
          'https://picsum.photos/800/600?random=5',
          'https://picsum.photos/800/600?random=6'
        ],
        tags: ['NFT', 'Ethereum', 'Marketplace', 'React'],
        category: 'NFT',
        challenge: 'Crear un marketplace que permita a los artistas crear, vender y gestionar colecciones de NFTs de forma sencilla y con bajas comisiones.',
        solution: 'Desarrollamos una plataforma basada en React con smart contracts personalizados para la gestión de colecciones, minting, subastas y royalties.',
        results: ['Más de 1,000 artistas registrados', 'Volumen de ventas de 2M USD en los primeros 3 meses', 'Tiempo medio de minting inferior a 30 segundos'],
        client_name: 'Rarible',
        client_logo: 'https://picsum.photos/200/200?random=2',
        published: true
      },
      {
        title: 'DApp para Metafactory',
        description: 'Aplicación descentralizada para la gestión de la producción y distribución de prendas de ropa tokenizadas.',
        heroImage: 'https://picsum.photos/1200/600?random=3',
        tagline: 'Moda digital con tokens',
        services: ['Blockchain', 'Desarrollo Web', 'Tokenización'],
        gallery: [
          'https://picsum.photos/800/600?random=7', 
          'https://picsum.photos/800/600?random=8',
          'https://picsum.photos/800/600?random=9'
        ],
        tags: ['DApp', 'Polygon', 'Moda', 'Tokens', 'Vue.js'],
        category: 'DeFi',
        challenge: 'Desarrollar un sistema que permita tokenizar prendas de ropa físicas y vincularlas con sus equivalentes digitales para metaversos.',
        solution: 'Implementamos una DApp en Vue.js con smart contracts en Polygon para la tokenización, trazabilidad y gestión de la cadena de producción.',
        results: ['Reducción del 30% en fraudes', 'Incremento del 25% en ventas', 'Trazabilidad completa de cada prenda'],
        client_name: 'Metafactory',
        client_logo: 'https://picsum.photos/200/200?random=3',
        published: false
      },
      {
        title: 'Web3 Analytics Dashboard',
        description: 'Plataforma de análisis y visualización de datos para proyectos blockchain y DeFi.',
        heroImage: 'https://picsum.photos/1200/600?random=4',
        tagline: 'Analítica avanzada para Web3',
        services: ['Análisis de Datos', 'Blockchain', 'Visualización'],
        gallery: [
          'https://picsum.photos/800/600?random=10', 
          'https://picsum.photos/800/600?random=11',
          'https://picsum.photos/800/600?random=12'
        ],
        tags: ['Analytics', 'DeFi', 'Dashboard', 'Data Visualization'],
        category: 'Analítica',
        challenge: 'Crear una herramienta de análisis que permita visualizar y comprender datos complejos de blockchains y protocolos DeFi.',
        solution: 'Desarrollamos un dashboard interactivo con D3.js y Next.js que se integra con múltiples fuentes de datos on-chain y off-chain.',
        results: ['Más de 50,000 usuarios activos', 'Integración con 15+ protocolos DeFi', 'Reducción del 40% en tiempo de análisis'],
        client_name: 'Polygonal Mind',
        client_logo: 'https://picsum.photos/200/200?random=4',
        published: true
      }
    ];
    
    // Añadir los casos de ejemplo
    _sampleCaseStudies.forEach(sample => {
      const now = new Date().toISOString();
      const id = uuidv4();
      const slug = this.generateSlug(sample.title);
      
      _caseStudies[slug] = {
        ...sample,
        id,
        slug,
        // Asegurar que los campos obligatorios estén presentes
        project_name: sample.title || '', // Usar title como project_name
        hero_image: sample.heroImage || '', // Usar heroImage como hero_image
        created_at: now,
        updated_at: now
      };
    });
  }
}

// Poblar con datos de muestra al importar el módulo
MockCaseStudyService.populateWithSampleData();
