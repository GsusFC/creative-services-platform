'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Separator } from '../../../../components/ui/separator';

export function CaseStudySettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardHeader>
          <CardTitle className="text-slate-200">Sincronización con Notion</CardTitle>
          <CardDescription className="text-slate-400">
            Configura cómo se sincronizan los casos de estudio con Notion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-sync" className="flex flex-col space-y-1">
              <span className="text-slate-200">Sincronización Automática</span>
              <span className="font-normal text-sm text-slate-400">
                Sincroniza automáticamente los cambios con Notion
              </span>
            </Label>
            <Switch id="auto-sync" />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-slate-200">Credenciales de Notion</Label>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="API Key de Notion"
                value="••••••••••••••••"
                readOnly
              />
              <Input
                type="text"
                placeholder="ID de la Base de Datos"
                value="••••••••••••••••"
                readOnly
              />
              <Button variant="outline" className="w-full">
                Actualizar Credenciales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border-white/10">
        <CardHeader>
          <CardTitle className="text-slate-200">Opciones de Publicación</CardTitle>
          <CardDescription className="text-slate-400">
            Configura el comportamiento predeterminado para nuevos casos de estudio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-publish" className="flex flex-col space-y-1">
              <span className="text-slate-200">Publicación Automática</span>
              <span className="font-normal text-sm text-slate-400">
                Publica automáticamente los casos importados desde Notion
              </span>
            </Label>
            <Switch id="auto-publish" />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="draft-mode" className="flex flex-col space-y-1">
              <span className="text-slate-200">Modo Borrador por Defecto</span>
              <span className="font-normal text-sm text-slate-400">
                Los nuevos casos se crean como borradores
              </span>
            </Label>
            <Switch id="draft-mode" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
