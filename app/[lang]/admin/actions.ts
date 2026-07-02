"use server";

import { supabase } from "@/utils/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createImageKit(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const api_key = formData.get("api_key") as string;
  const secret_key = formData.get("secret_key") as string;
  const url_endpoint = formData.get("url_endpoint") as string;
  const lang = formData.get("lang") as string || "id";

  if (!name || !api_key || !secret_key || !url_endpoint) {
    return { error: "Semua field harus diisi." };
  }

  const { error } = await supabase.from("imagekit_api").insert([
    { name, api_key, secret_key, url_endpoint },
  ]);

  if (error) {
    return { error: "Gagal menyimpan data." };
  }

  revalidatePath(`/${lang}/admin/imagekit-api`);
  redirect(`/${lang}/admin/imagekit-api`);
}

export async function updateImageKit(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const api_key = formData.get("api_key") as string;
  const secret_key = formData.get("secret_key") as string;
  const url_endpoint = formData.get("url_endpoint") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id || !name || !api_key || !secret_key || !url_endpoint) {
    return { error: "Semua field harus diisi." };
  }

  const { error } = await supabase.from("imagekit_api").update(
    { name, api_key, secret_key, url_endpoint }
  ).eq("id", id);

  if (error) {
    return { error: "Gagal memperbarui data." };
  }

  revalidatePath(`/${lang}/admin/imagekit-api`);
  redirect(`/${lang}/admin/imagekit-api`);
}

export async function updatePaymentGateway(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const mode = formData.get("mode") as string;
  const lang = formData.get("lang") as string || "id";

  // TriPay
  const tp_merchant_code = formData.get("tp_merchant_code") as string;
  const tp_api_key = formData.get("tp_api_key") as string;
  const tp_private_key = formData.get("tp_private_key") as string;
  
  // Cryptomus
  const cm_merchant_id = formData.get("cm_merchant_id") as string;
  const cm_payment_key = formData.get("cm_payment_key") as string;
  const cm_charge_fee = formData.get("cm_charge_fee") === "true";

  const payload = {
    mode,
    tripay_config: {
      merchantCode: tp_merchant_code,
      apiKey: tp_api_key,
      privateKey: tp_private_key
    },
    cryptomus_config: {
      merchantId: cm_merchant_id,
      paymentKey: cm_payment_key,
      chargeFeeToCustomer: cm_charge_fee
    }
  };

  let dbError;
  if (id && id !== 'new') {
    const { error } = await supabase.from("payment_gateway").update(payload).eq("id", id);
    dbError = error;
  } else {
    const { error } = await supabase.from("payment_gateway").insert([payload]);
    dbError = error;
  }

  if (dbError) {
    console.error(dbError);
    return { error: "Gagal menyimpan konfigurasi Payment Gateway." };
  }

  revalidatePath(`/${lang}/admin/payment-gateway`);
  return { success: "Konfigurasi berhasil disimpan!" };
}

export async function updateUser(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const full_name = formData.get("full_name") as string;
  const level = formData.get("level") as string;
  const status = formData.get("status") as string;
  const membership = formData.get("membership") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id || !full_name) {
    return { error: "ID dan Nama lengkap harus diisi." };
  }

  const { error } = await supabase.from("users").update({
    full_name,
    level,
    status,
    membership
  }).eq("id", id);

  if (error) {
    return { error: "Gagal memperbarui pengguna." };
  }

  revalidatePath(`/${lang}/admin/user`);
  redirect(`/${lang}/admin/user`);
}

export async function createGenre(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const lang = formData.get("lang") as string || "id";

  if (!name || !slug) {
    return { error: "Semua field harus diisi." };
  }

  const { error } = await supabase.from("genre").insert([{ name, slug }]);

  if (error) {
    if (error.code === '23505') {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal menyimpan genre." };
  }

  revalidatePath(`/${lang}/admin/short/genre`);
  redirect(`/${lang}/admin/short/genre`);
}

export async function updateGenre(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id || !name || !slug) {
    return { error: "Semua field harus diisi." };
  }

  const { error } = await supabase.from("genre").update({ name, slug }).eq("id", id);

  if (error) {
    if (error.code === '23505') {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal memperbarui genre." };
  }

  revalidatePath(`/${lang}/admin/short/genre`);
  redirect(`/${lang}/admin/short/genre`);
}

export async function deleteGenre(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id) {
    return { error: "ID tidak valid." };
  }

  await supabase.from("genre").delete().eq("id", id);
  revalidatePath(`/${lang}/admin/short/genre`);
  return { success: "Berhasil dihapus." };
}

export async function createShortDrama(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const banner_url = formData.get("banner_url") as string;
  const desc = formData.get("desc") as string;
  const total_episode = parseInt(formData.get("total_episode") as string || "0");
  const lang = formData.get("lang") as string || "id";
  
  // Get all checked genres
  const id_genre = formData.getAll("id_genre");

  if (!name || !slug) {
    return { error: "Judul dan Slug wajib diisi." };
  }

  const payload = {
    name,
    slug,
    banner_url,
    desc,
    total_episode,
    id_genre // JSON array natively stored in Supabase JSONB
  };

  const { error } = await supabase.from("short_drama").insert([payload]);

  if (error) {
    if (error.code === '23505') {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal menyimpan drama pendek." };
  }

  revalidatePath(`/${lang}/admin/short/short-video`);
  redirect(`/${lang}/admin/short/short-video`);
}

export async function deleteShortDrama(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id) {
    return { error: "ID tidak valid." };
  }

  await supabase.from("short_drama").delete().eq("id", id);
  revalidatePath(`/${lang}/admin/short/short-video`);
  return { success: "Berhasil dihapus." };
}

