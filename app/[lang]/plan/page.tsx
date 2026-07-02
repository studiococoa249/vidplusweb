import React from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default async function PublicPlanPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const { data: plans } = await supabase
    .from("plan_membership")
    .select("*")
    .order("price_idr", { ascending: true });

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-200 font-sans pb-20">
      <header className="w-full bg-[#121622]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href={`/${lang}`} className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-white">Pilih Paket Berlangganan</h1>
        </div>
      </header>

      <main className="pt-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-4">Tingkatkan Pengalaman Menonton Anda</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Dapatkan akses penuh ke semua episode drama premium tanpa batasan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans && plans.length > 0 ? (
            plans.map((plan: any) => (
              <div key={plan.id} className="bg-[#121622] rounded-2xl border border-gray-800 p-8 flex flex-col relative overflow-hidden group hover:border-[#ffbd59] transition duration-300 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[#ffbd59]">Rp {Number(plan.price_idr).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Masa aktif: {plan.duration} hari</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-gray-300 text-sm">
                    <CheckCircle2 size={18} className="text-[#ffbd59] shrink-0" />
                    <span>Akses semua episode premium</span>
                  </li>
                  <li className="flex gap-3 text-gray-300 text-sm">
                    <CheckCircle2 size={18} className="text-[#ffbd59] shrink-0" />
                    <span>Tanpa iklan mengganggu</span>
                  </li>
                  <li className="flex gap-3 text-gray-300 text-sm">
                    <CheckCircle2 size={18} className="text-[#ffbd59] shrink-0" />
                    <span>Kualitas video HD & 4K</span>
                  </li>
                </ul>

                <button className="w-full py-3 px-6 rounded-full font-bold bg-[#1a1f2e] text-white group-hover:bg-[#ffbd59] group-hover:text-black transition-colors border border-gray-700 group-hover:border-transparent">
                  Pilih Paket Ini
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Belum ada paket langganan yang tersedia saat ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
