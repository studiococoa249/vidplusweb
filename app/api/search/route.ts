import { NextResponse } from "next/server";
import { getAllDramas } from "@/utils/streamData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (query.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const dramas = await getAllDramas();
    const filtered = dramas
      .filter((drama) =>
        drama.name.toLowerCase().includes(query.trim().toLowerCase())
      )
      .slice(0, 20)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        slug: item.slug,
        banner_url: item.banner_url,
        total_episode: item.total_episode,
        view_count: 0, // not directly available in json, setting default
      }));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search dramas" }, { status: 500 });
  }
}
