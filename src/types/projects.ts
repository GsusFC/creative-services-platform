export interface Project {
  title: string
  category: string
  description: string
  image: string
  slug: string
  color: string
  tags: string[]
  year: string
  client?: string
  services?: string[]
  challenge?: string
  solution?: string
  results?: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  gallery?: {
    url: string
    caption?: string
    width: number
    height: number
  }[]
  nextProject?: {
    title: string
    slug: string
    image: string
  }
}

export interface ProjectFilters {
  category: string
  year?: string
  tag?: string
}
