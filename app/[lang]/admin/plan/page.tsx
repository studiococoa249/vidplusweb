'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function PlanPage() {
  const params = useParams();
  const { lang } = params;
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase
        .from("plan_membership")
        .select("*")
        .order("create_at", { ascending: false });
      
      setPlans(data || []);
      setIsLoading(false);
    }

    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      try {
        const { error } = await supabase
          .from("plan_membership")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        
        // Refresh the list
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Gagal menghapus paket. Silakan coba lagi.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
          <p className="text-gray-400 text-sm">Kelola paket langganan (Plan) Anda</p>
        </div>
        <Link 
          href={`/${lang}/admin/plan/create`}
          className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Tambah Paket</span>
        </Link>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Paket</th>
                <th className="px-6 py-4 font-medium">Harga IDR</th>
                <th className="px-6 py-4 font-medium">Harga USD</th>
                <th className="px-6 py-4 font-medium">Durasi (Hari)</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {plans && plans.length > 0 ? (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{plan.name}</td>
                    <td className="px-6 py-4 font-mono">Rp {Number(plan.price_idr).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 font-mono">${Number(plan.price_usd).toLocaleString()}</td>
                    <td className="px-6 py-4">{plan.duration} Hari</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/${lang}/admin/plan/edit/${plan.id}`}
                          className="p-2 text-gray-400 hover:text-[#ffbd59] hover:bg-[#ffbd59]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data paket langganan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
