const CUSTOM_API_BASE_URL = 'https://socialboosters.web.id/api/v1';

interface TripayConfig {
  api_key: string;
  kode_api: string;
}

export interface TransactionPayload {
  method: string;
  amount: number;
  callback_url?: string;
  return_url?: string;
}

export interface TripayChannel {
  code: string;
  name: string;
  payment_type: string;
}

export interface TripayTransactionResult {
  reference: string;
  status: string;
  amount: number;
  payment: {
    va_number?: string;
    qr_url?: string;
  };
}

export async function getPaymentChannels(config: TripayConfig): Promise<{ success: boolean; data: TripayChannel[] }> {
  const response = await fetch(`${CUSTOM_API_BASE_URL}/payment/channels`, {
    method: 'GET',
    headers: {
      'api_key': config.api_key,
      'kode_api': config.kode_api,
    },
  });

  const data = await response.json();
  return data;
}

export async function createClosedTransaction(
  config: TripayConfig,
  payload: TransactionPayload
): Promise<{ success: boolean; data: TripayTransactionResult; message?: string }> {
  const response = await fetch(`${CUSTOM_API_BASE_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': config.api_key,
      'kode_api': config.kode_api,
    },
    body: JSON.stringify({
      method: payload.method,
      amount: payload.amount,
      ...(payload.callback_url && { callback_url: payload.callback_url }),
      ...(payload.return_url && { return_url: payload.return_url }),
    }),
  });

  const data = await response.json();
  return data;
}

export async function getTransactionDetail(
  config: TripayConfig,
  reference: string
): Promise<{ success: boolean; data: TripayTransactionResult }> {
  const response = await fetch(
    `${CUSTOM_API_BASE_URL}/payment/detail?reference=${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: {
        'api_key': config.api_key,
        'kode_api': config.kode_api,
      },
    }
  );

  const data = await response.json();
  return data;
}
