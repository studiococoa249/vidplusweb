import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { ArrowLeft, Video, Plus, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import DeleteActorVideoButton from "../DeleteActorVideoButton";

function getVideoUrl(urlVideo: unknown): string {
  if (!urlVideo) return "";
  if (typeof urlVideo === "string") return urlVideo;
  if (typeof urlVideo === "object" && urlVideo !== null && "url" in urlVideo) {
    return String((urlVideo as { url: string }).url);
  }
  return "";
}

export default async function ActorVideoPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  const { data: actor } = await supabase
    .from("actor")
    .select("id, name, slug")
    .eq("id", id)
    .single();

  if (!actor) {
    notFound();
  }

  const { data: videos } = await supabase
    .from("video_actor")
    .select("*")
    .eq("id_actor", id)
    .order("create_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href={`/${lang}/admin/actor`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Actor
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="text-[#ffbd59]" size={28} />
            <span>Video Actor</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Kelola video untuk <span className="text-white font-medium">{actor.name}</span>
          </p>
        </div>
        <Link
          href={`/${lang}/admin/actor/actor-video/${id}/create`}
          className="flex items-center gap-2 bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
        >
          <Plus size={16} />
          Tambah URL Video
        </Link>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 bg-[#0a0c13]/50">
          <p className="text-xs text-gray-500">{videos?.length ?? 0} total video</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0a0c13] text-gray-400 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">URL Video</th>
                <th className="px-6 py-4 font-medium">Ditambahkan</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {videos && videos.length > 0 ? (
                videos.map((video) => {
                  const url = getVideoUrl(video.url_video);
                  return (
                    <tr key={video.id} className="hover:bg-[#1a1f2e] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-xl">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ffbd59] hover:underline truncate"
                            title={url}
                          >
                            {url}
                          </a>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 p-1 text-gray-500 hover:text-white transition-colors"
                            title="Buka URL"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(video.create_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DeleteActorVideoButton id={video.id} idActor={id} lang={lang} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Belum ada video untuk actor ini.
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
