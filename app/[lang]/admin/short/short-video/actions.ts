"use server";

import { supabase } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

export async function getEpisodes(internalId: string, dramaId: string, lang: string) {
  try {
    if (!dramaId) {
      return { success: false, message: "Drama ID is missing" };
    }

    // Fetch API configuration from the rapid_api table
    const { data: apiConfig, error: apiError } = await supabase
      .from("rapid_api")
      .select("*")
      .limit(1)
      .single();

    if (apiError || !apiConfig) {
      return { success: false, message: "RapidAPI configuration not found in database." };
    }

    const apiUrl = apiConfig.url || "https://latiri.my.id/api/proxy";
    const rapidApiHost = apiConfig.rapidapi_host || "";
    const rapidApiKey = apiConfig.rapidapi_key || "";

    const axios = require('axios');

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/episodes/${dramaId}`,
      headers: { 
        'x-rapidapi-host': rapidApiHost, 
        'x-rapidapi-key': rapidApiKey
      }
    };

    const response = await axios.request(config);
    const json = response.data;

    if (json.status && json.code === 200 && json.data?.episodes) {
      const episodes = json.data.episodes;
      
      // Map the response to the play_short_drama table structure
      const insertData = episodes.map((ep: any) => ({
        id_short_drama: internalId, // UUID from short_drama
        url: ep.url,
        episode: ep.episode,
        duration: ep.duration,
      }));

      // Insert into Supabase
      // We might want to clear existing episodes first, or handle upsert.
      // Let's delete existing episodes for this drama first to avoid duplicates
      await supabase
        .from("play_short_drama")
        .delete()
        .eq("id_short_drama", internalId);

      const { error } = await supabase
        .from("play_short_drama")
        .insert(insertData);

      if (error) {
        throw error;
      }

      revalidatePath(`/${lang}/admin/short/short-video`);
      return { success: true, message: `Successfully imported ${episodes.length} episodes.` };
    } else {
      return { success: false, message: "Invalid API response format." };
    }
  } catch (error: any) {
    console.error("Error fetching episodes:", error);
    return { success: false, message: error.message || "Failed to fetch episodes" };
  }
}
