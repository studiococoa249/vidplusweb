import { supabase } from "@/utils/supabase";
import PlayContainer from "./PlayContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function PlayDramaPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  const { data: drama } = await supabase
    .from("short_drama")
    .select("*")
    .eq("id", slug)
    .single();

  const { data: episodesData } = await supabase
    .from("play_short_drama")
    .select("*")
    .eq("id_short_drama", slug)
    .order("episode", { ascending: true });

  const episodes = episodesData || [];
  const title = drama?.name || "Short Drama";

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50 px-4 pt-[env(safe-area-inset-top,12px)] pb-3 flex items-center gap-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        <Link
          href={`/${lang}`}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition pointer-events-auto backdrop-blur-sm"
        >
          <ChevronLeft size={22} className="text-white" />
        </Link>
        <h1 className="text-white font-semibold text-sm truncate flex-1 text-center mr-10 drop-shadow-md pointer-events-auto">
          {title}
        </h1>
      </div>

      {/* Player */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md h-full md:h-[90vh] md:rounded-2xl overflow-hidden bg-black relative">
          <PlayContainer episodes={episodes} dramaName={title} />
        </div>
      </div>
    </div>
  );
}
