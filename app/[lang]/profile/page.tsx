import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Shield } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get("auth_session")?.value;
  
  if (!sessionStr) {
    redirect(`/${lang}/auth/login`);
  }

  const userSession = JSON.parse(sessionStr);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-200 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-[#121622]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href={`/${lang}`} className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-white">Profil Saya</h1>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <div className="bg-[#121622] border border-gray-800 rounded-2xl p-8 max-w-xl mx-auto shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#ffbd59] to-[#e5a94f] rounded-full flex items-center justify-center text-black text-4xl font-extrabold shadow-[0_0_30px_rgba(255,189,89,0.3)] mb-4">
              {userSession.fullName ? userSession.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-2xl font-bold text-white">{userSession.fullName}</h2>
            <p className="text-gray-400">{userSession.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#0a0c13] rounded-xl border border-gray-800">
              <div className="w-10 h-10 rounded-full bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Nama Lengkap</p>
                <p className="font-medium text-white">{userSession.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0c13] rounded-xl border border-gray-800">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white">{userSession.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0c13] rounded-xl border border-gray-800">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-medium text-white">{userSession.level}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <form action={async () => {
              "use server";
              const { logoutUser } = await import("../auth/actions");
              await logoutUser(lang);
            }}>
              <button type="submit" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-3 rounded-xl transition border border-red-500/20">
                Keluar / Logout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
