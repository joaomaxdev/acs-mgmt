'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // para pegar o deviceId da URL
import { coletarDetalhesDispositivo } from '@/lib/genieacs';

export default function DeviceDetails() {
  const params = useParams();
  const deviceId = params.deviceId;
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDevice() {
      setLoading(true);
      try {
        if (!deviceId) throw new Error('Device ID não fornecido');
        const dados = await coletarDetalhesDispositivo(deviceId);
        setDevice(dados);
      } catch (error) {
        console.error('[ERRO] ao buscar detalhes do dispositivo:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevice();
  }, [deviceId]);

  if (loading) return <p className="p-6">Carregando detalhes...</p>;

  if (!device) return <p className="p-6 text-red-600">Dispositivo não encontrado.</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Detalhes do Dispositivo</h1>

      <table className="table-auto border-collapse border border-gray-300 w-full max-w-4xl">
        <tbody>
          {Object.entries(device).map(([key, value]) => (
            <tr key={key} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2 font-semibold">{key}</td>
              <td className="border border-gray-300 px-4 py-2 font-mono whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
