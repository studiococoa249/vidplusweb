"use server";

import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const lang = formData.get("lang") as string || "id";

  if (!fullName || !email || !password) {
    return { error: "Semua field harus diisi." };
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { error } = await supabase.from("users").insert([
      {
        full_name: fullName,
        email,
        password: hashedPassword,
      },
    ]);

    if (error) {
      if (error.code === '23505') { // unique violation for email
         return { error: "Email sudah terdaftar." };
      }
      console.error(error);
      return { error: "Gagal mendaftar. Silakan coba lagi." };
    }
  } catch (err) {
    console.error(err);
    return { error: "Terjadi kesalahan sistem." };
  }

  // Redirect to login page on success
  redirect(`/${lang}/auth/login`);
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const lang = formData.get("lang") as string || "id";

  if (!email || !password) {
    return { error: "Email dan password harus diisi." };
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { error: "Email atau password salah." };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return { error: "Email atau password salah." };
    }

    // Set basic cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", JSON.stringify({
      id: user.id,
      email: user.email,
      level: user.level,
      fullName: user.full_name
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/"
    });

  } catch (err) {
    console.error(err);
    return { error: "Terjadi kesalahan sistem." };
  }

  // Redirect to home page on success
  redirect(`/${lang}`);
}

export async function logoutUser(lang: string = "id") {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect(`/${lang}/auth/login`);
}
