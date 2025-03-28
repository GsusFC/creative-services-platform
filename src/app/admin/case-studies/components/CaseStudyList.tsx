'use client';

import { useState } from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
// Importamos CaseStudyIndex desde su ubicación correcta
import type { CaseStudyIndex } from '@/lib/storage/case-studies';
import { EditIcon, EyeIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

interface CaseStudyListProps {
  // Cambiamos el tipo esperado a CaseStudyIndex[]
  studies: CaseStudyIndex[];
}

export function CaseStudyList({ studies }: CaseStudyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por título o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-white truncate">{study.title}</h3>
                    <Badge variant={study.status === 'published' ? 'success' : 'secondary'}>
                      {study.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                    {!study.synced && (
                      <Badge variant="destructive">Sin Sincronizar</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{study.tagline}</p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link href={`/admin/case-studies/${study.id}`}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/case-studies/${study.slug}`} target="_blank">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredStudies.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No se encontraron casos de estudio
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
