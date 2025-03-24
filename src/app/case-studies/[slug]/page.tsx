import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCaseStudyBySlug } from '@/lib/storage/case-studies'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

interface CaseStudyPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const study = await getCaseStudyBySlug(params.slug)
  if (!study) return {}

  return {
    title: `${study.title} | Case Study`,
    description: study.description,
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = await getCaseStudyBySlug(params.slug)
  if (!study || study.status !== 'published') notFound()

  // Encontrar la imagen hero
  const heroImage = study.mediaItems.find(item => item.alt === 'Hero Image')
  const coverImage = study.mediaItems.find(item => item.alt === 'Cover')
  const galleryImages = study.mediaItems.filter(item => 
    item.alt !== 'Hero Image' && 
    item.alt !== 'Cover' && 
    item.alt !== 'Avatar' &&
    item.type === 'image'
  )
  const videos = study.mediaItems.filter(item => item.type === 'video')

  return (
    <main className="min-h-screen bg-black">
      {/* Header con Hero Image */}
      <div className="relative h-screen">
        {heroImage?.type === 'image' ? (
          <Image
            src={heroImage.url}
            alt={study.title}
            fill
            className="object-cover"
            priority
          />
        ) : heroImage?.type === 'video' && (
          <div className="relative w-full h-full">
            <iframe
              src={heroImage.url.replace('vimeo.com', 'player.vimeo.com/video')}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        
        {/* Botón de volver */}
        <Link 
          href="/"
          className="absolute top-8 left-8 z-10"
        >
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        {/* Contenido del Hero */}
        <div className="absolute bottom-0 left-0 right-0 p-12 space-y-4">
          <h1 className="text-6xl font-bold text-white">{study.title}</h1>
          <p className="text-2xl text-white/80">{study.tagline}</p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-8 py-24 space-y-24">
        {/* Información del Proyecto */}
        <section className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white/80">Sobre el Proyecto</h2>
              <p className="text-lg text-white/60 leading-relaxed">{study.description}</p>
            </div>

            {study.website && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white/80">Website</h2>
                <Link 
                  href={study.website}
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {study.website}
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white/80">Servicios</h2>
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-white border-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white/80">Closing Claim</h2>
              <p className="text-lg text-white/60 leading-relaxed">{study.closingClaim}</p>
            </div>
          </div>
        </section>

        {/* Galería de Imágenes */}
        {galleryImages.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold text-white/80">Galería</h2>
            <div className="grid grid-cols-2 gap-8">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={image.url}
                    alt={`${study.title} - ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold text-white/80">Videos</h2>
            <div className="grid grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <div key={index} className="relative aspect-video">
                  <iframe
                    src={video.url.replace('vimeo.com', 'player.vimeo.com/video')}
                    className="absolute inset-0 w-full h-full rounded-lg"
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
