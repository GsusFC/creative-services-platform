'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ContentBlockProps {
  block: {
    id: string
    type: 'singleImage' | 'doubleImage' | 'video'
    order: number
    image?: string
    leftImage?: string
    rightImage?: string
    videoUrl?: string
    videoThumbnail?: string
    caption?: string
  }
}

export default function ContentBlock({ block }: ContentBlockProps) {
  // Animación para todos los bloques
  const animation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: 'easeOut' }
  }

  // Renderizar según el tipo de bloque
  switch (block.type) {
    case 'singleImage':
      return (
        <motion.div 
          className="my-24" 
          {...animation}
        >
          {block.image && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={block.image}
                alt={block.caption || 'Case study image'}
                fill
                className="object-cover"
              />
            </div>
          )}
          {block.caption && (
            <p className="mt-4 text-sm text-gray-400 font-mono">{block.caption}</p>
          )}
        </motion.div>
      )
    
    case 'doubleImage':
      return (
        <motion.div 
          className="my-24 grid grid-cols-1 md:grid-cols-2 gap-4" 
          {...animation}
        >
          {block.leftImage && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={block.leftImage}
                alt={`${block.caption || 'Case study image'} (left)`}
                fill
                className="object-cover"
              />
            </div>
          )}
          {block.rightImage && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={block.rightImage}
                alt={`${block.caption || 'Case study image'} (right)`}
                fill
                className="object-cover"
              />
            </div>
          )}
          {block.caption && (
            <div className="md:col-span-2 mt-4">
              <p className="text-sm text-gray-400 font-mono">{block.caption}</p>
            </div>
          )}
        </motion.div>
      )
    
    case 'video':
      return (
        <motion.div 
          className="my-24" 
          {...animation}
        >
          <div className="relative aspect-video w-full overflow-hidden">
            {block.videoUrl && (
              <iframe
                src={block.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
          {block.caption && (
            <p className="mt-4 text-sm text-gray-400 font-mono">{block.caption}</p>
          )}
        </motion.div>
      )
    
    default:
      return null
  }
}
