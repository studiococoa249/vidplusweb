"use client";

import { useActionState } from "react";
import { loginUser } from "../actions";
import { Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const params = useParams();
  const lang = params.lang as string || "id";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#07090e] selection:bg-[#ffbd59] selection:text-black text-gray-200 font-sans">
      
      {/* Branding Section (Hidden on Mobile, Visible on Desktop) */}
      <div className="hidden md:flex w-full md:w-1/2 lg:w-3/5 bg-gradient-to-br from-[#121622] to-[#07090e] items-center justify-center p-12 relative overflow-hidden border-r border-gray-900/50">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/07090e/121622?text=+')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-80" />
        
        <div className="relative z-10 max-w-lg">
          <img src="/logo.png" alt="Logo" className="h-16 mb-8 object-contain" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            {lang === 'id' ? 'Tonton Drama Pendek Premium, Kapan Saja.' : 'Watch Premium Short Dramas, Anytime.'}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {lang === 'id' 
              ? 'Dapatkan akses ke ratusan judul eksklusif dengan kualitas terbaik di Vidplus+. Sensasi sinematik dalam genggaman Anda.' 
              : 'Get access to hundreds of exclusive titles with the best quality on Vidplus+. Cinematic sensation in your hands.'}
          </p>
        </div>
      </div>

      {/* Form Section (Mobile: Bottom Sheet, Desktop: Centered Card) */}
      <div className="flex-1 flex flex-col justify-between md:justify-center relative w-full md:w-1/2 lg:w-2/5 p-0 md:p-8 bg-[#07090e] md:bg-transparent">
        
        {/* Mobile Header Graphic (Only on Mobile) */}
        <div className="md:hidden h-[30vh] w-full bg-gradient-to-b from-[#121622] to-[#07090e] flex flex-col items-center justify-center relative">
           <img src="/logo.png" alt="Logo" className="h-12 object-contain relative z-10 mb-4" />
           <p className="text-[#ffbd59] font-medium tracking-wide text-sm relative z-10 uppercase">
             {lang === 'id' ? 'Platform Eksklusif' : 'Exclusive Platform'}
           </p>
        </div>

        {/* The Auth Card */}
        <div className="w-full bg-[#121622] md:bg-[#121622]/80 md:backdrop-blur-xl rounded-t-[2.5rem] md:rounded-2xl -mt-10 md:mt-0 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-2xl md:border md:border-gray-800 p-8 lg:p-12 mx-auto max-w-md flex-1 md:flex-none flex flex-col">
          
          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {lang === 'id' ? 'Selamat Datang' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 text-sm">
              {lang === 'id' ? 'Masuk ke akun Anda' : 'Sign in to your account'}
            </p>
          </div>

          <form action={formAction} className="space-y-6 flex-1">
            {/* Hidden input to pass lang to server action */}
            <input type="hidden" name="lang" value={lang} />

            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ffbd59] transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-[#0a0c13] md:bg-[#07090e] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between">
                <span>Password</span>
                <a href="#" className="text-[#ffbd59] hover:text-white transition-colors capitalize">
                  {lang === 'id' ? 'Lupa?' : 'Forgot?'}
                </a>
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ffbd59] transition-colors" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-[#0a0c13] md:bg-[#07090e] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#ffbd59] to-[#e5a94f] hover:from-[#e5a94f] hover:to-[#ffbd59] text-black font-bold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ffbd59]/20 hover:shadow-[#ffbd59]/40 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isPending ? (lang === 'id' ? 'Memproses...' : 'Processing...') : (
                <>
                  <span>{lang === 'id' ? 'Masuk Sekarang' : 'Sign In Now'}</span>
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {lang === 'id' ? 'Belum punya akun?' : 'Don\'t have an account?'} {' '}
            <Link href={`/${lang}/auth/register`} className="text-[#ffbd59] hover:text-white font-medium transition-colors">
              {lang === 'id' ? 'Daftar di sini' : 'Register here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
