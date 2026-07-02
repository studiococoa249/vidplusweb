import React from "react";
import { supabase } from "@/utils/supabase";
import PlayContainer from "./PlayContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function PlayDramaPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  
  // Fetch data from short_drama
  const { data: drama } = await supabase
    .from("short_drama")
    .select("*")
    .eq("id", slug)
    .single();

  // Fetch episodes from play_short_drama
  const { data: episodesData } = await supabase
    .from("play_short_drama")
    .select("*")
    .eq("id_short_drama", slug)
    .order("episode", { ascending: true });

  const episodes = episodesData || [];
  const title = drama?.name || "Short Drama";

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col w-full h-full">
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <Link href={`/${lang}`} className="text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition pointer-events-auto">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-white font-semibold text-sm truncate flex-1 ml-4 text-center mr-10 pointer-events-auto drop-shadow-md">{title}</h1>
      </div>

      {/* Video Player Container */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md h-full md:h-[90vh] md:rounded-xl overflow-hidden shadow-2xl bg-black relative">
          <PlayContainer episodes={episodes} dramaName={title} />
        </div>
      </div>
    </div>
  );
}
