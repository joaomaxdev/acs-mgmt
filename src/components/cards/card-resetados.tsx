'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileWarning } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { coletarCpesResetados } from '@/lib/genieacs';

export function CardResetados() {
  const [resetados, setResetados] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResetados = async () => {
      setLoading(true);
      try {
        const cpes = await coletarCpesResetados();
        setResetados(cpes.length);
      } catch (error) {
        console.error('[ERRO] ao coletar CPEs resetados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResetados();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
            Resetados
          </CardTitle>
          <FileWarning className="ml-auto w-4 h-4" />
        </div>
        <CardDescription>
          Dispositivos resetados agora
        </CardDescription>
      </CardHeader>

      <Link href="/resetados">
        <CardContent className="flex justify-end">
          <p className="text-base sm:text-lg font-bold text-orange-600">
            {loading ? '...' : resetados}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
