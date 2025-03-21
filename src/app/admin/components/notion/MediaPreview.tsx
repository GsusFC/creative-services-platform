'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MediaItem } from '@/types/case-study'
import { Video, Image as ImageIcon } from 'lucide-react'

interface MediaPreviewProps {
  item: MediaItem
  isEditing?: boolean
  onDelete?: (item: MediaItem) => void
}

export function MediaPreview({ item, isEditing, onDelete }: MediaPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const isVideo = item.url?.includes('vimeo.com') || item.url?.includes('youtube.com')

  return (
    <div className="group relative aspect-video bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      {isVideo ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40">
          <Video className="w-8 h-8" />
          <span className="text-xs">Video</span>
        </div>
      ) : item.url ? (
        <Image
          src={item.url}
          alt={item.type || 'Media preview'}
          fill
          className={`
            object-cover
            transition-all
            ${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40">
          <ImageIcon className="w-8 h-8" />
          <span className="text-xs">Sin imagen</span>
        </div>
      )}
      {isEditing && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={() => onDelete?.(item)}
          >
            Eliminar
          </Button>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/50 text-white/80 text-xs">
        {isVideo ? 'Video' : item.type || 'Imagen'}
      </div>
    </div>
  )
}
