'use client'

import { useRouter } from 'next/navigation'
import { CaseStudy } from '@/types/case-study'
import { Button } from '@/components/ui/button'
import { ArrowRight, Pencil, Trash2 } from 'lucide-react'

type CardState = 'synced' | 'edited' | 'published'

const STATE_STYLES: Record<CardState, { bg: string; text: string; border: string; dot: string }> = {
  synced: {
    bg: 'bg-[#ff0000]/10',
    text: 'text-[#ff0000]',
    border: 'border-[#ff0000]/20',
    dot: 'bg-[#ff0000]'
  },
  edited: {
    bg: 'bg-[#0000ff]/10',
    text: 'text-[#0000ff]',
    border: 'border-[#0000ff]/20',
    dot: 'bg-[#0000ff]'
  },
  published: {
    bg: 'bg-[#00ff00]/10',
    text: 'text-[#00ff00]',
    border: 'border-[#00ff00]/20',
    dot: 'bg-[#00ff00]'
  }
}

interface CaseStudyCardProps {
  study: CaseStudy
  onSync?: (study: CaseStudy) => Promise<void>
  onMoveToSynced?: (study: CaseStudy) => Promise<void>
  onEdit?: (study: CaseStudy) => void
  onDelete?: (study: CaseStudy) => void
  onPublish?: (study: CaseStudy) => void
  onFeature?: (study: CaseStudy) => void
  showActions?: boolean
  synced?: boolean
}

export function CaseStudyCard({
  study,
  onSync,
  onMoveToSynced,
  onEdit,
  onDelete,
  onPublish,
  onFeature,
  showActions = true,
  synced = false
}: CaseStudyCardProps) {
  const router = useRouter()
  const getCardState = (study: CaseStudy): CardState => {
    if (study.status === 'published') {
      return 'published'
    }
    
    // Si ha sido editado (tiene cambios locales)
    if (study.updatedAt !== study.createdAt) {
      return 'edited'
    }
    
    return 'synced'
  }

  const state = getCardState(study)
  const styles = STATE_STYLES[state]

  const handleCardClick = () => {
    if (synced) {
      router.push(`/admin/case-studies/${study.id}`)
    } else if (onMoveToSynced) {
      onMoveToSynced(study)
    }
  }

  return (
    <div
      className={`relative group rounded-lg border p-4 transition-colors cursor-pointer ${synced ? 'border-[#00ff00]/20 hover:border-[#00ff00]/40 bg-[#00ff00]/5' : 'border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5'}`}
      onClick={handleCardClick}
    >
      {synced && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-t from-[#00ff00]/5 to-transparent rounded-md transition-opacity duration-300" />
      )}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className={`text-base font-bold mb-1 truncate ${synced ? 'text-[#00ff00]' : 'text-orange-500'}`}>
            {study.client}
          </h4>
          <p className="text-sm text-white/60 line-clamp-2">
            {study.description || 'No description'}
          </p>
        </div>
        {synced && (
          <span className={`shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs whitespace-nowrap ${styles.bg} ${styles.text} ${styles.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${styles.dot}`} />
            {status}
          </span>
        )}
      </div>
      
      {synced && (
        <div className="mt-4 flex gap-2 justify-end">
          {onPublish && (
            <Button
              variant="ghost"
              className={`
                ${study.status === 'draft' 
                  ? 'text-yellow-500/60 hover:text-yellow-500 hover:bg-yellow-500/10'
                  : 'text-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/10'
                }
              `}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPublish(study)
              }}
              title={study.status === 'draft' ? 'Publish Case Study' : 'Unpublish Case Study'}
            >
              {study.status === 'draft' ? 'Publish' : 'Unpublish'}
            </Button>
          )}
          {onFeature && study.status === 'published' && (
            <Button
              variant="ghost"
              className={`
                ${study.featured 
                  ? 'text-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/10'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }
              `}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onFeature(study)
              }}
              title={study.featured ? 'Remove from Featured' : 'Add to Featured'}
            >
              {study.featured ? `Featured (#${study.featuredOrder})` : 'Feature'}
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              className="text-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/10"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(study)
              }}
              title="Edit Case Study"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(study)
              }}
              title="Delete Case Study"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      {!synced && onMoveToSynced && (
        <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100">
          <ArrowRight className="w-6 h-6 text-orange-500 transform transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  )
}
