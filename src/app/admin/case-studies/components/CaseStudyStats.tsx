'use client';

import { Card, CardContent } from '../../../../components/ui/card';
import { BookOpenIcon, CheckCircleIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllCaseStudies } from '../../../../lib/storage/case-studies';
import type { CaseStudy } from '../../../../types/case-study';

export function CaseStudyStats() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    unsynced: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const studies = await getAllCaseStudies();
        setStats({
          total: studies.length,
          published: studies.filter(s => s.status === 'published').length,
          draft: studies.filter(s => s.status === 'draft').length,
          unsynced: studies.filter(s => !s.synced).length,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BookOpenIcon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Publicados</p>
              <p className="text-3xl font-bold text-white">{stats.published}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Borradores</p>
              <p className="text-3xl font-bold text-white">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertCircleIcon className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sin Sincronizar</p>
              <p className="text-3xl font-bold text-white">{stats.unsynced}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <RefreshCwIcon className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
