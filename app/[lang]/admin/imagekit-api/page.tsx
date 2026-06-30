import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";

export default async function ImageKitApiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { data: apis, error } = await supabase
    .from("imagekit_api")
    .select("*")
    .order("create_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">ImageKit API</h1>
          <p className="text-gray-400 text-sm">Kelola kredensial API ImageKit Anda</p>
        </div>
        <Link 
          href={`/${lang}/admin/imagekit-api/create`}
          className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Tambah Baru</span>
        </Link>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Nama</th>
                <th className="px-6 py-4 font-medium">API Key</th>
                <th className="px-6 py-4 font-medium">URL Endpoint</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {apis && apis.length > 0 ? (
                apis.map((api) => (
                  <tr key={api.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{api.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{api.api_key}</td>
                    <td className="px-6 py-4 text-gray-400 truncate max-w-xs">{api.url_endpoint}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/${lang}/admin/imagekit-api/edit/${api.id}`}
                          className="p-2 text-gray-400 hover:text-[#ffbd59] hover:bg-[#ffbd59]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
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
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                    <p>Belum ada data ImageKit API.</p>
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
