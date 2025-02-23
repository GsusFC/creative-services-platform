'use client'

import { ProjectImage } from '@/types/projects'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  images: ProjectImage[]
}

export function ProjectGallery({ images }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {images.map((image, index) => (
        <motion.div
          key={image.url}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2 }}
          className="space-y-4"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={image.url}
              alt={image.alt || ''}
              fill
              className="object-cover"
            />
          </div>
          {image.caption && (
            <p className="text-white/60 text-sm text-center">
              {image.caption}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )
}
