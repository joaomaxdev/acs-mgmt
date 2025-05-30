// app/api/configurar-cpe/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { alterarParametros } from '@/lib/genieacs';

export async function POST(req: NextRequest) {
  try {
    const { device_id, ssid_24, ssid_5g, senhaWifi, loginPppoe } = await req.json();

    console.info('[INFO] Recebido POST configurar-cpe:', { device_id, ssid_24, ssid_5g, loginPppoe });

    const result = await alterarParametros(
      device_id,
      ssid_24,
      ssid_5g,
      senhaWifi,   // mesma senha para 2.4G e 5G
      senhaWifi,
      loginPppoe
    );

    console.info('[INFO] Resultado alterarParametros:', result);

    return NextResponse.json({ status: 'success', result }, { status: 200 });
  } catch (error) {
    console.error('[ERRO] ao configurar CPE:', error);
    return NextResponse.json({ status: 'error', message: (error as Error).message }, { status: 500 });
  }
}
