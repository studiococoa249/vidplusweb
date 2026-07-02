import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Edit, Search, Shield, User as UserIcon } from "lucide-react";
import DeleteUserButton from "./DeleteUserButton";

export default async function UserPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("create_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Pengguna</h1>
          <p className="text-gray-400 text-sm">Lihat dan edit data pengguna aplikasi</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0a0c13]/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari email atau nama..." 
              className="w-full bg-[#121622] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#ffbd59]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Pengguna</th>
                <th className="px-6 py-4 font-medium text-center">Level</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Membership</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#ffbd59]">
                          {user.level === 'Admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.full_name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.level === 'Admin' ? 'bg-[#ffbd59]/10 text-[#ffbd59]' : 'bg-gray-800 text-gray-300'}`}>
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.membership === 'VIP' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-500'}`}>
                        {user.membership}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/${lang}/admin/user/edit/${user.id}`}
                          className="p-2 text-gray-400 hover:text-[#ffbd59] hover:bg-[#ffbd59]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteUserButton userId={user.id} userName={user.full_name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data pengguna.
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
