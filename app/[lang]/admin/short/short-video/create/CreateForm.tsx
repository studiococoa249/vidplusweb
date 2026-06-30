"use client";

import { useActionState, useState } from "react";
import { createShortDrama } from "../../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";

export default function CreateForm({ genres }: { genres: any[] }) {
  const [state, formAction, isPending] = useActionState(createShortDrama, null);
  const [slug, setSlug] = useState("");
  const params = useParams();
  const lang = params.lang as string || "id";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/${lang}/admin/short/short-video`}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Drama Pendek</h1>
          <p className="text-gray-400 text-sm">Buat judul serial drama baru</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 shadow-xl w-full">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="lang" value={lang} />
          
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {state.error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Judul Drama</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))}
                  className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Slug</label>
                <input 
                  type="text" 
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">URL Banner</label>
                <input 
                  type="url" 
                  name="banner_url"
                  placeholder="https://..."
                  className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Total Episode</label>
                <input 
                  type="number" 
                  name="total_episode"
                  defaultValue="0"
                  min="0"
                  className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Deskripsi Sinopsis</label>
                <textarea 
                  name="desc"
                  rows={5}
                  className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Pilih Genre (Bisa Lebih Dari Satu)</label>
                <div className="bg-[#0a0c13] border border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                  {genres.length > 0 ? genres.map(genre => (
                    <label key={genre.id} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="id_genre"
                        value={genre.id}
                        className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-[#ffbd59] focus:ring-[#ffbd59]"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors text-sm">{genre.name}</span>
                    </label>
                  )) : (
                    <p className="text-sm text-gray-500">Belum ada genre. Silakan buat genre terlebih dahulu.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-800">
            <Link 
              href={`/${lang}/admin/short/short-video`}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isPending ? 'Menyimpan...' : 'Simpan Drama'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
