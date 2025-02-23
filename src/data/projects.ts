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
    year: '2024',
    client: 'Adidas',
    services: ['Brand Strategy', 'Digital Design', 'Campaign Development'],
    challenge: 'Launch a digital-first campaign that would resonate with Gen Z while maintaining the iconic status of Adidas Originals.',
    solution: 'We created an immersive digital experience that combined heritage elements with contemporary culture, using RGB color transitions and dynamic typography.',
    results: [
      '250% increase in social media engagement',
      '2M+ campaign hashtag mentions',
      '40% boost in online sales during launch week'
    ],
    testimonial: {
      quote: "The team delivered a campaign that perfectly balanced our heritage with modern digital culture. The results exceeded our expectations.",
      author: 'Sarah Johnson',
      role: 'Global Digital Marketing Director, Adidas'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        caption: 'Digital campaign hero visual',
        width: 800,
        height: 600
      },
      {
        url: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?w=800&q=80',
        caption: 'Interactive mobile experience',
        width: 800,
        height: 600
      }
    ],
    nextProject: {
      title: 'NIKE ACG',
      slug: 'nike-acg',
      image: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=800&q=80'
    }
  },
  {
    title: 'NIKE ACG',
    category: 'DIGITAL PRODUCT',
    description: 'E-commerce experience for outdoor gear',
    image: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=800&q=80',
    slug: 'nike-acg',
    color: 'rgb(0, 255, 0)',
    tags: ['digital', 'ecommerce', 'ux'],
    year: '2024',
    client: 'Nike',
    services: ['UX Design', 'E-commerce Development', 'Digital Strategy'],
    challenge: 'Create an immersive e-commerce experience that captures the rugged spirit of ACG while maintaining ease of use.',
    solution: 'We developed a unique product exploration interface that combines 3D visualization with intuitive navigation, optimized for both desktop and mobile.',
    results: [
      '45% reduction in cart abandonment',
      '3x increase in time spent on product pages',
      '85% positive user feedback score'
    ],
    testimonial: {
      quote: "The new ACG e-commerce experience perfectly balances innovation with usability. It's exactly what we were looking for.",
      author: 'Michael Chen',
      role: 'Digital Product Lead, Nike'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
        caption: 'Product detail page',
        width: 800,
        height: 600
      },
      {
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
        caption: 'Mobile shopping experience',
        width: 800,
        height: 600
      }
    ],
    nextProject: {
      title: 'SPOTIFY WRAPPED',
      slug: 'spotify-wrapped',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80'
    }
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
