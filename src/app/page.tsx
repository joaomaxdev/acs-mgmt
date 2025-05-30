'use client';

import { useEffect, useState } from 'react';
import { coletarTodosCpes, coletarCpesResetados, coletarCpesOnline } from '@/lib/genieacs';
import { ChartOverview } from '@/components/chart';
import { Sales } from '@/components/logs';
import { CardEstatistica } from '@/components/cards/cardEstatistica';
import { CircleCheck, CircleX, FileWarning, Router } from 'lucide-react';

export default function Home() {
  const [resetados, setResetados] = useState<number>(0);
  const [online, setOnline] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const todosCpes = await coletarTodosCpes();
        setTotal(todosCpes.length);

        const cpesReset = await coletarCpesResetados();
        setResetados(cpesReset.length);

        const cpesOnline = await coletarCpesOnline();
        const ativos = cpesOnline.filter(cpe => cpe.login_pppoe !== 'resetado@fixanet.com');
        setOnline(ativos.length);

      } catch (error) {
        console.error('[ERRO] ao coletar CPEs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CardEstatistica
          title="Dispositivos"
          description="Todos os dispositivos"
          valor={loading ? '...' : total}
          icon={<Router className="w-4 h-4" />}
        />

        <CardEstatistica
  title="Online"
  description="Dispositivos online agora"
  valor={loading ? '...' : online}
  icon={<CircleCheck className="w-4 h-4" />}
  color="text-green-600"
  link="/online"
/>

        <CardEstatistica
          title="Offline"
          description="Dispositivos Offline agora"
          valor={loading ? '...' : total - online}
          icon={<CircleX className="w-4 h-4" />}
          color="text-red-600"
        />

        <CardEstatistica
          title="Resetados"
          description="Dispositivos resetados agora"
          valor={loading ? '...' : resetados}
          icon={<FileWarning className="w-4 h-4" />}
          color="text-orange-600"
          link="/resetados"
        />
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <ChartOverview />
        <Sales />
      </section>
    </main>
  );
}
