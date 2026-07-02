'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreatePlanPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    price_idr: '',
    price_usd: '',
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('plan_membership').insert({
        name: formData.name,
        price_idr: Number(formData.price_idr),
        price_usd: Number(formData.price_usd),
        duration: Number(formData.duration)
      });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      router.push(`/${lang}/admin/plan`);
    } catch (error: any) {
      console.error('Error creating plan:', error);
      alert(`Gagal membuat paket: ${error.message || 'Silakan coba lagi.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/admin/plan`} className="p-2 text-gray-400 hover:text-white hover:bg-[#121622] rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Paket Baru</h1>
          <p className="text-gray-400 text-sm">Buat paket langganan baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nama Paket</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#07090e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffbd59] transition-colors"
                placeholder="Contoh: Premium Pro"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Harga (IDR)</label>
                <input
                  type="number"
                  required
                  value={formData.price_idr}
                  onChange={(e) => setFormData({ ...formData, price_idr: e.target.value })}
                  className="w-full bg-[#07090e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffbd59] transition-colors"
                  placeholder="199000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Harga (USD)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price_usd}
                  onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                  className="w-full bg-[#07090e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffbd59] transition-colors"
                  placeholder="12.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Durasi (Hari)</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-[#07090e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffbd59] transition-colors"
                  placeholder="30"
                />
              </div>
            </div>


          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span>{isLoading ? 'Menyimpan...' : 'Simpan Paket'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
