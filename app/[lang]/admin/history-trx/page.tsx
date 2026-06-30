import { supabase } from "@/utils/supabase";
import { Search } from "lucide-react";

export default async function HistoryTrxPage() {
  // Fetch with user and plan details joined if possible
  // Using Supabase foreign key relationships
  const { data: history, error } = await supabase
    .from("membership_history")
    .select(`
      *,
      plan:plan_membership(name, duration),
      user:users(full_name, email)
    `)
    .order("create_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Riwayat Transaksi</h1>
          <p className="text-gray-400 text-sm">Lihat semua transaksi membership pengguna</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0a0c13]/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari invoice atau pengguna..." 
              className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#ffbd59]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice / Waktu</th>
                <th className="px-6 py-4 font-medium">Pengguna</th>
                <th className="px-6 py-4 font-medium">Paket</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history && history.length > 0 ? (
                history.map((trx: any) => (
                  <tr key={trx.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{trx.invoice || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(trx.create_at).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-200">{trx.user?.full_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{trx.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{trx.plan?.name || 'Paket Dihapus'}</div>
                      {trx.plan && (
                        <div className="text-xs text-gray-500">{trx.plan.duration} Hari</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        trx.status_payment === 'Success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        trx.status_payment === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        trx.status_payment === 'Expired' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {trx.status_payment}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <Search size={20} className="text-gray-400" />
                    </div>
                    <p>Belum ada riwayat transaksi.</p>
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
