export interface StreamEpisode {
  id: number;
  id_drama: number;
  name: string;
  url: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface StreamDrama {
  id: number;
  id_provider_drama: string;
  id_user: string;
  name: string;
  slug: string;
  banner_url: string;
  description: string | null;
  total_episode: number;
  episodes: StreamEpisode[];
}

export interface StreamProvider {
  id: number;
  name: string;
  slug: string;
  total_drama: number;
  total_episode: number;
  dramas: StreamDrama[];
}

export interface StreamJSON {
  generated_at: string;
  summary: {
    total_provider: number;
    total_drama: number;
    total_episode: number;
  };
  providers: StreamProvider[];
}

import fs from "fs/promises";
import path from "path";

export async function fetchStreamData(): Promise<StreamJSON> {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "stream.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Failed to read local stream data: ${error}`);
  }
}

export async function getAllDramas(): Promise<StreamDrama[]> {
  try {
    const data = await fetchStreamData();
    const dramas: StreamDrama[] = [];
    const seenIds = new Set<number>();
    
    if (data && data.providers) {
      for (const provider of data.providers) {
        if (provider.dramas) {
          for (const drama of provider.dramas) {
            if (!seenIds.has(drama.id)) {
              seenIds.add(drama.id);
              dramas.push(drama);
            }
          }
        }
      }
    }
    return dramas;
  } catch (error) {
    console.error("Error in getAllDramas:", error);
    return [];
  }
}

export async function getDramaById(id: number | string): Promise<StreamDrama | null> {
  const dramas = await getAllDramas();
  const targetId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(targetId)) return null;
  return dramas.find(d => d.id === targetId) || null;
}
