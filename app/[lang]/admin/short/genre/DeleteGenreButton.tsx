"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteGenre } from "../../actions";
import { useRouter } from "next/navigation";

export default function DeleteGenreButton({ id, lang }: { id: string, lang: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (confirm("Apakah Anda yakin ingin menghapus genre ini?")) {
          startTransition(async () => {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("lang", lang);
            await deleteGenre(null, formData);
          });
        }
      }}
      disabled={isPending}
      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 size={16} />
    </button>
  );
}
