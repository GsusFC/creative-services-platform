'use client'

import { ProjectImage } from '@/types/projects'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  images: ProjectImage[]
}

const MediaItem = ({ item, index }: { item: ProjectImage; index: number }) => {
  const isVideo = item.url.endsWith('.mp4') || item.url.endsWith('.webm')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.2,
        duration: 0.8,
        ease: [0.21, 0.45, 0.32, 0.9]
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full h-0 pb-[56.25%] bg-black"> {/* 16:9 aspect ratio */}
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-contain"
            src={item.url}
          />
        ) : (
          <Image
            src={item.url}
            alt={item.alt || ''}
            fill
            sizes="100vw"
            priority={index < 2}
            className="object-contain"
          />
        )}
      </div>
      {item.caption && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: (index * 0.2) + 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-4 text-white/60 text-sm
                     bg-gradient-to-t from-black/50 to-transparent">
          {item.caption}
        </motion.p>
      )}
    </motion.div>
  )
}

export function ProjectGallery({ images }: Props) {
  const limitedImages = images.slice(0, 10)

  return (
    <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw] space-y-0">
      {limitedImages.map((image, index) => {
        const isFullWidth = index % 3 === 0

        if (isFullWidth) {
          return (
            <div key={image.url} className="w-full">
              <MediaItem item={image} index={index} />
            </div>
          )
        }

        if (index + 1 < limitedImages.length) {
          const nextImage = limitedImages[index + 1]
          return (
            <div key={image.url} className="grid grid-cols-1 md:grid-cols-2">
              <div className="w-full">
                <MediaItem item={image} index={index} />
              </div>
              <div className="w-full">
                <MediaItem item={nextImage} index={index + 1} />
              </div>
            </div>
          )
        }

        return (
          <div key={image.url} className="w-full">
            <MediaItem item={image} index={index} />
          </div>
        )
      })}
    </div>
  )
}
