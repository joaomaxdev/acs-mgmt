'use client';

import { useEffect, useState } from 'react';
import { coletarCpesOnlineDetalhado } from '@/lib/genieacs';

export default function OnlineList() {
  const [cpesOnline, setCpesOnline] = useState<
    Array<{
      device_id: string;
      mac: string;
      login_pppoe: string;
      ssid_24g?: string;
      ssid_5g?: string;
      modelo: string;
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOnlineCpes() {
      setLoading(true);
      try {
        const online = await coletarCpesOnlineDetalhado();
        setCpesOnline(online);
      } catch (error) {
        console.error('[ERRO] ao carregar CPEs online:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOnlineCpes();
  }, []);

  return (
    <main className="p-6 px-1">
      <h1 className="text-3xl font-bold mb-6">Clientes Online</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {cpesOnline.length === 0 ? (
            <p>Nenhum cliente online encontrado.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">MAC</th>
                  <th className="border border-gray-300 px-4 py-2">PPPoE</th>
                  <th className="border border-gray-300 px-4 py-2">SSID 2.4GHz</th>
                  <th className="border border-gray-300 px-4 py-2">SSID 5GHz</th>
                  <th className="border border-gray-300 px-4 py-2">Modelo</th>
                </tr>
              </thead>
              <tbody>
                {cpesOnline.map(cpe => (
                  <tr key={cpe.device_id}>
                    <td className="border border-gray-300 px-4 py-2 font-mono">{cpe.mac}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpe.login_pppoe}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpe.ssid_24g || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpe.ssid_5g || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpe.modelo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}
