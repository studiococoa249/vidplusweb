"use client";

import { useActionState } from "react";
import { updateUser } from "../../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditForm({ initialData }: { initialData: any }) {
  const [state, formAction, isPending] = useActionState(updateUser, null);
  const params = useParams();
  const lang = params.lang as string || "id";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/${lang}/admin/user`}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Pengguna</h1>
          <p className="text-gray-400 text-sm">Perbarui profil dan status pengguna</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 shadow-xl">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="id" value={initialData.id} />
          <input type="hidden" name="lang" value={lang} />
          
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Pengguna (Read-only)</label>
            <input 
              type="email" 
              defaultValue={initialData.email}
              readOnly
              className="w-full bg-[#07090e] border border-gray-800 rounded-xl py-2.5 px-4 text-gray-500 focus:outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
            <input 
              type="text" 
              name="full_name"
              defaultValue={initialData.full_name}
              required
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Level</label>
              <select name="level" defaultValue={initialData.level} className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all">
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              <select name="status" defaultValue={initialData.status} className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all">
                <option value="Active">Active</option>
                <option value="Not-Active">Not-Active</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Membership</label>
            <select name="membership" defaultValue={initialData.membership} className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all">
              <option value="Free">Free</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href={`/${lang}/admin/user`}
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
              <span>{isPending ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
