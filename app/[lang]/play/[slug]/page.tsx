import { getDramaById } from "@/utils/streamData";
import PlayContainer from "./PlayContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { supabase } from "@/utils/supabase";

export default async function PlayDramaPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  const drama = await getDramaById(slug);

  // Fetch current user and VIP status
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get("auth_session")?.value;
  let userSession = null;
  let isVip = false;

  if (sessionStr) {
    try {
      userSession = JSON.parse(sessionStr);
      if (userSession?.id) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("membership, end_membership")
          .eq("id", userSession.id)
          .single();

        if (dbUser && dbUser.membership === "VIP") {
          if (dbUser.end_membership) {
            const expiry = new Date(dbUser.end_membership);
            if (expiry > new Date()) {
              isVip = true;
            }
          } else {
            isVip = true;
          }
        }
      }
    } catch (e) {
      console.error("Error checking VIP status:", e);
    }
  }

  const episodes = (drama?.episodes || []).map((ep, idx) => {
    const match = ep.name.match(/\d+/);
    const epNum = match ? parseInt(match[0], 10) : idx + 1;
    return {
      id: String(ep.id),
      url: ep.url,
      episode: epNum,
      duration: 0,
      type: ep.type || "Free",
    };
  });

  const title = drama?.name || "Short Drama";

  const user = {
    isLoggedIn: !!userSession,
    isVip,
  };

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
          <PlayContainer episodes={episodes} dramaName={title} user={user} lang={lang} />
        </div>
      </div>
    </div>
  );
}

