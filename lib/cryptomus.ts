import crypto from 'crypto';

export interface CryptomusConfig {
  merchantId: string;
  paymentKey: string;
}

export interface CryptomusPayload {
  amount: string;
  currency: string;
  order_id: string;
  url_callback?: string;
  url_return?: string;
}

export async function createCryptomusTransaction(config: CryptomusConfig, payload: CryptomusPayload) {
  const payloadStr = JSON.stringify(payload);
  const sign = crypto
    .createHash('md5')
    .update(Buffer.from(payloadStr).toString('base64') + config.paymentKey)
    .digest('hex');

  const response = await fetch('https://api.cryptomus.com/v1/payment', {
    method: 'POST',
    headers: {
      'merchant': config.merchantId,
      'sign': sign,
      'Content-Type': 'application/json'
    },
    body: payloadStr
  });

  return await response.json();
}

export function verifyCryptomusSignature(payload: any, paymentKey: string, providedSign: string) {
  // To verify signature, we need to remove the "sign" property from the payload 
  // and re-calculate the signature the same way Cryptomus did.
  const { sign: _, ...dataWithoutSign } = payload;
  
  // Note: cryptomus webhook verification requires json encode without escaping slashes
  // Typically, stringify without pretty print is fine.
  const dataStr = JSON.stringify(dataWithoutSign);
  
  const expectedSign = crypto
    .createHash('md5')
    .update(Buffer.from(dataStr).toString('base64') + paymentKey)
    .digest('hex');

  return expectedSign === providedSign;
}
