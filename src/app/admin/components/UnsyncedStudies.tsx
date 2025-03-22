'use client'

import { useCaseStudyManager } from '@/hooks/useCaseStudyManager'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/components/ui/card'
import { Button } from '@/app/admin/components/ui/button'
import { CloudOffIcon, RefreshCwIcon } from 'lucide-react'

export default function UnsyncedStudies() {
  const { unsyncedStudies, updateStudy } = useCaseStudyManager()

  const handleSync = async (id: string) => {
    const study = unsyncedStudies.find(s => s.id === id)
    if (study) {
      await updateStudy(study)
    }
  }

  if (unsyncedStudies.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border border-yellow-800/30 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-white">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <CloudOffIcon className="h-5 w-5 text-yellow-400" />
          </div>
          Estudios No Sincronizados ({unsyncedStudies.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unsyncedStudies.map(study => (
            <div key={study.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
              <div>
                <p className="text-white font-medium">{study.title}</p>
                <p className="text-sm text-gray-400">
                  Última actualización: {new Date(study.updatedAt).toLocaleString()}
                </p>
              </div>
              <Button
                onClick={() => handleSync(study.id)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30"
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Sincronizar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
