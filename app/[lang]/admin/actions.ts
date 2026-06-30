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

