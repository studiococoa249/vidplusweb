import { supabase } from "@/utils/supabase";
import PaymentForm from "./PaymentForm";

export default async function PaymentGatewayPage() {
  const { data: config } = await supabase
    .from("payment_gateway")
    .select("*")
    .limit(1)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Gateway</h1>
        <p className="text-gray-400 text-sm">Konfigurasi pengaturan pembayaran Anda (TriPay & Cryptomus)</p>
      </div>

      <PaymentForm initialData={config || null} />
    </div>
  );
}
