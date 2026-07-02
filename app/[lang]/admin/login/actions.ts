"use server";

import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createAdminSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  // Find user by email
  const { data: user, error } = await supabase
    .from("users")
    .select("id, password, level")
    .eq("email", email)
    .single();

  if (error || !user) {
    return { success: false, message: "Invalid email or password" };
  }

  // Check if user is admin
  if (user.level !== "Admin") {
    return { success: false, message: "Access denied. Admin only." };
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    return { success: false, message: "Invalid email or password" };
  }

  // Create session
  const { token, expires } = await createAdminSession(user.id);
  
  // Await cookies() to set the cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
