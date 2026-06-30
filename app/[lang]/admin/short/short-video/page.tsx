import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Plus, Edit, Search, PlaySquare, Eye, ListVideo } from "lucide-react";
import DeleteShortVideoButton from "./DeleteShortVideoButton";

export default async function ShortVideoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const { data: videos } = await supabase
    .from("short_drama")
    .select("*")
    .order("create_at", { ascending: false });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PlaySquare className="text-[#ffbd59]" size={28} />
            <span>Drama Pendek</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Kelola serial drama pendek Anda</p>
        </div>
        <Link 
          href={`/${lang}/admin/short/short-video/create`}
          className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#ffbd59]/20"
        >
          <Plus size={18} />
          <span>Tambah Judul</span>
        </Link>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0a0c13]/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari judul drama..." 
              className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#ffbd59]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Judul Drama</th>
                <th className="px-6 py-4 font-medium text-center">Total Episode</th>
                <th className="px-6 py-4 font-medium text-center">Total Views</th>
                <th className="px-6 py-4 font-medium">Dibuat Pada</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {videos && videos.length > 0 ? (
                videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {vid.banner_url ? (
                          <img src={vid.banner_url} alt={vid.name} className="w-10 h-14 object-cover rounded-md bg-gray-800" />
                        ) : (
                          <div className="w-10 h-14 rounded-md bg-gray-800 flex items-center justify-center text-gray-500">
                            <PlaySquare size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white text-base">{vid.name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{vid.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                        <ListVideo size={14} />
                        {vid.total_episode || 0} Ep
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs">
                        <Eye size={14} />
                        {vid.view_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(vid.create_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/${lang}/admin/short/short-video/edit/${vid.id}`}
                          className="p-2 text-gray-400 hover:text-[#ffbd59] hover:bg-[#ffbd59]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteShortVideoButton id={vid.id} lang={lang} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data drama pendek.
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
