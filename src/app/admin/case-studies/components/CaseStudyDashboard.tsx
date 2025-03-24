'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { PlusIcon, RefreshCwIcon, Settings2Icon } from 'lucide-react';
import Link from 'next/link';
import { ImportFromNotion } from '../../components/ImportFromNotion';
import { CaseStudyList } from '@/app/admin/case-studies/components/CaseStudyList';
import { CaseStudyStats } from '@/app/admin/case-studies/components/CaseStudyStats';
import { CaseStudySettings } from '@/app/admin/case-studies/components/CaseStudySettings';

export function CaseStudyDashboard() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <CaseStudyStats />

      {/* Acciones Rápidas */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Link href="/admin/case-studies/new" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </Link>

            <Button 
              variant="outline" 
              className="flex-1 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:text-white"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <ImportFromNotion />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="featured">Destacados</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <CaseStudyList />
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
            <CardContent className="p-6">
              {/* Implementar vista de casos destacados */}
              <p className="text-slate-400">Gestiona los casos de estudio destacados aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <CaseStudySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
