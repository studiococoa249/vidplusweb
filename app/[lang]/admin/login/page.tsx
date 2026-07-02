"use client";

import React, { useState } from "react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string || "id";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push(`/${lang}/admin`);
    } else {
      setError(result.message || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-[#121622] rounded-2xl shadow-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400 text-sm">Sign in to access the control panel</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-[#0a0c13] border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#ffbd59] transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-[#0a0c13] border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#ffbd59] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffbd59] text-black font-semibold rounded-lg px-4 py-3 mt-4 hover:bg-[#e5a84f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
