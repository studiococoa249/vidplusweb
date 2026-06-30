"use client";

import { useActionState } from "react";
import { updatePaymentGateway } from "../actions";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default function PaymentForm({ initialData }: { initialData: any }) {
  const [state, formAction, isPending] = useActionState(updatePaymentGateway, null);
  const params = useParams();
  const lang = params.lang as string || "id";

  const tripay = initialData?.tripay_config || {};
  const cryptomus = initialData?.cryptomus_config || {};

  return (
    <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 shadow-xl w-full">
      <form action={formAction} className="space-y-8">
        <input type="hidden" name="id" value={initialData?.id || 'new'} />
        <input type="hidden" name="lang" value={lang} />
        
        {state?.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-3">
            <CheckCircle size={20} />
            <span>{state.success}</span>
          </div>
        )}

        {/* Global Settings */}
        <div className="space-y-4 border-b border-gray-800 pb-8">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center text-sm">1</span>
            Pengaturan Global
          </h2>
          <div className="pl-10 space-y-3">
            <label className="text-sm font-semibold text-gray-300">Mode Pembayaran (Environment)</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="mode" 
                  value="Sandbox" 
                  defaultChecked={!initialData || initialData.mode === 'Sandbox'} 
                  className="w-4 h-4 text-[#ffbd59] bg-gray-900 border-gray-700 focus:ring-[#ffbd59]"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Sandbox (Test)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="mode" 
                  value="Production" 
                  defaultChecked={initialData?.mode === 'Production'} 
                  className="w-4 h-4 text-[#ffbd59] bg-gray-900 border-gray-700 focus:ring-[#ffbd59]"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Production (Live)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* TriPay Config */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center text-sm">2</span>
              TriPay
            </h2>
            <div className="bg-[#0a0c13] p-5 rounded-xl border border-gray-800 space-y-4 shadow-inner">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Merchant Code</label>
                <input 
                  type="text" 
                  name="tp_merchant_code"
                  defaultValue={tripay.merchantCode}
                  placeholder="Misal: TXXXXX"
                  className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">API Key</label>
                <input 
                  type="text" 
                  name="tp_api_key"
                  defaultValue={tripay.apiKey}
                  placeholder="Kunci API"
                  className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Private Key</label>
                <input 
                  type="password" 
                  name="tp_private_key"
                  defaultValue={tripay.privateKey}
                  placeholder="Kunci Privat"
                  className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Cryptomus Config */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center text-sm">3</span>
              Cryptomus
            </h2>
            <div className="bg-[#0a0c13] p-5 rounded-xl border border-gray-800 space-y-4 shadow-inner">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Merchant ID</label>
                <input 
                  type="text" 
                  name="cm_merchant_id"
                  defaultValue={cryptomus.merchantId}
                  placeholder="ID Merchant Cryptomus"
                  className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Payment Key</label>
                <input 
                  type="password" 
                  name="cm_payment_key"
                  defaultValue={cryptomus.paymentKey}
                  placeholder="Kunci Pembayaran (API Key)"
                  className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>
              <div className="pt-2 border-t border-gray-800">
                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="checkbox" 
                      name="cm_charge_fee"
                      value="true"
                      defaultChecked={cryptomus.chargeFeeToCustomer === true}
                      className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-[#ffbd59] focus:ring-[#ffbd59] focus:ring-offset-gray-900"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Bebankan Biaya Admin ke Pelanggan</span>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Jika dicentang, pelanggan akan menanggung penuh fee transaksi Cryptomus. Jika tidak, akan dipotong langsung dari saldo Merchant Anda.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-6 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#ffbd59]/20 hover:shadow-[#ffbd59]/40 w-full sm:w-auto justify-center"
          >
            <Save size={18} />
            <span>{isPending ? 'Menyimpan...' : 'Simpan Konfigurasi Gateway'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
