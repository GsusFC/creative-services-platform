'use client'

import { useState } from 'react'
import { CaseStudy } from '@/types/case-study'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface EditCaseStudyModalProps {
  study: CaseStudy
  open: boolean
  onCloseAction: () => void
  onSaveAction: (updatedStudy: CaseStudy) => Promise<void>
}

export function EditCaseStudyModal({ study, open, onCloseAction, onSaveAction }: EditCaseStudyModalProps) {
  const [editedStudy, setEditedStudy] = useState({ ...study })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await onSaveAction(editedStudy)
      onCloseAction()
    } catch (error) {
      console.error('Error saving case study:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Case Study</DialogTitle>
          <DialogDescription className="text-white/60">
            Make changes to the case study. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Title</label>
            <Input
              value={editedStudy.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedStudy({ ...editedStudy, title: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Description</label>
            <Textarea
              value={editedStudy.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedStudy({ ...editedStudy, description: e.target.value })}
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Tagline</label>
            <Input
              value={editedStudy.tagline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedStudy({ ...editedStudy, tagline: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Website</label>
            <Input
              value={editedStudy.website || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedStudy({ ...editedStudy, website: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCloseAction}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
