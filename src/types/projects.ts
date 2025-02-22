export interface Project {
  title: string
  category: string
  description: string
  image: string
  slug: string
  color: string
  tags: string[]
  year: string
}

export interface ProjectFilters {
  category: string
  year?: string
  tag?: string
}
