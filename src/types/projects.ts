export interface ProjectImage {
  url: string
  caption?: string
  width: number
  height: number
  alt?: string
}

export interface ProjectTestimonial {
  quote: string
  author: string
  role: string
  company?: string
  image?: string
}

export interface ProjectMetrics {
  value: string
  label: string
  description?: string
}

export interface ProjectLink {
  url: string
  label: string
  type: 'website' | 'github' | 'behance' | 'dribbble' | 'other'
}

export interface Project {
  // Basic Info
  title: string
  category: string
  description: string
  image: string
  heroVideo?: string
  slug: string
  color: string
  tags: string[]
  year: string
  
  // Client Info
  client?: string
  clientLogo?: string
  clientIndustry?: string
  
  // Project Details
  services?: string[]
  challenge?: string
  solution?: string
  approach?: string
  duration?: string
  team?: string[]
  
  // Results & Impact
  results?: string[]
  metrics?: ProjectMetrics[]
  testimonial?: ProjectTestimonial
  
  // Visual Content
  gallery?: ProjectImage[]
  video?: string
  prototype?: string
  
  // Links & Resources
  links?: ProjectLink[]
  downloads?: {
    url: string
    label: string
    type: string
  }[]
  
  // Navigation
  nextProject?: {
    title: string
    slug: string
    image: string
    color?: string
  }
  previousProject?: {
    title: string
    slug: string
    image: string
    color?: string
  }
  
  // SEO & Meta
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export interface ProjectFilters {
  category: string
  year?: string
  tag?: string
}
