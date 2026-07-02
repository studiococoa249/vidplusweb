import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Plus, Edit, Search, PlaySquare, Eye, ListVideo, Download, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteShortVideoButton from "./DeleteShortVideoButton";
import GetEpisodeButton from "./GetEpisodeButton";

export default async function ShortVideoPage(
  props: { 
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const lang = params.lang || "id";
  
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch count
  const { count } = await supabase
    .from("short_drama")
    .select("*", { count: "exact", head: true });

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  // Fetch paginated data
  const { data: videos } = await supabase
    .from("short_drama")
    .select("*")
    .order("create_at", { ascending: false })
    .range(from, to);

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
        <div className="flex gap-3">
          <Link 
            href={`/${lang}/admin/short/short-video/import`}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 border border-gray-700 shadow-lg shadow-black/20"
          >
            <Download size={18} />
            <span>Import API</span>
          </Link>
          <Link 
            href={`/${lang}/admin/short/short-video/create`}
            className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#ffbd59]/20"
          >
            <Plus size={18} />
            <span>Tambah Judul</span>
          </Link>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl flex flex-col">
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

        <div className="overflow-x-auto flex-1">
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
                        <GetEpisodeButton id={vid.id} dramaId={vid.drama_id} lang={lang} />
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

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-[#0a0c13]/50">
            <div className="text-sm text-gray-400">
              Menampilkan {count === 0 ? 0 : from + 1} - {Math.min(to + 1, count || 0)} dari {count} data
            </div>
            <div className="flex gap-2">
              {page > 1 ? (
                <Link 
                  href={`/${lang}/admin/short/short-video?page=${page - 1}`}
                  className="p-2 rounded-lg bg-[#121622] border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <ChevronLeft size={18} />
                </Link>
              ) : (
                <button disabled className="p-2 rounded-lg bg-[#121622] border border-gray-800 text-gray-600 cursor-not-allowed">
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Show page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Simple logic to show a few pages around the current page
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                    return (
                      <Link
                        key={pageNum}
                        href={`/${lang}/admin/short/short-video?page=${pageNum}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                          page === pageNum
                            ? "bg-[#ffbd59] border-[#ffbd59] text-black font-medium"
                            : "bg-[#121622] border-gray-700 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="text-gray-500 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              {page < totalPages ? (
                <Link 
                  href={`/${lang}/admin/short/short-video?page=${page + 1}`}
                  className="p-2 rounded-lg bg-[#121622] border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <ChevronRight size={18} />
                </Link>
              ) : (
                <button disabled className="p-2 rounded-lg bg-[#121622] border border-gray-800 text-gray-600 cursor-not-allowed">
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
