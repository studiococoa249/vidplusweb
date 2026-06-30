import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Plus, Edit, Search, Tags } from "lucide-react";
import DeleteGenreButton from "./DeleteGenreButton";

export default async function GenrePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { data: genres } = await supabase
    .from("genre")
    .select("*")
    .order("create_at", { ascending: false });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tags className="text-[#ffbd59]" size={28} />
            <span>Genre</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Kelola kategori genre untuk drama pendek</p>
        </div>
        <Link 
          href={`/${lang}/admin/short/genre/create`}
          className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#ffbd59]/20"
        >
          <Plus size={18} />
          <span>Tambah Baru</span>
        </Link>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0a0c13]/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari genre..." 
              className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#ffbd59]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Genre</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Dibuat Pada</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {genres && genres.length > 0 ? (
                genres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{genre.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{genre.slug}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(genre.create_at).toLocaleDateString("id-ID", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/${lang}/admin/short/genre/edit/${genre.id}`}
                          className="p-2 text-gray-400 hover:text-[#ffbd59] hover:bg-[#ffbd59]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteGenreButton id={genre.id} lang={lang} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data genre.
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
