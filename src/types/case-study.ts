export interface CaseStudy {
  // Datos básicos
  id: string
  slug: string
  title: string
  client: string
  color?: string
  
  // Hero Section
  hero: {
    type: 'image' | 'video'
    url: string
    thumbnailUrl?: string // Para videos
  }
  
  // Sección descriptiva
  projectName: string
  tagline: string // Claim o frase
  description: string
  team: Array<{
    name: string
    role?: string
  }>
  services: string[]
  
  // Galería de contenido
  contentBlocks: Array<{
    id: string
    type: 'singleImage' | 'doubleImage' | 'video'
    order: number
    
    // Para singleImage
    image?: string
    
    // Para doubleImage
    leftImage?: string
    rightImage?: string
    
    // Para video
    videoUrl?: string
    videoThumbnail?: string
    
    // Metadatos opcionales
    caption?: string
  }>
  
  // Metadatos
  tags?: string[]
  featured?: boolean
  publishDate?: string
}
