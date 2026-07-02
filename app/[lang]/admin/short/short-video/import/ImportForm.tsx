"use client";

import { useActionState } from "react";
import { importDramas } from "../../../actions";
import Link from "next/link";
import { Download } from "lucide-react";

export default function ImportForm({ lang }: { lang: string }) {
  const [state, formAction, isPending] = useActionState(importDramas, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="lang" value={lang} />
      
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Pilih Provider</label>
        <select 
          name="provider"
          required
          className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all appearance-none"
        >
          <option value="">-- Pilih Provider --</option>
          <option value="GoodShort">GoodShort</option>
          <option value="DramaBox">DramaBox</option>
        </select>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Link 
          href={`/${lang}/admin/short/short-video`}
          className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          Kembali
        </Link>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          <span>{isPending ? 'Mengimpor...' : 'Proses Import'}</span>
        </button>
      </div>
    </form>
  );
}
