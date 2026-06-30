'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const { lang, id } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    price_idr: '',
    price_usd: '',
    duration: '',
    description: '',
    features: ['']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_membership')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            name: data.name || '',
            price_idr: data.price_idr?.toString() || '',
            price_usd: data.price_usd?.toString() || '',
            duration: data.duration?.toString() || '',
            description: data.description || '',
            features: data.features && data.features.length > 0 ? data.features : ['']
          });
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchPlan();
  }, [id]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: newFeatures });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('plan_membership')
        .update({
          name: formData.name,
          price_idr: Number(formData.price_idr),
          price_usd: Number(formData.price_usd),
          duration: Number(formData.duration),
          description: formData.description,
          features: formData.features.filter(f => f.trim() !== ''),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      router.push(`/${lang}/admin/plan`);
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Gagal mengupdate paket. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/admin/plan`} className="p-2 text-gray-400 hover:text-white hover:bg-[#121622] rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Paket</h1>
          <p className="text-gray-400 text-sm">Update paket langganan</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-[#07090e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffbd59] transition-colors"
                placeholder="Deskripsi paket..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">Fitur Paket</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-xs text-[#ffbd59] hover:text-[#e5a94f] font-medium"
                >
                  + Tambah Fitur
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 bg-[#07090e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffbd59] transition-colors"
                      placeholder={`Fitur ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
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
            <span>{isLoading ? 'Menyimpan...' : 'Update Paket'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
