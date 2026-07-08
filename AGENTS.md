payment gateway direct tripay

base url= https://socialboosters.web.id/api/v1

api_key //ambil di tabel payment_gateway -> tripay_config -> api_key
kode_api //ambil di tabel payment_gateway -> tripay_config -> private_key

saya pakai di config tripay, untuk payment gatewaynya

GET /payment/channels

<?php
$curl = curl_init('https://socialboosters.web.id/api/v1/payment/channels');
curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'api_key: UTNbCu4OJrTGaeLlB74LxQ9CDa14qHo1',
    'kode_api: 4672816596760696'
  ],
]);
echo curl_exec($curl);
curl_close($curl);

response:
{
  "success": true,
  "data": [
    { "code": "BRIVA", "name": "BRI Virtual Account", "payment_type": "virtual_account" },
    { "code": "QRIS", "name": "QRIS", "payment_type": "qris" }
  ]
}


POST /payment/create

<?php
$curl = curl_init('https://socialboosters.web.id/api/v1/payment/create');
curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode(['method' => 'BRIVA', 'amount' => 50000]),
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'api_key: UTNbCu4OJrTGaeLlB74LxQ9CDa14qHo1',
    'kode_api: 4672816596760696'
  ],
]);
echo curl_exec($curl);
curl_close($curl);

Responsenya:
{
  "success": true,
  "data": {
    "reference": "T0001...",
    "status": "UNPAID",
    "amount": 50000,
    "payment": {
      "va_number": "5758...", // Jika VA
      "qr_url": "https..."    // Jika QRIS
    }
  }
}


GET /payment/detail

<?php
$curl = curl_init('https://socialboosters.web.id/api/v1/payment/detail?reference=T0001...');
curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'api_key: UTNbCu4OJrTGaeLlB74LxQ9CDa14qHo1',
    'kode_api: 4672816596760696'
  ],
]);
echo curl_exec($curl);
curl_close($curl);


WEBHOOK

<?php
$payload = json_decode(file_get_contents('php://input'), true);

$expected = hash_hmac('sha256', json_encode([
    'reference'    => $payload['reference'],
    'merchant_ref' => $payload['merchant_ref'],
    'status'       => $payload['status'],
]), '4672816596760696'); // Gunakan kode_api Anda

if (hash_equals($expected, $payload['signature']) && $payload['status'] === 'PAID') {
    // Proses pesanan sukses
}