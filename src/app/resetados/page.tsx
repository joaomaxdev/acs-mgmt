'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { coletarCpesResetados, enviarRefresh } from '@/lib/genieacs';
import { toast } from 'react-hot-toast';

interface CPE {
  mac: string;
  manufacturer: string;
  product_class: string;
  device_id: string;
}

// Função para limpar caracteres especiais do SSID (permite só letras e números)
function sanitizeSSID(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '');
}

export default function ResetadosPage() {
  const [cpes, setCpes] = useState<CPE[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  
  const [configCpe, setConfigCpe] = useState<CPE | null>(null);
  const [ssidBase, setSsidBase] = useState('');
  const [senhaWifi, setSenhaWifi] = useState('');
  const [loginPppoeBase, setLoginPppoeBase] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Função para carregar CPEs resetados
  const fetchResetados = async () => {
    setLoading(true);
    try {
      const data = await coletarCpesResetados();
      console.log('[DEBUG] Dados coletados:', data);
      setCpes(data);
    } catch (error) {
      toast.error('Erro ao coletar CPEs resetados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar lista no mount do componente
  useEffect(() => {
    fetchResetados();
  }, []);

  // Enviar refresh para um device
  const handleRefresh = async (deviceId: string) => {
    setRefreshingId(deviceId);
    try {
      await enviarRefresh(deviceId);
      toast.success(`Refresh enviado para ${deviceId}`);
    } catch (error) {
      toast.error(`Erro ao enviar refresh: ${deviceId}`);
      console.error(error);
    } finally {
      setRefreshingId(null);
    }
  };

  // Enviar configuração para o CPE
  const handleSubmitConfig = async () => {
    if (!configCpe) return;

    if (!ssidBase.trim()) {
      toast.error('Informe a base do SSID.');
      return;
    }

    if (!loginPppoeBase.trim()) {
      toast.error('Informe o login PPPoE.');
      return;
    }

    setSubmitting(true);

    const loginPppoe = loginPppoeBase.toLowerCase() + '@fixanet.com';
    const ssidSanitized = sanitizeSSID(ssidBase);
    const ssid24 = ssidSanitized + '@FIXANET';
    const ssid5g = ssidSanitized + '@FIXANET_5G';

    try {
      const res = await fetch('/api/configurar-cpe', {
        method: 'POST',
        body: JSON.stringify({
          device_id: configCpe.device_id,
          ssid_24: ssid24,
          ssid_5g: ssid5g,
          senha_24: senhaWifi,
          senha_5g: senhaWifi,
          loginPppoe,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }

      toast.success('Configuração enviada com sucesso!');
      setConfigCpe(null);

      // Atualiza lista após configurar
      await fetchResetados();

      // Limpar campos após envio
      setSsidBase('');
      setSenhaWifi('');
      setLoginPppoeBase('');
    } catch (error) {
      toast.error('Erro ao enviar configuração');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="sm:ml-14 p-4">
      <Card>
        <CardHeader>
          <CardTitle>CPEs Resetados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Carregando...</p>
          ) : cpes.length === 0 ? (
            <p className="text-gray-600">Nenhum CPE resetado encontrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">MAC</th>
                    <th className="border p-2">Fabricante</th>
                    <th className="border p-2">Modelo</th>
                    <th className="border p-2">Device ID</th>
                    <th className="border p-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {cpes.map((cpe) => (
                    <tr key={cpe.device_id} className="hover:bg-gray-50">
                      <td className="border p-2 font-mono">{cpe.mac}</td>
                      <td className="border p-2">{cpe.manufacturer}</td>
                      <td className="border p-2">{cpe.product_class}</td>
                      <td className="border p-2 text-xs break-all">{cpe.device_id}</td>
                      <td className="border p-2 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={refreshingId === cpe.device_id}
                          onClick={() => handleRefresh(cpe.device_id)}
                        >
                          {refreshingId === cpe.device_id ? 'Enviando...' : 'Refresh'}
                        </Button>
                        <Dialog open={configCpe?.device_id === cpe.device_id} onOpenChange={(open) => { if (!open) setConfigCpe(null); }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setConfigCpe(cpe);
                                setSsidBase('');
                                setSenhaWifi('');
                                setLoginPppoeBase('');
                              }}
                            >
                              Configurar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Configurar CPE</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Input
                                placeholder="Base SSID (sem caracteres especiais)"
                                value={ssidBase}
                                onChange={(e) => setSsidBase(sanitizeSSID(e.target.value))}
                                maxLength={32}
                              />
                              <Input
                                placeholder="Senha Wi-Fi"
                                value={senhaWifi}
                                onChange={(e) => setSenhaWifi(e.target.value)}
                                type="password"
                                maxLength={64}
                              />
                              <Input
                                placeholder="Login PPPoE"
                                value={loginPppoeBase}
                                onChange={(e) => setLoginPppoeBase(e.target.value.toLowerCase())}
                                maxLength={64}
                              />
                              <div className="text-sm text-gray-500">
                                Login final: <code>{loginPppoeBase.toLowerCase()}@fixanet.com</code><br />
                                SSID 2.4G: <code>{sanitizeSSID(ssidBase)}@FIXANET</code><br />
                                SSID 5G: <code>{sanitizeSSID(ssidBase)}@FIXANET_5G</code>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={handleSubmitConfig}
                                disabled={submitting}
                              >
                                {submitting ? 'Enviando...' : 'Enviar Configuração'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
