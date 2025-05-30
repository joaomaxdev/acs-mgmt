import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coletarCpesResetados, coletarCpesOnline, coletarTodosCpes } from '@/lib/genieacs';

// Mock global fetch
global.fetch = vi.fn();

const mockDevices = [
  {
    _id: "device1",
    _deviceId: {
      _Manufacturer: "ZTE",
      _ProductClass: "ZXHN H198A"
    },
    InternetGatewayDevice: {
      WANDevice: {
        "1": {
          WANConnectionDevice: {
            "1": {
              WANPPPConnection: {
                "2": {
                  Username: { _value: "resetado@fixanet.com" }
                }
              }
            }
          }
        }
      },
      LANDevice: {
        "1": {
          LANEthernetInterfaceConfig: {
            "1": {
              MACAddress: { _value: "AA:BB:CC:DD:EE:FF" }
            }
          }
        }
      }
    }
  },
  {
    _id: "device2",
    _deviceId: {
      _Manufacturer: "Huawei",
      _ProductClass: "HG8245Q2"
    },
    InternetGatewayDevice: {
      WANDevice: {
        "1": {
          WANConnectionDevice: {
            "1": {
              WANPPPConnection: {
                "2": {
                  Username: { _value: "cliente@fixanet.com" }
                }
              }
            }
          }
        }
      },
      LANDevice: {
        "1": {
          LANEthernetInterfaceConfig: {
            "1": {
              MACAddress: { _value: "FF:EE:DD:CC:BB:AA" }
            }
          }
        }
      }
    }
  }
];

beforeEach(() => {
  (fetch as any).mockReset();
});

describe('GenieACS Lib', () => {
  it('deve coletar CPEs resetados corretamente', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDevices
    });

    const result = await coletarCpesResetados();
    expect(result.length).toBe(1);
    expect(result[0].mac).toBe("AA:BB:CC:DD:EE:FF");
  });

  it('deve coletar CPEs online corretamente', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDevices
    });

    const result = await coletarCpesOnline();
    expect(result.length).toBe(2);
    expect(result[0].login_pppoe).toBe("resetado@fixanet.com");
    expect(result[1].login_pppoe).toBe("cliente@fixanet.com");
  });

  it('deve coletar total de CPEs corretamente', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDevices
    });

    const result = await coletarTodosCpes();
    expect(result).toBe(2);
  });

  it('deve lançar erro se fetch falhar', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: "Erro de conexão"
    });

    await expect(coletarCpesResetados()).rejects.toThrow("Erro ao coletar CPEs: Erro de conexão");
  });
});
