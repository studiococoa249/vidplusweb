"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase.from("users").delete().eq("id", userId);
    setIsDeleting(false);
    
    if (error) {
      alert("Gagal menghapus pengguna: " + error.message);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
        title="Hapus"
      >
        <Trash2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121622] border border-gray-800 rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Hapus</h3>
            <p className="text-gray-400 text-sm mb-6">
              Apakah Anda yakin ingin menghapus pengguna <span className="text-white font-semibold">{userName}</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
