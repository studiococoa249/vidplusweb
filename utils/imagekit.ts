import { supabase } from "@/utils/supabase";

export type ImageKitConfig = {
  id: string;
  name: string;
  api_key: string;
  secret_key: string;
  url_endpoint: string;
};

/**
 * Ambil semua ImageKit API config dari DB dan pilih satu secara random (rotasi).
 * Dengan banyak akun, upload tersebar merata sehingga tidak cepat penuh.
 */
export async function getRotatedImageKitConfig(): Promise<ImageKitConfig | null> {
  const { data, error } = await supabase
    .from("imagekit_api")
    .select("id, name, api_key, secret_key, url_endpoint");

  if (error || !data || data.length === 0) return null;

  // Pilih secara random
  const idx = Math.floor(Math.random() * data.length);
  return data[idx] as ImageKitConfig;
}