export async function createActor(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const actor_banner_imagekit_url = (formData.get("actor_banner_imagekit_url") as string) || null;
  const lang = formData.get("lang") as string || "id";

  if (!name || !slug) {
    return { error: "Nama dan slug wajib diisi." };
  }

  const { error } = await supabase.from("actor").insert([{ name, slug, actor_banner_imagekit_url }]);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal menyimpan actor." };
  }

  revalidatePath(`/${lang}/admin/actor`);
  redirect(`/${lang}/admin/actor`);
}

export async function updateActor(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const actor_banner_imagekit_url = (formData.get("actor_banner_imagekit_url") as string) || null;
  const lang = formData.get("lang") as string || "id";

  if (!id || !name || !slug) {
    return { error: "ID, nama, dan slug wajib diisi." };
  }

  const { error } = await supabase
    .from("actor")
    .update({ name, slug, actor_banner_imagekit_url })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal memperbarui actor." };
  }

  revalidatePath(`/${lang}/admin/actor`);
  redirect(`/${lang}/admin/actor`);
}

export async function deleteActor(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id) {
    return { error: "ID tidak valid." };
  }

  await supabase.from("actor").delete().eq("id", id);
  revalidatePath(`/${lang}/admin/actor`);
  return { success: "Berhasil dihapus." };
}

export async function createRapidApi(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const rapidapi_host = formData.get("rapidapi_host") as string;
  const rapidapi_key = formData.get("rapidapi_key") as string;
  const lang = formData.get("lang") as string || "id";

  if (!name || !url || !rapidapi_host || !rapidapi_key) {
    return { error: "Semua field harus diisi." };
  }

  const { error } = await supabase.from("rapid_api").insert([
    { name, url, rapidapi_host, rapidapi_key },
  ]);

  if (error) {
    return { error: "Gagal menyimpan data." };
  }

  revalidatePath(`/${lang}/admin/rapid-api`);
  redirect(`/${lang}/admin/rapid-api`);
}

export async function updateRapidApi(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const rapidapi_host = formData.get("rapidapi_host") as string;
  const rapidapi_key = formData.get("rapidapi_key") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id || !name || !url || !rapidapi_host || !rapidapi_key) {
    return { error: "Semua field harus diisi." };
  }

  const { error } = await supabase.from("rapid_api").update(
    { name, url, rapidapi_host, rapidapi_key }
  ).eq("id", id);

  if (error) {
    return { error: "Gagal memperbarui data." };
  }

  revalidatePath(`/${lang}/admin/rapid-api`);
  redirect(`/${lang}/admin/rapid-api`);
}

export async function deleteRapidApi(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const lang = formData.get("lang") as string || "id";

  if (!id) {
    return { error: "ID tidak valid." };
  }

  await supabase.from("rapid_api").delete().eq("id", id);
  revalidatePath(`/${lang}/admin/rapid-api`);
  return { success: "Berhasil dihapus." };
}

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function importDramas(prevState: any, formData: FormData) {
  const provider = formData.get("provider") as string;
  const lang = formData.get("lang") as string || "id";

  if (!provider) {
    return { error: "Provider tidak valid." };
  }

  // Fetch Rapid API config
  const { data: config, error: configError } = await supabase
    .from("rapid_api")
    .select("*")
    .limit(1)
    .single();

  if (configError || !config) {
    return { error: "Konfigurasi Rapid API tidak ditemukan." };
  }

  try {
    const apiUrl = `${config.url}/dramas?provider=${provider}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': config.rapidapi_host,
        'x-rapidapi-key': config.rapidapi_key
      }
    });

    if (!response.ok) {
      return { error: `Gagal memanggil API: ${response.statusText}` };
    }

    const json = await response.json();
    if (!json.status || !json.data || !json.data.dramas) {
      return { error: "Format respons API tidak sesuai." };
    }

    const dramas = json.data.dramas;
    let successCount = 0;

    for (const d of dramas) {
      const slug = slugify(d.title) + "-" + d.dramaId; // ensure uniqueness
      const dramaData = {
        drama_id: String(d.dramaId),
        name: d.title,
        slug: slug,
        desc: d.desc,
        total_episode: d.total_episodes,
        banner_url: d.cover
      };

      // Upsert by drama_id 
      const { data: existing } = await supabase
        .from("short_drama")
        .select("id")
        .eq("drama_id", dramaData.drama_id)
        .single();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase.from("short_drama").update(dramaData).eq("id", existing.id);
        if (updateError) {
          console.error("Update error for", dramaData.name, ":", updateError);
        } else {
          successCount++;
        }
      } else {
        // Insert new
        const { error: insertError } = await supabase.from("short_drama").insert([dramaData]);
        if (insertError) {
          console.error("Insert error for", dramaData.name, ":", insertError);
        } else {
          successCount++;
        }
      }
    }

    revalidatePath(`/${lang}/admin/short/short-video`);
    return { success: `Berhasil import ${successCount} drama dari ${provider}.` };
  } catch (error: any) {
    console.error("Error importing dramas:", error);
    return { error: "Terjadi kesalahan saat import data." };
  }
}
