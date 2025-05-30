const API_URL = 'http://192.168.13.28:7557';

export interface Device {
  InternetGatewayDevice: any;
  _deviceId: {
    _Manufacturer: string;
    _ProductClass: string;
  };
  _id: string;
}

export interface CPE {
  mac: string;
  manufacturer: string;
  product_class: string;
  device_id: string;
}

export interface OnlineCPE {
  device_id: string;
  login_pppoe: string;
}

interface TaskPayload {
  name: string;
  objectName?: string;
  parameterValues?: [string, string, string][];
}

/**
 * Função genérica para coletar todos os dispositivos da API
 */
export async function coletarTodosCpes(): Promise<Device[]> {
  const url = `${API_URL}/devices`;
  console.info('[INFO] Coletando todos os CPEs da API...');

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao coletar CPEs: ${res.statusText}`);
  }

  const devices: Device[] = await res.json();
  return devices;
}

/**
 * Coleta CPEs com login resetado@fixanet.com
 */
export async function coletarCpesResetados(): Promise<CPE[]> {
  const devices = await coletarTodosCpes();
  const cpes_reset: CPE[] = [];

  devices.forEach(device => {
    try {
      const username = device.InternetGatewayDevice?.WANDevice?.['1']?.WANConnectionDevice?.['1']?.WANPPPConnection?.['2']?.Username?._value?.trim().toLowerCase();

      if (username !== 'resetado@fixanet.com') return;

      const mac = device.InternetGatewayDevice?.LANDevice?.['1']?.LANEthernetInterfaceConfig?.['1']?.MACAddress?._value;
      const manufacturer = device._deviceId._Manufacturer;
      const product_class = device._deviceId._ProductClass;
      const device_id = device._id;

      cpes_reset.push({
        mac,
        manufacturer,
        product_class,
        device_id,
      });
    } catch (e) {
      console.warn(`[WARNING] Campo ausente ao processar ${device._id}: ${e}`);
    }
  });

  return cpes_reset;
}

/**
 * Coleta todos os CPEs online com login PPPoE diferente de resetado@fixanet.com
 */
export async function coletarCpesOnline(): Promise<OnlineCPE[]> {
  const devices = await coletarTodosCpes();
  const cpes_online: OnlineCPE[] = [];

  devices.forEach(device => {
    try {
      const login_pppoe = device.InternetGatewayDevice?.WANDevice?.['1']?.WANConnectionDevice?.['1']?.WANPPPConnection?.['2']?.Username?._value?.trim().toLowerCase();

      if (!login_pppoe || login_pppoe === 'resetado@fixanet.com') return;

      const device_id = device._id;

      cpes_online.push({
        device_id,
        login_pppoe,
      });
    } catch (e) {
      console.warn(`[WARNING] Campo ausente ao processar ${device._id}: ${e}`);
    }
  });

  return cpes_online;
}

/**
 * Busca device ID pelo MAC
 */
export async function buscarDeviceId(mac: string): Promise<string | null> {
  const query = JSON.stringify({
    "InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.MACAddress": mac
  });

  const query_encoded = encodeURIComponent(query);
  const url = `${API_URL}/devices/?query=${query_encoded}`;

  console.info("[INFO] Buscando device ID via MAC...");

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[ERRO] Erro na busca: ${res.statusText}`);
    return null;
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    console.error("[ERRO] Nenhum dispositivo encontrado com esse MAC.");
    return null;
  }

  const device_id = data[0]._id;
  console.info(`[INFO] CPE encontrado: ${device_id}`);
  return device_id;
}

/**
 * Envia requisição POST para API GenieACS
 */
async function postKeApi(device_id: string, payload: any): Promise<[number, string]> {
  const device_id_enc = encodeURIComponent(device_id);
  const url = `${API_URL}/devices/${device_id_enc}/tasks?connection_request`;
  console.debug(`[DEBUG] POST URL: ${url}`);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  return [res.status, text];
}

/**
 * Envia refresh de parâmetros
 */
export async function enviarRefresh(device_id: string, param = 'Device') {
  console.info("[INFO] Enviando refresh de parâmetros...");
  const payload = {
    name: 'refreshObject',
    objectName: param,
  };
  return postKeApi(device_id, payload);
}

/**
 * Altera parâmetros do dispositivo
 */
export async function alterarParametros(
  device_id: string,
  ssid_24g: string,
  ssid_5g: string,
  senha_24g?: string,
  senha_5g?: string,
  pppoe_login?: string
) {
  console.info("[INFO] Alterando SSIDs, senhas Wi-Fi e login PPPoE...");

  const parameterValues: [string, string, string][] = [
    ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID', ssid_24g, 'xsd:string'],
    ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.6.SSID', ssid_5g, 'xsd:string'],
  ];

  if (senha_24g) {
    parameterValues.push(['InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.KeyPassphrase', senha_24g, 'xsd:string']);
  }
  if (senha_5g) {
    parameterValues.push(['InternetGatewayDevice.LANDevice.1.WLANConfiguration.6.KeyPassphrase', senha_5g, 'xsd:string']);
  }
  if (pppoe_login) {
    parameterValues.push(['InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.2.Username', pppoe_login, 'xsd:string']);
  }

  const payload = {
    name: 'setParameterValues',
    parameterValues,
  };

  return postKeApi(device_id, payload);
}
export async function coletarCpesOnlineDetalhado(): Promise<Array<{
  device_id: string;
  mac: string;
  login_pppoe: string;
  ssid_24g?: string;
  ssid_5g?: string;
  modelo: string;
}>> {
  const devices = await coletarTodosCpes();
  const onlineCpes: Array<{
    device_id: string;
    mac: string;
    login_pppoe: string;
    ssid_24g?: string;
    ssid_5g?: string;
    modelo: string;
  }> = [];

  devices.forEach(device => {
    try {
      const login_pppoe = device.InternetGatewayDevice?.WANDevice?.['1']
        ?.WANConnectionDevice?.['1']?.WANPPPConnection?.['2']?.Username?._value?.trim().toLowerCase();

      if (!login_pppoe || login_pppoe === 'resetado@fixanet.com') return;

      const mac = device.InternetGatewayDevice?.LANDevice?.['1']?.LANEthernetInterfaceConfig?.['1']?.MACAddress?._value || 'N/A';

      const ssid_24g = device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['2']?.SSID?._value;
      const ssid_5g = device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['6']?.SSID?._value;

      const modelo = device._deviceId?._ProductClass || 'N/A';

      onlineCpes.push({
        device_id: device._id,
        mac,
        login_pppoe,
        ssid_24g,
        ssid_5g,
        modelo,
      });
    } catch (e) {
      console.warn(`[WARNING] Erro ao processar device ${device._id}: ${e}`);
    }
  });

  return onlineCpes;
}

// // Busca detalhes completos do dispositivo pelo device_id
// export async function coletarDetalhesDispositivo(deviceId: string): Promise<any> {
//   const devices = await coletarTodosCpes();
//   const device = devices.find(d => d._id === deviceId || d.device_id === deviceId);
//   if (!device) throw new Error('Dispositivo não encontrado');
//   return device;
// }
