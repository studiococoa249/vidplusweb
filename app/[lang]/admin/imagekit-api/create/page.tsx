"use client";

import { useActionState } from "react";
import { createImageKit } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";

export default function CreateImageKitPage() {
  const [state, formAction, isPending] = useActionState(createImageKit, null);
  const params = useParams();
  const lang = params.lang as string || "id";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/${lang}/admin/imagekit-api`}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah ImageKit API</h1>
          <p className="text-gray-400 text-sm">Masukkan kredensial API ImageKit baru</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 shadow-xl">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="lang" value={lang} />
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nama Konfigurasi</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
              placeholder="Misal: ImageKit Utama"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">API Key</label>
            <input 
              type="text" 
              name="api_key"
              required
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
              placeholder="public_..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Secret Key</label>
            <input 
              type="password" 
              name="secret_key"
              required
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
              placeholder="private_..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">URL Endpoint</label>
            <input 
              type="url" 
              name="url_endpoint"
              required
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
              placeholder="https://ik.imagekit.io/your_id"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href={`/${lang}/admin/imagekit-api`}
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
              <span>{isPending ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
