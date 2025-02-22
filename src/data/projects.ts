import { Project } from '@/types/projects'

export const featuredProjects: Project[] = [
  {
    title: 'ADIDAS ORIGINALS',
    category: 'BRAND CAMPAIGN',
    description: 'Digital campaign for new collection launch',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    slug: 'adidas-originals',
    color: 'rgb(255, 0, 0)',
    tags: ['branding', 'digital', 'campaign'],
    year: '2024'
  },
  {
    title: 'NIKE ACG',
    category: 'DIGITAL PRODUCT',
    description: 'E-commerce experience for outdoor gear',
    image: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=800&q=80',
    slug: 'nike-acg',
    color: 'rgb(0, 255, 0)',
    tags: ['digital', 'ecommerce', 'ux'],
    year: '2024'
  },
  {
    title: 'SPOTIFY WRAPPED',
    category: 'CREATIVE DIRECTION',
    description: 'Visual system for annual music campaign',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
    slug: 'spotify-wrapped',
    color: 'rgb(0, 0, 255)',
    tags: ['creative', 'campaign', 'digital'],
    year: '2023'
  },
  {
    title: 'SUPREME SS24',
    category: 'ART DIRECTION',
    description: 'Visual identity for seasonal collection',
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80',
    slug: 'supreme-ss24',
    color: 'rgb(255, 0, 0)',
    tags: ['art direction', 'fashion', 'identity'],
    year: '2024'
  },
  {
    title: 'APPLE VISION PRO',
    category: 'MOTION DESIGN',
    description: 'Product launch animations and visuals',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    slug: 'apple-vision',
    color: 'rgb(0, 255, 0)',
    tags: ['motion', 'product', 'tech'],
    year: '2024'
  },
  {
    title: 'OFF-WHITE',
    category: 'BRAND DESIGN',
    description: 'Brand evolution and digital presence',
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80',
    slug: 'off-white',
    color: 'rgb(0, 0, 255)',
    tags: ['branding', 'fashion', 'digital'],
    year: '2023'
  }
]

export const projectCategories = [
  'ALL',
  'BRAND CAMPAIGN',
  'DIGITAL PRODUCT',
  'CREATIVE DIRECTION',
  'ART DIRECTION',
  'MOTION DESIGN',
  'BRAND DESIGN'
]
