'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, Loader2 } from 'lucide-react';
import { importFromNotion } from '@/app/actions/import-notion';

export function ImportFromNotion() {
  const [isPending, startTransition] = useTransition();

  const handleImport = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await importFromNotion();
        console.log('Importación exitosa:', result);
      } catch (error) {
        console.error('Error durante la importación:', error);
      }
    });
  };

  return (
    <form action={handleImport}>
      <Button
        type="submit"
        disabled={isPending}
        variant="outline"
        className="w-full border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:text-white"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <ArrowDownIcon className="h-4 w-4 mr-2" />
            Importar
          </>
        )}
      </Button>
    </form>
  );
}
