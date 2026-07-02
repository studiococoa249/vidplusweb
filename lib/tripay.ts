import crypto from 'crypto';

interface TripayConfig {
  mode: 'Sandbox' | 'Production';
  apiKey: string;
  privateKey: string;
  merchantCode: string;
}

export interface TransactionPayload {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  order_items: Array<{
    sku: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  return_url?: string;
  expired_time?: number;
}

export async function createClosedTransaction(config: TripayConfig, payload: TransactionPayload) {
  const baseUrl = config.mode === 'Sandbox' 
    ? 'https://tripay.co.id/api-sandbox/transaction/create'
    : 'https://tripay.co.id/api/transaction/create';

  const signature = crypto
    .createHmac('sha256', config.privateKey)
    .update(config.merchantCode + payload.merchant_ref + payload.amount)
    .digest('hex');

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      signature
    })
  });

  const data = await response.json();
  return data;
}

export async function getPaymentChannels(config: TripayConfig) {
  const baseUrl = config.mode === 'Sandbox' 
    ? 'https://tripay.co.id/api-sandbox/merchant/payment-channel'
    : 'https://tripay.co.id/api/merchant/payment-channel';

  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`
    }
  });

  const data = await response.json();
  return data;
}
