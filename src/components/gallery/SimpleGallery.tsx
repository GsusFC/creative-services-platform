'use client'

import { MediaItem } from '@/types/case-study';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SimpleGalleryProps {
  mediaItems: MediaItem[];
}

export default function SimpleGallery({ mediaItems }: SimpleGalleryProps) {
  const images = mediaItems.filter(item => item.type === 'image');
  
  if (images.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {images.map((item, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={`relative rounded-xl overflow-hidden ${
            index === 0 && images.length > 1 ? 'md:col-span-2' : ''
          }`}
        >
          <div className="aspect-video relative">
            <Image 
              src={item.url || ''}
              alt={item.alt || 'Project image'}
              fill
              className="object-cover"
            />
          </div>
          
          {item.alt && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4">
              <p className="text-sm text-white/80">{item.alt}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
