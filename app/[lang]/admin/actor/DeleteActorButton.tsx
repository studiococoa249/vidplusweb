"use client";

import { useActionState } from "react";
import { deleteActor } from "../actions";
import { Trash2 } from "lucide-react";

export default function DeleteActorButton({ id, lang }: { id: string; lang: string }) {
  const [, formAction, isPending] = useActionState(deleteActor, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="lang" value={lang} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm("Yakin ingin menghapus actor ini?")) e.preventDefault();
        }}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
        title="Hapus"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
