import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Edit, Trash2, Plus, User as ActorIcon, Video } from "lucide-react";
import DeleteActorButton from "./DeleteActorButton";

export default async function ActorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { data: actors } = await supabase
    .from("actor")
    .select("*")
    .order("create_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Actor</h1>
          <p className="text-gray-400 text-sm">Tambah, edit, dan hapus data actor</p>
        </div>
        <Link
          href={`/${lang}/admin/actor/create`}
          className="flex items-center gap-2 bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
        >
          <Plus size={16} />
          Tambah Actor
        </Link>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 bg-[#0a0c13]/50">
          <p className="text-xs text-gray-500">{actors?.length ?? 0} total actor</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Banner</th>
                <th className="px-6 py-4 font-medium">Dibuat</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {actors && actors.length > 0 ? (
                actors.map((actor) => (
                  <tr key={actor.id} className="hover:bg-[#1a1f2e] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {actor.actor_banner_imagekit_url ? (
                          <img
                            src={actor.actor_banner_imagekit_url}
                            alt={actor.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#ffbd59]">
                            <ActorIcon size={18} />
                          </div>
                        )}
                        <span className="font-medium text-white">{actor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        {actor.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {actor.actor_banner_imagekit_url ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
                          Ada
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-500">
                          Kosong
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(actor.create_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/${lang}/admin/actor/actor-video/${actor.id}`}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Add Video"
                        >
                          <Video size={16} />
                        </Link>
                        <Link
                          href={`/${lang}/admin/actor/edit/${actor.id}`}
                          className="p-2 text-gray-400 hover:text-[#ffbd59] hover:bg-[#ffbd59]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteActorButton id={actor.id} lang={lang} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data actor.
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
